// TODO: Add your Workout model here

// For MongoDB:
// import mongoose from 'mongoose';
// 
// const workoutSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   exercise: { type: String, required: true },
//   category: { type: String, required: true },
//   sets: { type: Number, required: true },
//   reps: { type: Number, required: true },
//   weight: Number,
//   duration: Number, // in seconds
//   calories: Number,
//   notes: String,
//   completedAt: { type: Date, default: Date.now }
// });
// 
// export const Workout = mongoose.model('Workout', workoutSchema);

// For PostgreSQL:
// export interface Workout {
//   id: number;
//   user_id: number;
//   exercise: string;
//   category: string;
//   sets: number;
//   reps: number;
//   weight?: number;
//   duration?: number;
//   calories?: number;
//   notes?: string;
//   completed_at: Date;
// }

export {};
