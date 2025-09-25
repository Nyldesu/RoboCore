const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const USER = {
  username: '100-00001',
  password: 'admin'
};

app.get('/', (req, res) => {
  res.send('Server is working!');
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    res.json({ success: true, role: 'admin' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Running at http://localhost:${PORT}`)
);
