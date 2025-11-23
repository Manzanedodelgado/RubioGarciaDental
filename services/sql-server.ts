import mssql from 'mssql'
import { supabase } from '@/lib/supabase'

export interface SQLServerConfig {
  host: string
  database: string
  user: string
  password: string
  port?: number
  options?: any
}

class SQLServerService {
  private pool: mssql.ConnectionPool | null = null
  private config: SQLServerConfig

  constructor() {
    this.config = {
      host: process.env.SQLSERVER_HOST || 'gabinete2\\INFOMED',
      database: process.env.SQLSERVER_DATABASE || 'GELITE',
      user: process.env.SQLSERVER_USER || 'RUBIOGARCIADENTAL',
      password: process.env.SQLSERVER_PASSWORD || '666666',
      port: 1433,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
      }
    }
  }

  async connect(): Promise<void> {
    try {
      this.pool = await mssql.connect(this.config)
      console.log('✅ Conectado a SQL Server 2008')
    } catch (error) {
      console.error('❌ Error conectando a SQL Server:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.close()
      this.pool = null
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      if (!this.pool) {
        await this.connect()
      }
      await this.pool!.request().query('SELECT 1')
      return true
    } catch (error) {
      console.error('SQL Server no conectado:', error)
      return false
    }
  }

  // Citas
  async getCitasFromSQL(): Promise<any[]> {
    try {
      const result = await this.pool!.request().query(`
        SELECT 
          c.*,
          p.nombre as paciente_nombre,
          p.apellido as paciente_apellido,
          d.nombre as doctor_nombre,
          d.apellido as doctor_apellido
        FROM DCitas c
        LEFT JOIN DPacientes p ON c.paciente_id = p.id
        LEFT JOIN DDoctores d ON c.doctor_id = d.id
        WHERE c.fecha >= GETDATE()
        ORDER BY c.fecha, c.hora_inicio
      `)
      return result.recordset
    } catch (error) {
      console.error('Error obteniendo citas de SQL Server:', error)
      throw error
    }
  }

  async createCitaInSQL(cita: any): Promise<any> {
    try {
      const result = await this.pool!.request()
        .input('paciente_id', mssql.VarChar, cita.paciente_id)
        .input('doctor_id', mssql.VarChar, cita.doctor_id)
        .input('fecha', mssql.Date, cita.fecha)
        .input('hora_inicio', mssql.Time, cita.hora_inicio)
        .input('hora_fin', mssql.Time, cita.hora_fin)
        .input('tratamiento', mssql.NVarChar, cita.tratamiento)
        .input('estado', mssql.VarChar, cita.estado)
        .input('notas', mssql.NVarChar, cita.notas)
        .query(`
          INSERT INTO DCitas (paciente_id, doctor_id, fecha, hora_inicio, hora_fin, tratamiento, estado, notas)
          OUTPUT INSERTED.*
          VALUES (@paciente_id, @doctor_id, @fecha, @hora_inicio, @hora_fin, @tratamiento, @estado, @notas)
        `)
      return result.recordset[0]
    } catch (error) {
      console.error('Error creando cita en SQL Server:', error)
      throw error
    }
  }

  async updateCitaInSQL(id: string, updates: any): Promise<void> {
    try {
      const request = this.pool!.request()
      let query = 'UPDATE DCitas SET '
      const params = []

      Object.keys(updates).forEach((key, index) => {
        if (index > 0) query += ', '
        query += `${key} = @${key}`
        request.input(key, this.getSQLType(key), updates[key])
      })

      query += ' OUTPUT INSERTED.* WHERE id = @id'
      request.input('id', mssql.VarChar, id)
      
      await request.query(query)
    } catch (error) {
      console.error('Error actualizando cita en SQL Server:', error)
      throw error
    }
  }

  // Pacientes
  async getPacientesFromSQL(): Promise<any[]> {
    try {
      const result = await this.pool!.request().query(`
        SELECT * FROM DPacientes
        WHERE estado = 'activo'
        ORDER BY apellido, nombre
      `)
      return result.recordset
    } catch (error) {
      console.error('Error obteniendo pacientes de SQL Server:', error)
      throw error
    }
  }

  // Doctores
  async getDoctoresFromSQL(): Promise<any[]> {
    try {
      const result = await this.pool!.request().query(`
        SELECT * FROM DDoctores
        WHERE estado = 'activo'
        ORDER BY apellido, nombre
      `)
      return result.recordset
    } catch (error) {
      console.error('Error obteniendo doctores de SQL Server:', error)
      throw error
    }
  }

  // Sincronización completa
  async syncAllToSupabase(): Promise<any> {
    try {
      console.log('🔄 Iniciando sincronización SQL Server -> Supabase...')
      
      const [citas, pacientes, doctores] = await Promise.all([
        this.getCitasFromSQL(),
        this.getPacientesFromSQL(),
        this.getDoctoresFromSQL()
      ])

      // Sincronizar doctores
      if (doctores.length > 0) {
        await this.syncDoctores(doctores)
      }

      // Sincronizar pacientes
      if (pacientes.length > 0) {
        await this.syncPacientes(pacientes)
      }

      // Sincronizar citas
      if (citas.length > 0) {
        await this.syncCitas(citas)
      }

      console.log('✅ Sincronización completada')
      return {
        citas: citas.length,
        pacientes: pacientes.length,
        doctores: doctores.length,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Error en sincronización:', error)
      throw error
    }
  }

  private async syncCitas(citas: any[]): Promise<void> {
    for (const cita of citas) {
      try {
        const { error } = await supabase
          .from('citas')
          .upsert({
            id: cita.id,
            paciente_id: cita.paciente_id,
            doctor_id: cita.doctor_id,
            fecha: cita.fecha,
            hora_inicio: cita.hora_inicio,
            hora_fin: cita.hora_fin,
            tratamiento: cita.tratamiento,
            estado: cita.estado,
            notas: cita.notas,
            documentos_firmados: JSON.parse(cita.documentos_firmados || '[]')
          })
        if (error) throw error
      } catch (error) {
        console.error(`Error sincronizando cita ${cita.id}:`, error)
      }
    }
  }

  private async syncPacientes(pacientes: any[]): Promise<void> {
    for (const paciente of pacientes) {
      try {
        const { error } = await supabase
          .from('pacientes')
          .upsert({
            id: paciente.id,
            numero_paciente: paciente.numero_paciente,
            nombre: paciente.nombre,
            apellido: paciente.apellido,
            dni: paciente.dni,
            fecha_nacimiento: paciente.fecha_nacimiento,
            telefono_fijo: paciente.telefono_fijo,
            telefono_movil: paciente.telefono_movil,
            email: paciente.email,
            direccion: paciente.direccion,
            alergias: paciente.alergias,
            enfermedades: paciente.enfermedades,
            medicamentos: paciente.medicamentos,
            preferencias_comunicacion: paciente.preferencias_comunicacion,
            consentimiento_lopd: paciente.consentimiento_lopd,
            estado: paciente.estado
          })
        if (error) throw error
      } catch (error) {
        console.error(`Error sincronizando paciente ${paciente.id}:`, error)
      }
    }
  }

  private async syncDoctores(doctores: any[]): Promise<void> {
    for (const doctor of doctores) {
      try {
        const { error } = await supabase
          .from('doctors')
          .upsert({
            id: doctor.id,
            nombre: doctor.nombre,
            apellido: doctor.apellido,
            numero_colegiado: doctor.numero_colegiado,
            especialidades: JSON.parse(doctor.especialidades || '[]'),
            horarios: JSON.parse(doctor.horarios || '[]'),
            estado: doctor.estado
          })
        if (error) throw error
      } catch (error) {
        console.error(`Error sincronizando doctor ${doctor.id}:`, error)
      }
    }
  }

  // Métodos específicos para sincronización de pacientes
  async syncPacienteToSqlServer(paciente: any): Promise<void> {
    try {
      // Verificar si el paciente existe en SQL Server
      const existing = await this.pool!.request()
        .input('dni', mssql.VarChar, paciente.dni)
        .query('SELECT id FROM DPacientes WHERE dni = @dni')

      if (existing.recordset.length > 0) {
        // Actualizar paciente existente
        await this.pool!.request()
          .input('id', mssql.VarChar, existing.recordset[0].id)
          .input('numero_paciente', mssql.VarChar, paciente.numero_paciente || '')
          .input('nombre', mssql.NVarChar, paciente.nombre)
          .input('apellido', mssql.NVarChar, paciente.apellido)
          .input('dni', mssql.VarChar, paciente.dni)
          .input('fecha_nacimiento', mssql.Date, paciente.fecha_nacimiento)
          .input('telefono_fijo', mssql.VarChar, paciente.telefono_fijo || '')
          .input('telefono_movil', mssql.VarChar, paciente.telefono_movil)
          .input('email', mssql.NVarChar, paciente.email)
          .input('direccion', mssql.NVarChar, paciente.direccion)
          .input('alergias', mssql.NVarChar, paciente.alergias || '')
          .input('enfermedades', mssql.NVarChar, paciente.enfermedades || '')
          .input('medicamentos', mssql.NVarChar, paciente.medicamentos || '')
          .input('preferencias_comunicacion', mssql.NVarChar, paciente.preferencias_comunicacion || '')
          .input('consentimiento_lopd', mssql.VarChar, paciente.consentimiento_lopd || 'sin_firmar')
          .input('estado', mssql.VarChar, paciente.estado || 'activo')
          .input('fecha_actualizacion', mssql.DateTime, new Date())
          .query(`
            UPDATE DPacientes SET 
              numero_paciente = @numero_paciente,
              nombre = @nombre,
              apellido = @apellido,
              fecha_nacimiento = @fecha_nacimiento,
              telefono_fijo = @telefono_fijo,
              telefono_movil = @telefono_movil,
              email = @email,
              direccion = @direccion,
              alergias = @alergias,
              enfermedades = @enfermedades,
              medicamentos = @medicamentos,
              preferencias_comunicacion = @preferencias_comunicacion,
              consentimiento_lopd = @consentimiento_lopd,
              estado = @estado,
              fecha_actualizacion = @fecha_actualizacion
            WHERE id = @id
          `)
      } else {
        // Crear nuevo paciente
        const id = `pac_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        await this.pool!.request()
          .input('id', mssql.VarChar, id)
          .input('numero_paciente', mssql.VarChar, paciente.numero_paciente || `PAC${Date.now()}`)
          .input('nombre', mssql.NVarChar, paciente.nombre)
          .input('apellido', mssql.NVarChar, paciente.apellido)
          .input('dni', mssql.VarChar, paciente.dni)
          .input('fecha_nacimiento', mssql.Date, paciente.fecha_nacimiento)
          .input('telefono_fijo', mssql.VarChar, paciente.telefono_fijo || '')
          .input('telefono_movil', mssql.VarChar, paciente.telefono_movil)
          .input('email', mssql.NVarChar, paciente.email)
          .input('direccion', mssql.NVarChar, paciente.direccion)
          .input('alergias', mssql.NVarChar, paciente.alergias || '')
          .input('enfermedades', mssql.NVarChar, paciente.enfermedades || '')
          .input('medicamentos', mssql.NVarChar, paciente.medicamentos || '')
          .input('preferencias_comunicacion', mssql.NVarChar, paciente.preferencias_comunicacion || '')
          .input('consentimiento_lopd', mssql.VarChar, paciente.consentimiento_lopd || 'sin_firmar')
          .input('estado', mssql.VarChar, paciente.estado || 'activo')
          .input('fecha_registro', mssql.Date, new Date().toISOString().split('T')[0])
          .input('fecha_actualizacion', mssql.DateTime, new Date())
          .query(`
            INSERT INTO DPacientes (
              id, numero_paciente, nombre, apellido, dni, fecha_nacimiento,
              telefono_fijo, telefono_movil, email, direccion, alergias, 
              enfermedades, medicamentos, preferencias_comunicacion, 
              consentimiento_lopd, estado, fecha_registro, fecha_actualizacion
            ) VALUES (
              @id, @numero_paciente, @nombre, @apellido, @dni, @fecha_nacimiento,
              @telefono_fijo, @telefono_movil, @email, @direccion, @alergias,
              @enfermedades, @medicamentos, @preferencias_comunicacion,
              @consentimiento_lopd, @estado, @fecha_registro, @fecha_actualizacion
            )
          `)
      }
    } catch (error) {
      console.error('Error sincronizando paciente a SQL Server:', error)
      throw error
    }
  }

  async syncPacientesToSupabase(): Promise<void> {
    try {
      console.log('🔄 Sincronizando pacientes de SQL Server a Supabase...')
      const pacientesSQL = await this.getPacientesFromSQL()
      
      for (const paciente of pacientesSQL) {
        const { error } = await supabase
          .from('pacientes')
          .upsert({
            id: paciente.id,
            numero_paciente: paciente.numero_paciente,
            nombre: paciente.nombre,
            apellido: paciente.apellido,
            dni: paciente.dni,
            fecha_nacimiento: paciente.fecha_nacimiento,
            telefono_fijo: paciente.telefono_fijo,
            telefono_movil: paciente.telefono_movil,
            email: paciente.email,
            direccion: paciente.direccion,
            alergias: paciente.alergias,
            enfermedades: paciente.enfermedades,
            medicamentos: paciente.medicamentos,
            preferencias_comunicacion: paciente.preferencias_comunicacion,
            consentimiento_lopd: paciente.consentimiento_lopd,
            estado: paciente.estado,
            fecha_registro: paciente.fecha_registro,
            created_at: paciente.fecha_registro,
            updated_at: paciente.fecha_actualizacion || paciente.fecha_registro
          })
        if (error) {
          console.error(`Error sincronizando paciente ${paciente.id}:`, error)
        }
      }
      console.log('✅ Sincronización de pacientes completada')
    } catch (error) {
      console.error('Error en syncPacientesToSupabase:', error)
      throw error
    }
  }

  async syncSupabaseToSqlServer(): Promise<void> {
    try {
      console.log('🔄 Sincronizando pacientes de Supabase a SQL Server...')
      
      // Obtener todos los pacientes de Supabase que han sido modificados recientemente
      const { data: pacientesSupabase, error } = await supabase
        .from('pacientes')
        .select('*')
        .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Última 24 horas

      if (error) throw error

      for (const paciente of pacientesSupabase || []) {
        await this.syncPacienteToSqlServer(paciente)
      }
      
      console.log('✅ Sincronización de Supabase a SQL Server completada')
    } catch (error) {
      console.error('Error en syncSupabaseToSqlServer:', error)
      throw error
    }
  }

  private getSQLType(column: string): mssql.ISqlType {
    switch (column) {
      case 'fecha':
        return mssql.Date
      case 'hora_inicio':
      case 'hora_fin':
        return mssql.Time
      case 'total':
      case 'subtotal':
      case 'iva':
        return mssql.Decimal(10, 2)
      case 'id':
        return mssql.VarChar(50)
      case 'created_at':
      case 'updated_at':
      case 'fecha_emision':
        return mssql.DateTime
      default:
        return mssql.NVarChar
    }
  }

  // CDC - Change Data Capture
  async setupCDC(): Promise<void> {
    try {
      console.log('🔄 Configurando CDC para SQL Server...')
      
      // Habilitar CDC en las tablas principales
      await this.pool!.request().query(`
        EXEC sys.sp_cdc_enable_table
        @source_schema = 'dbo',
        @source_name = 'DCitas',
        @role_name = NULL,
        @supports_net_changes = 1
      `)

      await this.pool!.request().query(`
        EXEC sys.sp_cdc_enable_table
        @source_schema = 'dbo',
        @source_name = 'DPacientes',
        @role_name = NULL,
        @supports_net_changes = 1
      `)

      console.log('✅ CDC configurado')
    } catch (error) {
      console.error('❌ Error configurando CDC:', error)
      throw error
    }
  }

  async getCDCChanges(table: string, fromLSN?: string): Promise<any[]> {
    try {
      const request = this.pool!.request()
      let query = `
        SELECT * FROM cdc.dbo_${table}_CT
      `
      
      if (fromLSN) {
        request.input('from_lsn', mssql.Binary, Buffer.from(fromLSN, 'hex'))
        query += ' WHERE __$start_lsn > @from_lsn'
      }

      query += ' ORDER BY __$start_lsn'
      
      const result = await request.query(query)
      return result.recordset
    } catch (error) {
      console.error(`Error obteniendo cambios CDC de ${table}:`, error)
      throw error
    }
  }
}

export const sqlServerService = new SQLServerService()
export default SQLServerService