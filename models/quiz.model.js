const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    default: 1
  },
  type: {
    type: String,
    enum: ['mcq', 'multi-select'],
    required: true
  },
  options: [optionSchema],
  correct: [{
    type: String,
    required: true
  }]
}, { _id: false });

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: false
  },
  attempted: {
    type: Number,
    default: 0
  },
  questions: [questionSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
