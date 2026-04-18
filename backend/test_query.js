import mongoose from 'mongoose';
import fs from 'fs';

const start = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/complaints-db');
    const db = mongoose.connection.db;
    const complaint = await db.collection('complaints').findOne({ _id: new mongoose.Types.ObjectId('69cc84a19692ed654462aac6') });
    
    fs.writeFileSync('C:\\Users\\Radhe_krishna\\.gemini\\antigravity\\brain\\075c97f6-9fc4-4aac-90ae-f26b3f4847fc\\query_result.json', JSON.stringify({ complaint }, null, 2));

  } catch(e) {
    fs.writeFileSync('C:\\Users\\Radhe_krishna\\.gemini\\antigravity\\brain\\075c97f6-9fc4-4aac-90ae-f26b3f4847fc\\query_result.json', JSON.stringify({ error: e.message }));
  } finally {
    process.exit();
  }
};
start();
