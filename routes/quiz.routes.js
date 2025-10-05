const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

router.get('/quiz', quizController.getAllQuizzes);
router.post('/quiz', quizController.createQuiz);
router.post('/quiz/:id/questions', quizController.addQuestions);
router.get('/quiz/:id', quizController.getQuizQuestions);
router.post('/quiz/:id/submit', quizController.submitQuiz);

module.exports = router;
