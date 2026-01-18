const {ObjectId} = require("mongodb");

const categoriaRepository = require("../../domain/repositories/categoriaRepository");

class CategoriaService {
  constructor() {
    this.categoriaRepository = categoriaRepository;
  }

  async obtenerTodos(usuarioId) {
    try {
      return await this.categoriaRepository.obtenerTodos(usuarioId);
    } catch (error) {
      console.error("Error en servicio - obtener todas las categorías:", error);
      throw {
        status: 500,
        message: "Error interno al obtener las categorías",
      };
    }
  }

  async crearCategoria(usuarioId, datos) {
    try {
      const nuevaCategoria = {
        usuarioId: new ObjectId(usuarioId),
        categoria: datos.nombreCategoria,
        icono: datos?.icono,
        color: datos?.color,
        nota: datos?.nota,
        subcategorias: [],
        auditoria: {
          creadoPor: {
            usuarioId: new ObjectId(usuarioId),
            nombre: datos.usuarioNombre,
          },
        },
      };
      return await this.categoriaRepository.crear(nuevaCategoria);
    } catch (error) {
      console.error("Error en servicio - crear categoría:", error);
      throw error;
    }
  }

  async crearSubcategoria(usuarioId, categoriaId, datos) {
    try {
      const nuevaSubcategoria = {
        subcategoria: datos.nombreSubcategoria,
        icono: datos?.icono,
        color: datos?.color,
        nota: datos?.nota,
        auditoria: {
          creadoPor: {
            usuarioId: new ObjectId(usuarioId),
            nombre: datos.usuarioNombre,
          },
        },
      };
      return await this.categoriaRepository.agregarSubcategoria(categoriaId, nuevaSubcategoria);
    } catch (error) {
      console.error("Error en servicio - crear subcategoría:", error);
      throw error;
    }
  }
}



module.exports = new CategoriaService();
