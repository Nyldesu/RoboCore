import express from 'express';
const router = express.Router();

const USER = {
  username: '100-00001',
  password: 'admin'
};

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    res.json({ success: true, role: 'admin' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

export default router;
