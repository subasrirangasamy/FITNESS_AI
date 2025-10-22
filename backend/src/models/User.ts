// TODO: Add your User model here

// For MongoDB (using Mongoose):
// import mongoose from 'mongoose';
// 
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   goals: [{
//     type: { type: String },
//     target: Number,
//     current: Number,
//     deadline: Date
//   }],
//   achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
//   stats: {
//     level: { type: Number, default: 1 },
//     xp: { type: Number, default: 0 },
//     streak: { type: Number, default: 0 }
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });
// 
// export const User = mongoose.model('User', userSchema);

// For PostgreSQL (using Prisma or raw SQL):
// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
//   level: number;
//   xp: number;
//   streak: number;
//   created_at: Date;
//   updated_at: Date;
// }

export {};
