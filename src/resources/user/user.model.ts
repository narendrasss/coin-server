import { Schema, model } from 'mongoose';
import { IUser } from '../../types';
import * as bcrypt from 'bcrypt';

export const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  income: Number,
  budget: { type: Number, default: 0 },
  goal: {
    goal: String,
    funds: { type: Number, default: 0 },
    amount: Number,
    payment: Number,
    due: String,
  },
});

userSchema.pre<IUser>('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 8, (err, hashed) => {
    if (err) return next(err);

    this.password = hashed;
    next();
  });
});

userSchema.methods.check = function(pass: string) {
  const hashed: string = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass, hashed, (err, same) => {
      if (err) return reject(err);

      resolve(same);
    });
  });
};

export default model<IUser>('User', userSchema);
