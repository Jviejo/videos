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
    
    // Crear videos para el curso de algoritmos
    const videos = [
      {
        _id: new ObjectId(),
        title: "010 - Algoritmos",
        description: "Introducción a los algoritmos y conceptos fundamentales de programación.",
        url: "http://ww.loom.com/share/010-ALGORITMOS.mp4",
        duration: "15 minutos",
        order: 1,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "020 - Condicional",
        description: "Estructuras condicionales y toma de decisiones en programación.",
        url: "http://ww.loom.com/share/020-CONDICIONAL.mp4",
        duration: "18 minutos",
        order: 2,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "030 - Bucle",
        description: "Bucles y estructuras de repetición en programación.",
        url: "http://ww.loom.com/share/030-BUCLE.mp4",
        duration: "20 minutos",
        order: 3,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "040 - Estructuras",
        description: "Estructuras de datos básicas y su implementación.",
        url: "http://ww.loom.com/share/040-ESTRUCTURAS.mp4",
        duration: "22 minutos",
        order: 4,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "050 - Diagramas de Flujo Condicional",
        description: "Creación de diagramas de flujo para estructuras condicionales.",
        url: "http://ww.loom.com/share/050-DIAGRAMAS-FLUJO-CODICIONAL.mp4",
        duration: "16 minutos",
        order: 5,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "060 - Diagramas de Flujo Bucle",
        description: "Creación de diagramas de flujo para estructuras de bucle.",
        url: "http://ww.loom.com/share/060-DIAGRAMAS-FLUJO-BUCLE.mp4",
        duration: "17 minutos",
        order: 6,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "070 - Diagramas de Flujo Mientras",
        description: "Diagramas de flujo para bucles while y do-while.",
        url: "http://ww.loom.com/share/070_DIAGRAMAS-FLUJO-MIENTRAS.mp4",
        duration: "19 minutos",
        order: 7,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "080 - Lenguajes",
        description: "Comparación de lenguajes de programación y sus características.",
        url: "http://ww.loom.com/share/080_LENGUAJES.mp4",
        duration: "25 minutos",
        order: 8,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "090 - Primero en JavaScript y Python",
        description: "Primeros pasos en JavaScript y Python: sintaxis básica y ejemplos.",
        url: "http://ww.loom.com/share/090_PIMERO-EN-JAVASCRIPT-Y-PYTHON.mp4",
        duration: "30 minutos",
        order: 9,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "100 - Contar Números",
        description: "Algoritmo para contar números y patrones numéricos.",
        url: "http://ww.loom.com/share/100_CONTAR-NUMEROS.mp4",
        duration: "14 minutos",
        order: 10,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "110 - Factorial",
        description: "Cálculo del factorial: implementación iterativa y recursiva.",
        url: "http://ww.loom.com/share/110_FACTORIAL.mp4",
        duration: "21 minutos",
        order: 11,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "120 - Suma Serie",
        description: "Algoritmos para calcular sumas de series matemáticas.",
        url: "http://ww.loom.com/share/120-SUMA-SERIE.mp4",
        duration: "18 minutos",
        order: 12,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "130 - Números Perfectos",
        description: "Identificación y cálculo de números perfectos.",
        url: "http://ww.loom.com/share/130-NUMEROS-PERFECTOS.mp4",
        duration: "20 minutos",
        order: 13,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "140 - Números Primos",
        description: "Algoritmos para identificar y generar números primos.",
        url: "http://ww.loom.com/share/140-NUMEROS PRIMOS.mp4",
        duration: "23 minutos",
        order: 14,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "150 - Lista",
        description: "Implementación y manipulación de listas en programación.",
        url: "http://ww.loom.com/share/150-LISTA.mp4",
        duration: "26 minutos",
        order: 15,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "160 - Media",
        description: "Cálculo de media aritmética y estadísticas básicas.",
        url: "http://ww.loom.com/share/160-MEDIA.mp4",
        duration: "16 minutos",
        order: 16,
        courseId: cursoAlgoritmos._id.toString()
      },
      {
        _id: new ObjectId(),
        title: "170 - Ordenación",
        description: "Algoritmos de ordenación: bubble sort, selection sort y más.",
        url: "http://ww.loom.com/share/170-ORDENACION.mp4",
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