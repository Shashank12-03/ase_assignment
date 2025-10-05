const QuizCreationService = require('../services/QuizCreationService');
const QuizEvaluationService = require('../services/QuizEvaluationService');
const { respondSuccess, respondError, createPaginationMeta } = require('../utils/responseHelper');

class QuizController {
  async getAllQuizzes(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      if (page < 1 || limit < 1 || limit > 100) {
        return respondError(res, 'Invalid pagination parameters. Page must be >= 1 and limit between 1-100', 400);
      }

      const { quizzes, total } = await QuizCreationService.getAllQuizzes(page, limit);
      const meta = createPaginationMeta(page, limit, total);

      return respondSuccess(res, quizzes, meta);
    } catch (error) {
      next(error);
    }
  }

  async createQuiz(req, res, next) {
    try {
      const { title, time } = req.body;

      if (!title) {
        return respondError(res, 'Title is required', 400);
      }

      const quiz = await QuizCreationService.createQuiz(title, time);
      
      return respondSuccess(res, quiz, null, 201);
    } catch (error) {
      next(error);
    }
  }

  async addQuestions(req, res, next) {
    try {
      const { id } = req.params;
      const { questions } = req.body;

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return respondError(res, 'Questions array is required', 400);
      }

      const quiz = await QuizCreationService.addQuestions(id, questions);
      
      return respondSuccess(res, quiz);
    } catch (error) {
      if (error.message === 'Quiz not found') {
        return respondError(res, error.message, 404);
      }
      next(error);
    }
  }

  async getQuizQuestions(req, res, next) {
    try {
      const { id } = req.params;

      const quiz = await QuizCreationService.getQuizQuestions(id);
      
      return respondSuccess(res, quiz);
    } catch (error) {
      if (error.message === 'Quiz not found') {
        return respondError(res, error.message, 404);
      }
      next(error);
    }
  }

  async submitQuiz(req, res, next) {
    try {
      const { id } = req.params;
      const { responses } = req.body;

      if (!responses || !Array.isArray(responses)) {
        return respondError(res, 'Responses array is required', 400);
      }

      const result = await QuizEvaluationService.evaluateQuiz(id, responses);
      
      return respondSuccess(res, result);
    } catch (error) {
      if (error.message === 'Quiz not found') {
        return respondError(res, error.message, 404);
      }
      next(error);
    }
  }
}

module.exports = new QuizController();
