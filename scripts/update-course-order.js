const { MongoClient } = require('mongodb');

async function updateCourseOrder() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('formacion');
    const collection = db.collection('cursos');

    // Get all courses that don't have an order field
    const coursesWithoutOrder = await collection.find({ order: { $exists: false } }).toArray();
    
    console.log(`Found ${coursesWithoutOrder.length} courses without order field`);

    // Update each course with an incremental order
    for (let i = 0; i < coursesWithoutOrder.length; i++) {
      const course = coursesWithoutOrder[i];
      const newOrder = i + 1;
      
      await collection.updateOne(
        { _id: course._id },
        { $set: { order: newOrder } }
      );
      
      console.log(`Updated course "${course.title}" with order ${newOrder}`);
    }

    console.log('✅ All courses updated with order field');

  } catch (error) {
    console.error('❌ Error updating courses:', error);
  } finally {
    await client.close();
  }
}

updateCourseOrder();