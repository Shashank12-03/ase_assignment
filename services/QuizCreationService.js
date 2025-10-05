const Quiz = require('../models/quiz.model');

class QuizCreationService {
  async createQuiz(title, time) {
    const quiz = new Quiz({
      title,
      time,
      attempted: 0,
      questions: []
    });
    
    await quiz.save();
    return quiz;
  }

  async addQuestions(quizId, questionsArray) {
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    const processedQuestions = questionsArray.map(question => {
      const options = question.options.map((optionText, index) => ({
        id: `opt_${index + 1}`,
        answer: optionText
      }));

      const correctOptionIds = question.correct.map(index => `opt_${index + 1}`);

      return {
        id: question.id,
        content: question.content,
        marks: question.marks || 1,
        type: question.type,
        options: options,
        correct: correctOptionIds
      };
    });

    quiz.questions.push(...processedQuestions);
    await quiz.save();
    
    return quiz;
  }

  async getQuizQuestions(quizId) {
    const quiz = await Quiz.findById(quizId).select('-questions.correct');
    
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    
    return quiz;
  }

  async getQuizById(quizId) {
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    
    return quiz;
  }

  async getAllQuizzes(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [quizzes, total] = await Promise.all([
      Quiz.find()
        .select('title time attempted createdAt')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Quiz.countDocuments()
    ]);

    const quizzesWithCount = quizzes.map(quiz => ({
      ...quiz,
      questionCount: 0
    }));

    const quizIds = quizzes.map(q => q._id);
    const quizzesWithQuestions = await Quiz.find({ _id: { $in: quizIds } })
      .select('_id questions')
      .lean();

    const questionCountMap = {};
    quizzesWithQuestions.forEach(q => {
      questionCountMap[q._id.toString()] = q.questions ? q.questions.length : 0;
    });

    const result = quizzesWithCount.map(quiz => ({
      ...quiz,
      questionCount: questionCountMap[quiz._id.toString()] || 0
    }));

    return {
      quizzes: result,
      total
    };
  }
}

module.exports = new QuizCreationService();
