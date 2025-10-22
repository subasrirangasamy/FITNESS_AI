// TODO: Add your Meal/Nutrition model here

// For MongoDB:
// import mongoose from 'mongoose';
// 
// const mealSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   name: { type: String, required: true },
//   mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
//   calories: { type: Number, required: true },
//   protein: Number,
//   carbs: Number,
//   fats: Number,
//   notes: String,
//   loggedAt: { type: Date, default: Date.now }
// });
// 
// export const Meal = mongoose.model('Meal', mealSchema);

// For PostgreSQL:
// export interface Meal {
//   id: number;
//   user_id: number;
//   name: string;
//   meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
//   calories: number;
//   protein?: number;
//   carbs?: number;
//   fats?: number;
//   notes?: string;
//   logged_at: Date;
// }

export {};
