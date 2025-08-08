const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/formacion';

async function getCourseId() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db();
    
    // Buscar el primer curso
    const course = await db.collection('cursos').findOne({});
    
    if (course) {
      console.log(`ID del curso: ${course._id}`);
      console.log(`Título: ${course.title}`);
      console.log(`Videos: ${course.videos?.length || 0}`);
    } else {
      console.log('No se encontraron cursos');
    }
    
  } catch (error) {
    console.error('Error consultando curso:', error);
  } finally {
    await client.close();
  }
}

// Ejecutar el script
getCourseId().catch(console.error);
