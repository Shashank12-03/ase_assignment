# 📘 Quiz App Backend

A simple backend for creating quizzes, adding questions, fetching questions (without correct answers), and submitting answers for evaluation.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <https://github.com/Shashank12-03/ase_assignment.git>
cd ase_assignment
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ase_assignment
```

### 4. Run the server
```bash
npm start
```

Server will start at:  
👉 http://localhost:5000

---

## 📂 Project Structure
```
/quiz-app
  /controllers
    quiz.controller.js
  /services
    QuizCreationService.js
    QuizEvaluationService.js
  /routes
    quiz.routes.js
  /middlewares
    errorHandler.js
  /models
    quiz.model.js
  app.js
  README.md
```

---

## 🔗 API Endpoints

Base URL: `/api/quiz`

### 1. Create Quiz
**POST** `/api/quiz`  

**Request**
```json
{
  "title": "Math Quiz",
  "time": 30
}
```

**Response**
```json
{
  "_id": "6521b9f7e12a4c1234abcd",
  "title": "Math Quiz",
  "time": 30,
  "attempted": 0,
  "questions": []
}
```

### 2. Add Questions to Quiz
**POST** `/api/quiz/{quiz_id}/questions`  

**Request**
```json
{
  "questions": [
    {
      "id": "q1",
      "content": "What is 2+2?",
      "marks": 1,
      "type": "mcq",
      "options": ["1", "2", "4", "5"],
      "correct": [2]
    },
    {
      "id": "q2",
      "content": "Select all prime numbers",
      "marks": 2,
      "type": "multi-select",
      "options": ["2", "3", "4", "5"],
      "correct": [0, 1, 3]
    }
  ]
}
```

ℹ️ **Note**:  
- `correct` uses **indexes** (0-based).  
- Backend will generate unique option IDs (`opt_1`, `opt_2` …).  
- Correct indexes will be mapped to these option IDs.  

**Response**
```json
{
  "message": "Questions added successfully",
  "quizId": "6521b9f7e12a4c1234abcd"
}
```

### 3. Get Quiz Questions (without answers)
**GET** `/api/quiz/{quiz_id}`  

**Response**
```json
{
  "_id": "6521b9f7e12a4c1234abcd",
  "title": "Math Quiz",
  "time": 30,
  "attempted": 0,
  "questions": [
    {
      "id": "q1",
      "content": "What is 2+2?",
      "marks": 1,
      "type": "mcq",
      "options": [
        { "id": "opt_1", "answer": "1" },
        { "id": "opt_2", "answer": "2" },
        { "id": "opt_3", "answer": "4" },
        { "id": "opt_4", "answer": "5" }
      ]
    }
  ]
}
```

⚠️ Notice: `correct` field is **not returned**.

### 4. Submit Quiz Answers
**POST** `/api/quiz/{quiz_id}/submit`  

**Request**
```json
{
  "responses": [
    {
      "questionID": "q1",
      "answer": ["opt_3"]
    },
    {
      "questionID": "q2",
      "answer": ["opt_1", "opt_2", "opt_4"]
    }
  ]
}
```

**Response**
```json
{
  "score": 3,
  "total": 3
}
```

ℹ️ **Behavior**:
- Full marks only if all correct options are selected.  
- Otherwise, `0` marks for that question.  
- Quiz’s `attempted` count is automatically incremented.  



---
As I was unable to record a video, I have also added some considerations and design principles I followed, see [README_DESIGN.md](README_DESIGN.md).
