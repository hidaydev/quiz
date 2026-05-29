# Quiz Maker Frontend — Design Spec

## Overview

A React + TypeScript SPA (Vite) for building and taking coding quizzes. Two core flows: Quiz Builder and Quiz Player. Connects to the provided Node.js + SQLite backend via a REST API with Bearer token auth.

---

## Tech Stack

- **Framework:** React 18 + TypeScript, Vite
- **Routing:** React Router v6
- **Server state:** TanStack Query v5
- **Forms:** React Hook Form
- **Styling:** Tailwind CSS

---

## Page Structure & Routing

| Route | Page | Description |
|---|---|---|
| `/` | `HomePage` | Lists all quizzes. "Create Quiz" button → `/builder`. Enter quiz ID → `/quiz/:id` |
| `/builder` | `BuilderPage` | Create new quiz — fill metadata, add questions, save → shows quiz ID |
| `/builder/:id` | `BuilderPage` | Edit existing quiz |
| `/quiz/:id` | `PlayerPage` | Take a quiz — navigate questions, submit |
| `/quiz/:id/results` | `ResultsPage` | Score + per-question correctness |
| `*` | `NotFoundPage` | 404 message + button back to home |

---

## File Structure

```
frontend/
├── .env                 # VITE_API_URL, VITE_API_TOKEN (gitignored)
├── .env.example         # template with placeholder values
└── src/
    ├── api/
    │   ├── constants.ts     # all endpoint functions + all query keys
    │   ├── client.ts        # axios instance, Authorization: Bearer dev-token, base URL from VITE_API_URL
    │   ├── quizzes.ts       # quiz CRUD API calls
    │   ├── questions.ts     # question CRUD API calls
    │   └── attempts.ts      # attempt start / answer / submit API calls
    ├── queries/
    │   ├── quizzes.ts       # useQuizzes, useQuiz, useCreateQuiz, useUpdateQuiz, useAddQuestion, useUpdateQuestion, useDeleteQuestion
    │   └── attempts.ts      # useStartAttempt, useSaveAnswer, useSubmitAttempt
    ├── hooks/               # custom reusable hooks (added as needed)
    ├── components/
    │   ├── QuizForm.tsx     # RHF form for quiz title, description, timeLimitSeconds, isPublished
    │   ├── QuestionForm.tsx # RHF form for one question (MCQ or Short Answer)
    │   ├── QuestionList.tsx # ordered question list with delete + reorder
    │   └── QuestionCard.tsx # renders a single question during play (MCQ → radios, Short Answer → text input)
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── BuilderPage.tsx
    │   ├── PlayerPage.tsx
    │   ├── ResultsPage.tsx
    │   └── NotFoundPage.tsx
    ├── types.ts             # shared Quiz, Question, Attempt, Answer TS types
    ├── App.tsx              # React Router route definitions
    └── main.tsx             # Vite entry, QueryClientProvider wrapper
```

---

## API Layer

### `api/constants.ts`

```ts
export const endpoints = {
  quizzes: '/quizzes',
  quiz: (id: number) => `/quizzes/${id}`,
  questions: (quizId: number) => `/quizzes/${quizId}/questions`,
  question: (id: number) => `/questions/${id}`,
  attempts: '/attempts',
  attemptAnswer: (id: number) => `/attempts/${id}/answer`,
  attemptSubmit: (id: number) => `/attempts/${id}/submit`,
}

export const queryKeys = {
  quizzes: ['quizzes'] as const,
  quiz: (id: number) => ['quizzes', id] as const,
  attempt: (id: number) => ['attempts', id] as const,
}
```

### `api/client.ts`

Axios instance with:
- `baseURL` from `VITE_API_URL` (default `http://localhost:3000`)
- `Authorization: Bearer $VITE_API_TOKEN` header on every request — token stored in `.env` as `VITE_API_TOKEN=dev-token`

---

## Data Flow

### Builder Flow

1. User lands on `/builder` → `BuilderPage` renders `QuizForm` (RHF) with title, description, optional time limit, and isPublished toggle
2. On submit → `useCreateQuiz` mutation → on success, navigate to `/builder/:id`
3. `useQuiz(id)` loads saved quiz + questions
4. User adds questions via `QuestionForm` → `useAddQuestion` mutation → query invalidated, list refetches
5. User can delete (useDeleteQuestion) or reorder (useUpdateQuestion with new position)
6. Quiz ID displayed prominently after save so user can share it

### Player Flow

1. User enters quiz ID on `HomePage` → navigate to `/quiz/:id`
2. `PlayerPage` fires `useStartAttempt` mutation → receives attempt ID + questions (no correct answers)
3. One question shown at a time — Prev / Next buttons navigate between them. Current index tracked in local `useState`
4. User answers via `QuestionCard`; answers held in local `useState` map `{ [questionId]: value }`
5. Each answer saved via `useSaveAnswer` mutation when user clicks Next (or on final question, Submit)
6. On submit → `useSubmitAttempt` mutation → navigate to `/quiz/:id/results` passing `{ score, details }` via router state
7. `ResultsPage` reads router state, displays overall score + per-question correctness

---

## Components

### `QuestionForm`

- Type selector: **MCQ** | **Short Answer**
- MCQ fields: prompt, 4 option inputs, correct answer selector (radio), optional code snippet
- Short Answer fields: prompt, correct answer input, optional code snippet
- Validated by React Hook Form before submission

### `QuestionCard`

- Renders a single question during play
- MCQ: displays prompt + optional code snippet + radio button list of options
- Short Answer: displays prompt + optional code snippet + text input
- Controlled — accepts current answer value + onChange handler from `PlayerPage`

### `QuestionList`

- Renders questions ordered by `position`
- Each item: question prompt, type badge, delete button
- Reorder: up/down buttons → PATCH `/questions/:id` with new position

### `QuizForm`

- Fields: title (required), description (required), time limit in seconds (optional), isPublished toggle (default: false)
- `isPublished` must be `true` for the quiz to be playable — toggle shown prominently with a label explaining this
- Used for both create and edit

---

## Error Handling & Loading States

- Queries in loading state → spinner shown in place of content
- API errors → inline error message near the relevant UI
- 404 quiz ID (player or builder) → `NotFoundPage` with "Back to Home" button
- Form validation errors → inline messages via React Hook Form
- Attempt already submitted → redirect to results page

---

## Types (`types.ts`)

```ts
export type QuestionType = 'mcq' | 'short' | 'code'

export interface Quiz {
  id: number
  title: string
  description: string
  timeLimitSeconds?: number
  isPublished: boolean
  createdAt: string
  questions?: Question[]
}

export interface Question {
  id: number
  quizId: number
  type: QuestionType
  prompt: string
  options?: string[]
  correctAnswer?: string | number
  position: number
}

export interface Attempt {
  id: number
  quizId: number
  startedAt: string
  submittedAt: string | null
  quiz: {
    id: number
    title: string
    description: string
    timeLimitSeconds?: number
    questions: Omit<Question, 'correctAnswer'>[]
  }
}

export interface SubmitResult {
  score: number
  details: { questionId: number; correct: boolean; expected?: string }[]
}
```

---

## Out of Scope

- Anti-cheat (tab/focus/paste tracking) — skipped for now
- Tests — skipped for now
- Quiz deletion
