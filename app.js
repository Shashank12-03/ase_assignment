require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const quizRoutes = require('./routes/quiz.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api', quizRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Quiz Backend API',
    endpoints: {
      'POST /api/quiz': 'Create a new quiz',
      'POST /api/quiz/:id/questions': 'Add questions to a quiz',
      'GET /api/quiz/:id': 'Get quiz questions (without correct answers)',
      'POST /api/quiz/:id/submit': 'Submit quiz and get score'
    }
  });
});

app.use(errorHandler);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

module.exports = app;
