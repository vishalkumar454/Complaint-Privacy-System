import mongoose from 'mongoose';

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/complaints-db');
        const db = mongoose.connection.db;
        const complaint = await db.collection('complaints').findOne({ _id: new mongoose.Types.ObjectId('69cc84a19692ed654462aac6') });
        console.log("=== COMPLAINT FROM DB ===");
        console.log(JSON.stringify(complaint, null, 2));
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
})();
