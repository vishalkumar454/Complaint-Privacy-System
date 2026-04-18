const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/complaints-db')
  .then(async () => {
    const Complaint = mongoose.model('Complaint', new mongoose.Schema({ 
        title: String,
        userId: mongoose.Schema.Types.Mixed // any type to see what it is
    }, { collection: 'complaints' }));
    
    const comps = await Complaint.find();
    console.log("Total complaints:", comps.length);
    comps.slice(0, 5).forEach(c => {
       console.log("Complaint:", c.title, " | User ID:", c.userId, " | Type:", typeof c.userId);
    });
    process.exit();
  }).catch(err => {
      console.error(err);
      process.exit(1);
  });
