const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/formacion';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db();
    
    // Limpiar colecciones existentes
    await db.collection('cursos').deleteMany({});
    await db.collection('videos').deleteMany({});
    
    // Crear el curso de algoritmos
    const cursoAlgoritmos = {
      _id: new ObjectId(),
      title: "Algoritmos",
      description: "Aprende los fundamentos de la programación con algoritmos básicos. Desde conceptos fundamentales hasta implementación práctica en JavaScript y Python.",
      module: "Programación Básica",
      duration: "8 horas",
      level: "Básico",
      students: 1500,
      imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
      tags: ["Básico", "Algoritmos"],
      videos: []
    };
    
    // Insertar el curso
    const cursoResult = await db.collection('cursos').insertOne(cursoAlgoritmos);
    console.log('1 curso insertado');
    
    // Crear videos para el curso de algoritmos con los datos reales
    const videos = [
      {
        _id: new ObjectId(),
        title: "010 - Algoritmos",
        description: "Introducción a los algoritmos y conceptos fundamentales de programación.",
        url: "https://www.loom.com/share/4eab3724ede649639fad7f7b885f71c9?sid=9b518692-97be-41fb-897f-1a01a9a04169",
        duration: "15 minutos",
        order: 1,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "020 - Condicional",
        description: "Estructuras condicionales y toma de decisiones en programación.",
        url: "https://www.loom.com/share/8f77ca976fa14f398e9d9e1c929bab84?sid=91ea34d9-de95-4074-ae00-4fd4acca9eea",
        duration: "18 minutos",
        order: 2,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "030 - Bucle",
        description: "Bucles y estructuras de repetición en programación.",
        url: "https://www.loom.com/share/2fa9bd336bd541c38450745618197ad7?sid=23e0b298-1076-4ee0-b696-ba4625c62752",
        duration: "20 minutos",
        order: 3,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "040 - Estructuras",
        description: "Estructuras de datos básicas y su implementación.",
        url: "https://www.loom.com/share/f596664a2b5e433dbf185dca8c1a8c07?sid=67baf02c-2d92-4c39-9de9-6ccc8ef87eff",
        duration: "22 minutos",
        order: 4,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "050 - Diagramas de Flujo Condicional",
        description: "Creación de diagramas de flujo para estructuras condicionales.",
        url: "https://www.loom.com/share/59fd6ec098114efc8011b11b0f4d8427?sid=f5f8fe53-1959-4e33-a3bf-a716619b3d29",
        duration: "16 minutos",
        order: 5,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "060 - Diagramas de Flujo Bucle",
        description: "Creación de diagramas de flujo para estructuras de bucle.",
        url: "https://www.loom.com/share/253596583bdb4a44ad72a0e0520e3956?sid=85c7290d-dd9a-4200-b5ff-acad7166a32f",
        duration: "17 minutos",
        order: 6,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "070 - Diagramas de Flujo Mientras",
        description: "Diagramas de flujo para bucles while y do-while.",
        url: "https://www.loom.com/share/932b9e0fb91349abb44da611cdae03c9?sid=327f53c7-ed28-45c2-818c-daa37e60ed4f",
        duration: "19 minutos",
        order: 7,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "080 - Lenguajes",
        description: "Comparación de lenguajes de programación y sus características.",
        url: "https://www.loom.com/share/29aa5154c56443a6967b315df1f1dff2?sid=fe5fdf62-3f67-4e65-a711-03ef813c2cc7",
        duration: "25 minutos",
        order: 8,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "090 - Primero en JavaScript y Python",
        description: "Primeros pasos en JavaScript y Python: sintaxis básica y ejemplos.",
        url: "https://www.loom.com/share/32169ff8d15b42f89803796acc2b9954?sid=c5613cc9-5137-4a54-b32e-b5f932f91991",
        duration: "30 minutos",
        order: 9,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "100 - Contar Números",
        description: "Algoritmo para contar números y patrones numéricos.",
        url: "https://www.loom.com/share/805e08c83de744feb7ba36a278a38853?sid=609744e0-7622-4c2b-8ad9-e1a09085d4fa",
        duration: "14 minutos",
        order: 10,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "110 - Factorial",
        description: "Cálculo del factorial: implementación iterativa y recursiva.",
        url: "https://www.loom.com/share/02c823b6e9634c4da645c7c5fce7050f?sid=2b8c1be7-b6fb-4797-88e7-c6d45089fc4b",
        duration: "21 minutos",
        order: 11,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "120 - Suma Serie",
        description: "Algoritmos para calcular sumas de series matemáticas.",
        url: "https://www.loom.com/share/53ffcd8fd13a41c8b8b8c68df8acb201?sid=82dfa249-7e50-450a-9d9e-5ec5dc3821ba",
        duration: "18 minutos",
        order: 12,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "130 - Números Perfectos",
        description: "Identificación y cálculo de números perfectos.",
        url: "https://www.loom.com/share/245eb21552b54bab85753f1e94e4cb84?sid=8b7d74ea-ef22-4a43-a8e2-fad74eb206da",
        duration: "20 minutos",
        order: 13,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "140 - Números Primos",
        description: "Algoritmos para identificar y generar números primos.",
        url: "https://www.loom.com/share/0959ad3dc60440c3ae980b770101396b?sid=91346747-d5ee-4f2e-bc34-a199b99aa0c4",
        duration: "23 minutos",
        order: 14,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "150 - Lista",
        description: "Implementación y manipulación de listas en programación.",
        url: "https://www.loom.com/share/dbc83565c5fd48a1ab555395ac062da1?sid=52dd7cf9-8596-4367-be9c-f37692e59797",
        duration: "26 minutos",
        order: 15,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "160 - Media",
        description: "Cálculo de media aritmética y estadísticas básicas.",
        url: "https://www.loom.com/share/bc2b0284d3f44113a1d9257890114b18?sid=3074e6fa-aa2f-4720-872e-52641ed2abec",
        duration: "16 minutos",
        order: 16,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "170 - Ordenación",
        description: "Algoritmos de ordenación: bubble sort, selection sort y más.",
        url: "https://www.loom.com/share/78a958373cbe47e6a35ce01e362d59b6?sid=d8733ef5-6cc0-4876-a613-3927ead2e4af",
        duration: "28 minutos",
        order: 17,
        courseId: cursoAlgoritmos._id.toString()
      }
    ];
    
    // Insertar videos
    const videosResult = await db.collection('videos').insertMany(videos);
    console.log(`${videosResult.insertedCount} videos insertados`);
    
    // Actualizar el curso con los videos
    await db.collection('cursos').updateOne(
      { _id: cursoAlgoritmos._id },
      { $set: { videos: videos } }
    );
    
    console.log('Base de datos poblada exitosamente con el curso de Algoritmos!');
    
  } catch (error) {
    console.error('Error poblando la base de datos:', error);
  } finally {
    await client.close();
  }
}

// Ejecutar el script
seedDatabase().catch(console.error); 