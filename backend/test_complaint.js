import mongoose from 'mongoose';
import { env } from './src/config/env.config.js';
import { Complaint } from './src/models/Complaint.model.js';
import fs from 'fs';

const start = async () => {
  try {
    const uri = env?.MONGO_URI || 'mongodb://127.0.0.1:27017/privacy-shield';
    await mongoose.connect(uri);
    const complaint = await Complaint.findById('69cc84a19692ed654462aac6');
    fs.writeFileSync('result.json', JSON.stringify({ complaint }, null, 2));
  } catch(e) {
    fs.writeFileSync('result.json', JSON.stringify({ error: e.message }));
  } finally {
    process.exit(0);
  }
};
start();
