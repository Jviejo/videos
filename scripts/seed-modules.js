const { MongoClient } = require('mongodb');

const modules = [
  {
    title: "Next.js",
    description: "Aprende a construir aplicaciones web modernas y escalables con React y Next.js. Domina el renderizado del lado del servidor, rutas dinámicas y optimización de rendimiento.",
    aiFeature: "🤖 IA asistente para debugging y optimización de código",
    icon: "Code",
    iconColor: "bg-black",
    tags: ["React", "SSR", "TypeScript"],
    order: 1
  },
  {
    title: "SQL & Bases de Datos",
    description: "Gestiona y optimiza bases de datos relacionales. Aprende consultas complejas, índices, transacciones y diseño de esquemas eficientes.",
    aiFeature: "🤖 IA para generación y optimización de consultas SQL",
    icon: "Database",
    iconColor: "bg-blue-600",
    tags: ["MySQL", "PostgreSQL", "Optimización"],
    order: 2
  },
  {
    title: "Docker",
    description: "Containeriza tus aplicaciones y simplifica el despliegue. Aprende Dockerfiles, Docker Compose y mejores prácticas de containerización.",
    aiFeature: "🤖 IA para generación automática de Dockerfiles y troubleshooting",
    icon: "Ship",
    iconColor: "bg-blue-500",
    tags: ["Containers", "Docker Compose", "CI/CD"],
    order: 3
  },
  {
    title: "Kubernetes",
    description: "Orquesta y escala aplicaciones en contenedores. Domina pods, servicios, deployments y gestión de clusters en producción.",
    aiFeature: "🤖 IA para análisis de logs y diagnóstico automático de problemas",
    icon: "Box",
    iconColor: "bg-blue-600",
    tags: ["Pods", "Services", "Helm"],
    order: 4
  },
  {
    title: "Blockchain",
    description: "Explora el futuro de la tecnología descentralizada. Aprende smart contracts, DeFi, NFTs y desarrollo de aplicaciones blockchain.",
    aiFeature: "🤖 IA para auditoría de smart contracts y detección de vulnerabilidades",
    icon: "LinkIcon",
    iconColor: "bg-orange-500",
    tags: ["Smart Contracts", "DeFi", "Web3"],
    order: 5
  },
  {
    title: "DevOps",
    description: "Integra desarrollo y operaciones. Automatiza despliegues, monitoreo y gestión de infraestructura como código.",
    aiFeature: "🤖 IA para optimización de pipelines y automatización inteligente",
    icon: "BookOpen",
    iconColor: "bg-purple-600",
    tags: ["CI/CD", "Terraform", "Monitoring"],
    order: 6
  }
];

async function seedModules() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('formacion');
    const collection = db.collection('modulos');

    // Check if modules already exist
    const existingModules = await collection.countDocuments();
    
    if (existingModules > 0) {
      console.log(`Found ${existingModules} existing modules. Clearing collection...`);
      await collection.deleteMany({});
    }

    // Insert new modules
    const result = await collection.insertMany(modules);
    
    console.log(`✅ Successfully inserted ${result.insertedCount} modules:`);
    modules.forEach((module, index) => {
      console.log(`  ${index + 1}. ${module.title}`);
    });

  } catch (error) {
    console.error('❌ Error seeding modules:', error);
  } finally {
    await client.close();
  }
}

seedModules();