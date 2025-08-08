const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/formacion';

async function checkResources() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db();
    
    // Buscar videos que tengan recursos
    const videosWithResources = await db.collection('videos')
      .find({ resources: { $exists: true, $ne: [] } })
      .toArray();
    
    console.log(`\nVideos con recursos encontrados: ${videosWithResources.length}`);
    
    videosWithResources.forEach(video => {
      console.log(`\nVideo: ${video.title}`);
      console.log(`Recursos (${video.resources.length}):`);
      video.resources.forEach((resource, index) => {
        console.log(`  ${index + 1}. Tipo: ${resource.type}`);
        console.log(`     URL: ${resource.url}`);
        console.log(`     Descripción: ${resource.description}`);
      });
    });
    
  } catch (error) {
    console.error('Error consultando recursos:', error);
  } finally {
    await client.close();
  }
}

// Ejecutar el script
checkResources().catch(console.error);
