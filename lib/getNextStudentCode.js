import Counter from './counterModel';

export async function getNextStudentCode(fullName) {
  const name3 = (fullName || '').replace(/\s+/g, '').toUpperCase().slice(0, 3);
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'studentCounter' },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  const padded = String(counter.seq).padStart(4, '0');
  return `SHR${name3}${padded}`; // Ex: SHRRAH0001
}
