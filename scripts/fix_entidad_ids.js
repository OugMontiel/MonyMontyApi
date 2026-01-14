const {MongoClient, ObjectId} = require("mongodb");

// Configuración de conexión (Ajusta según tu .env o hardcodea si es un script de un solo uso local)
const MONGO_URI = process.env.MONGO_URY;
// NOTA: Verifica el nombre de la DB o el URI antes de correr

async function migrate() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("Conectado a MongoDB");

    const db = client.db("MonyMonty");
    const collection = db.collection("movimiento");

    // Buscar documentos donde entidadId es string
    const movimientos = await collection
      .find({
        entidadId: {$type: "string"},
      })
      .toArray();

    console.log(`Encontrados ${movimientos.length} documentos con entidadId tipo String.`);

    let validos = 0;
    let errores = 0;

    for (const mov of movimientos) {
      if (ObjectId.isValid(mov.entidadId)) {
        await collection.updateOne({_id: mov._id}, {$set: {entidadId: new ObjectId(mov.entidadId)}});
        validos++;
      } else {
        console.warn(`Movimiento ${mov._id} tiene un entidadId inválido: ${mov.entidadId}`);
        errores++;
      }
    }

    console.log(`Migración completada.`);
    console.log(`Actualizados: ${validos}`);
    console.log(`Errores/Ignorados: ${errores}`);
  } catch (error) {
    console.error("Error en migración:", error);
  } finally {
    await client.close();
  }
}

migrate();
