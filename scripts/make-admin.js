const { MongoClient } = require('mongodb');

async function makeUserAdmin(email) {
  if (!email) {
    console.log('Usage: node scripts/make-admin.js <email>');
    console.log('Example: node scripts/make-admin.js admin@example.com');
    return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('formacion');
    const collection = db.collection('users');

    // Find and update the user
    const result = await collection.updateOne(
      { email: email },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ User with email "${email}" not found`);
    } else if (result.modifiedCount === 0) {
      console.log(`ℹ️  User "${email}" is already an admin`);
    } else {
      console.log(`✅ User "${email}" is now an admin`);
    }

  } catch (error) {
    console.error('❌ Error updating user:', error);
  } finally {
    await client.close();
  }
}

// Get email from command line arguments
const email = process.argv[2];
makeUserAdmin(email);