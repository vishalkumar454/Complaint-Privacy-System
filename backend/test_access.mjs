import mongoose from 'mongoose';

const getSafeId = (obj) => obj ? (obj._id ? obj._id.toString() : obj.toString()) : null;

const runTests = () => {
  // Test case 1: null or undefined
  console.assert(getSafeId(null) === null, "Test 1 Failed");
  console.assert(getSafeId(undefined) === null, "Test 2 Failed");

  // Test case 2: raw ObjectId
  const objId = new mongoose.Types.ObjectId('69cc84a19692ed654462aac6');
  console.assert(getSafeId(objId) === '69cc84a19692ed654462aac6', "Test 3 Failed");

  // Test case 3: populated Mongoose document
  const populatedDoc = { _id: objId, name: 'Test User', email: 'test@example.com' };
  console.assert(getSafeId(populatedDoc) === '69cc84a19692ed654462aac6', "Test 4 Failed");

  // Test case 4: stringified id
  console.assert(getSafeId('69cc84a19692ed654462aac6') === '69cc84a19692ed654462aac6', "Test 5 Failed");

  console.log("All getSafeId tests passed successfully.");
};

runTests();
