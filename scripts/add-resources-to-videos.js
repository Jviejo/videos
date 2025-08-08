const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/formacion';

async function addResourcesToVideos() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db();
    
    // Recursos de ejemplo para agregar a algunos videos
    const resourcesToAdd = [
      {
        videoTitle: "010 - Algoritmos",
        resources: [
          {
            type: "pdf",
            url: "https://ejemplo.com/algoritmos-basicos.pdf",
            description: "Guía completa de algoritmos básicos"
          },
          {
            type: "html",
            url: "https://ejemplo.com/ejercicios-algoritmos.html",
            description: "Ejercicios interactivos de algoritmos"
          }
        ]
      },
      {
        videoTitle: "020 - Condicional",
        resources: [
          {
            type: "video",
            url: "https://ejemplo.com/condicionales-extra.mp4",
            description: "Video adicional sobre condicionales"
          },
          {
            type: "imagen",
            url: "https://ejemplo.com/diagrama-condicional.png",
            description: "Diagrama de flujo de condicionales"
          }
        ]
      },
      {
        videoTitle: "030 - Bucle",
        resources: [
          {
            type: "pdf",
            url: "https://ejemplo.com/bucles-ejercicios.pdf",
            description: "Ejercicios prácticos de bucles"
          }
        ]
      }
    ];
    
    // Actualizar cada video con sus recursos
    for (const item of resourcesToAdd) {
      const result = await db.collection('videos').updateOne(
        { title: item.videoTitle },
        { $set: { resources: item.resources } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`Recursos agregados al video: ${item.videoTitle}`);
      } else {
        console.log(`Video no encontrado: ${item.videoTitle}`);
      }
    }
    
    console.log('Recursos agregados exitosamente!');
    
  } catch (error) {
    console.error('Error agregando recursos:', error);
  } finally {
    await client.close();
  }
}

// Ejecutar el script
addResourcesToVideos().catch(console.error);
