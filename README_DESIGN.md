# 📝 Quiz App Backend - Design Decisions & Thought Process

This document explains the **thinking process, assumptions, and tradeoffs** behind the design of the Quiz App backend.  
It captures how we arrived at the final architecture and APIs.

---

## 🎯 Project Goal
Build a backend API for a simple quiz application that supports:
- Quiz creation
- Adding questions with options and correct answers
- Fetching quiz questions (without answers)
- Submitting answers and scoring

---

## 🔑 Key Decisions & Thought Process

### 1. API Design Philosophy
- Follow **RESTful principles** with clear separation of concerns.
- Endpoints were designed around **resources**: quizzes and questions.
- Example: `/api/quiz/:quizId/questions` makes it explicit that questions belong to a quiz.

**Tradeoff considered**:  
- One API for adding single vs. multiple questions.  
  ✅ We went with **bulk add (array input)** because it’s easier for frontend devs (first client) and keeps logic consistent.

---

### 2. Question Types
- Supported question types: **MCQ**, **Multi-select**, and later extendable (e.g., True/False).
- Each question carries **marks** at the question level.

**Scoring Rule**:  
- Full marks only if **all correct answers** are selected.  
- Otherwise **0 marks** for simplicity.  

**Reasoning**: Keeps evaluation logic straightforward for v1. Can evolve later.

---

### 3. Database Choice
- We chose **MongoDB (NoSQL)** for flexibility:  
  - Questions may have variable structure (MCQ, multi-select, etc.).  
  - Embedding questions inside quiz documents makes querying easier.  
  - Easier to evolve schema over time.

**Tradeoff considered**:  
- **SQL (Postgres/MySQL)** → strong relational integrity, joins for leaderboards.  
- **MongoDB** → flexible schema, simple for nested data (quizzes & questions).  
- Since we’re not implementing leaderboards or heavy analytics → ✅ MongoDB fits better.

---

### 4. Schema Design
We designed **two levels** but kept everything embedded in Quiz:

```js
Quiz {
  _id,
  title,
  time,
  attempted,
  questions: [
    {
      id,
      content,
      type,
      marks,
      options: [ { id, answer } ],
      correct: [optionIds]
    }
  ]
}
```

**Reasoning**:  
- Questions are tightly coupled with quizzes (no reuse).  
- Avoids managing multiple collections.  
- Easier to fetch quiz with all its questions in one query.

---

### 5. Correct Answer Representation
- **Problem**: Options need IDs, but `correct` also needs to store references.  
- Two possible solutions:  
  1. Use **indexes** of options in input → backend converts them to generated IDs. ✅ (Chosen)  
  2. Require frontend to generate option IDs first → too complex.

**Decision**: Use **indexes for input** and internally map them to option IDs.  
- Keeps API simple for frontend.  
- Avoids race condition of needing option IDs before question creation.

---

### 6. Separation of Concerns
- **Routers** → define API endpoints.  
- **Controllers** → handle request/response.  
- **Services** → business logic (creation vs. evaluation).  
- **Middlewares** → error handling & validation.

**Service classes:**
1. `QuizCreationService`  
   - `createQuiz`, `addQuestions`, `getQuizById`, `getQuizQuestions`  
2. `QuizEvaluationService`  
   - `evaluateQuiz`, `incrementAttempted`, `validateResponses`  

---

### 7. Error Handling & Status Codes
- Consistent error handling using middleware.  
- Example:  
  - 400 → bad request (invalid input)  
  - 404 → quiz not found  
  - 500 → server error  

**Reasoning**: Standardized error responses improve DX (developer experience).

---

## 📌 Assumptions Made
1. No user authentication is needed (per requirements).  
2. Each question belongs to exactly one quiz (no reuse).  
3. `attempted` only tracks count of submissions, not unique users.  
4. Partial scoring (for multi-select) is **not supported** in v1.  
5. Each question has at least **4 options and max 5 options** (reasonable constraint).  

---

## ⚖️ Tradeoffs Summary
| Decision Area       | Option A | Option B | Final Choice | Why |
|---------------------|----------|----------|--------------|-----|
| DB Choice           | SQL      | NoSQL    | MongoDB      | Flexible schema, questions embedded |
| Question Storage    | Separate collection | Embedded in quiz | Embedded | Simplifies fetch & query |
| Add Questions API   | Single add | Bulk add | Bulk add | Easier for frontend |
| Correct Answer Ref  | Option IDs | Indexes → IDs | Index-based | Simpler input, IDs generated internally |
| Scoring             | Partial allowed | All-or-nothing | All-or-nothing | Simple evaluation |

---

## ✅ Conclusion
This design keeps the system:
- **Simple for v1**
- **Extensible for future** (leaderboards, user auth, analytics)
- **Frontend-friendly** with consistent APIs
- **Backend maintainable** with clear separation of concerns
