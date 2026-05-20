import User from '../models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email already used' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });
  res.status(201).json({ message: 'User created', user: newUser });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
    });

    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};