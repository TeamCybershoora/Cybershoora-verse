import Counter from './counterModel';

export async function getNextStudentCode() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'studentCounter' },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );

  const year = new Date().getFullYear().toString().slice(2); // "24" for 2024
  const padded = String(counter.seq).padStart(4, '0');

  return `SHR${year}${padded}`; // Ex: SHR240001
}
