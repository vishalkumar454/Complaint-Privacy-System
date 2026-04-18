const mongoose = require('mongoose');
const { Complaint } = require('./src/models/Complaint.model.js');
const { User } = require('./src/models/User.model.js');
const { Advocate } = require('./src/models/Advocate.model.js');
const { env } = require('./src/config/env.config.js');

async function checkAccess() {
  try {
    await mongoose.connect(env.MONGO_URI);
    const complaint = await Complaint.findOne().sort('-createdAt'); // GET newest complaint
    if (!complaint) {
      console.log("No complaints exist to test.");
      process.exit();
    }

    console.log(`[TESTING COMPLAINT ID: ${complaint._id}]`);
    console.log(`- Complaint userID: ${complaint.userId} (${typeof complaint.userId})`);
    console.log(`- Complaint advocateID: ${complaint.assignedAdvocate} (${typeof complaint.assignedAdvocate})`);

    if (complaint.userId) {
      const user = await User.findById(complaint.userId);
      if (user) {
        const isOwner = complaint.userId.toString() === user._id.toString();
        console.log(`\nOWNER ACCESS TEST: ${isOwner ? ' SUCCESS' : ' FAILED'}`);
      }
    }

    if (complaint.assignedAdvocate) {
      const adv = await Advocate.findById(complaint.assignedAdvocate);
      if (adv) {
        const isAssignedAdvocate = complaint.assignedAdvocate.toString() === adv._id.toString();
        console.log(`\nADVOCATE ACCESS TEST: ${isAssignedAdvocate ? ' SUCCESS' : ' FAILED'}`);
      }
    } else {
      console.log(`\nADVOCATE ACCESS TEST: Skipped. No advocate assigned to this complaint yet.`);
    }

    process.exit();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

checkAccess();
