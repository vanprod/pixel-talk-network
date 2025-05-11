// routes/auth.ts
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // تحقق من صحة المستخدم
  const token = jwt.sign({ email }, 'SECRET_KEY');
  res.json({ token });
});

export default router;
