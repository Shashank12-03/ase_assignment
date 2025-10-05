const Quiz = require('../models/quiz.model');

class QuizEvaluationService {
  async evaluateQuiz(quizId, responses) {
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    let totalScore = 0;
    let totalMarks = 0;

    quiz.questions.forEach(question => {
      totalMarks += question.marks;
      
      const userResponse = responses.find(r => r.questionID === question.id);
      
      if (userResponse) {
        const userAnswers = userResponse.answer.sort();
        const correctAnswers = question.correct.sort();
        
        if (JSON.stringify(userAnswers) === JSON.stringify(correctAnswers)) {
          totalScore += question.marks;
        }
      }
    });

    await this.incrementAttempted(quizId);

    return {
      score: totalScore,
      total: totalMarks
    };
  }

  async incrementAttempted(quizId) {
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    quiz.attempted += 1;
    await quiz.save();
    
    return quiz;
  }
}

module.exports = new QuizEvaluationService();
