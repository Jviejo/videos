
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};
console.log(uri);
const client = new MongoClient(uri, options);
const clientPromise = client.connect();

// Siempre conecta usando process.env.MONGODB_URI (ya está en la variable uri)
// y asegura que el cliente se cree correctamente tanto en dev como en prod.



// const globalWithMongo = global as typeof globalThis & {
//   _mongoClientPromise?: Promise<MongoClient>;
// };

// if (process.env.NODE_ENV === 'development') {
//   if (!globalWithMongo._mongoClientPromise) {
//     console.log('Connecting to MongoDB in development mode');
//     globalWithMongo._mongoClientPromise = new MongoClient(uri, options).connect();
//   }
//   // console.log('Connected to MongoDB in development mode');
//   // globalWithMongo._mongoClientPromise = new MongoClient(uri, options).connect();  
//   // clientPromise = globalWithMongo._mongoClientPromise;
  
// } else {
//   console.log('Connecting to MongoDB in production mode');
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise; 