const {ObjectId} = require("mongodb");
const entidadRepository = require("../../domain/repositories/entidadRepository");
const movimientoService = require("../../../movimiento/application/services/movService");

class EntidadService {
  constructor() {
    this.entidadRepository = entidadRepository;
  }

  async obtenerTodos(usuarioId) {
    try {
      return await this.entidadRepository.obtenerTodos(usuarioId);
    } catch (error) {
      console.error("Error en servicio - obtener todas las entidades:", error);
      throw {
        status: 500,
        message: "Error interno al obtener las entidades",
      };
    }
  }

  async crear(data, usuario) {
    try {
      const fechaActual = new Date();

      const nuevaEntidad = {
        ...data,
        usuarioId: new ObjectId(usuario._id),
        createdAt: fechaActual,
        updatedAt: fechaActual,
        auditoria: {
          creadoPor: {
            usuarioId: new ObjectId(usuario._id),
            nombre: usuario.nombre,
          },
        },
      };

      const entidadCreada = await this.entidadRepository.crear(nuevaEntidad);

      if (entidadCreada && data.saldoInicial > 0) {
        const movData = {
          tipo: "INGRESO",
          esSistema: true,
          categoriaId: "696969bb499c876540c43603",
          subcategoriaId: "696969bb499c876540c43601",
          entidadId: entidadCreada._id,
          monto: data.saldoInicial,
          fecha: fechaActual,
          divisaId: data.divisaId,
        };
        await movimientoService.crear(movData, usuario);
      }

      return entidadCreada;
    } catch (error) {
      console.error("Error en servicio - crear entidad:", error);
      throw {
        status: error.status || 500,
        message: error.message || "Error interno al crear la entidad",
      };
    }
  }
}

module.exports = new EntidadService();
