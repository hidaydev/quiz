# Quiz Maker

A React frontend for a quiz creation and taking application, built as a take-home assignment.

## Running Locally

### Prerequisites

- Node.js 18+
- Yarn or npm

### 1. Start the backend

```bash
cd backend
npm install
npm run seed   # seed the database with sample data
npm start      # starts on http://localhost:4000
```

### 2. Start the frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev    # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `http://localhost:4000` |
| `VITE_API_TOKEN` | Bearer token for API auth | `dev-token` |
| `VITE_API_TIMEOUT` | Axios timeout in ms | `10000` |

## Architecture Decisions

### Tech Stack

- **React 19 + TypeScript + Vite** — fast dev server, type safety
- **TanStack Query v5** — server state management, caching, background refetching
- **React Hook Form** — form state and validation with minimal re-renders
- **Tailwind CSS** — utility-first styling, no component library

### Folder Structure

```
src/
  api/        # axios client + API functions per resource
  components/ # shared UI components
  pages/      # route-level page components
  queries/    # TanStack Query hooks per resource
  types.ts    # shared TypeScript interfaces
```

Each folder has an `index.ts` barrel export so imports stay clean:

```ts
import { useQuizzes, useDeleteQuestion } from '../queries'
import { QuestionCard, QuizForm } from '../components'
```

### Data Fetching

- Queries and mutations are separated by resource (`quizzes.ts`, `questions.ts`, `attempts.ts`)
- Question reordering uses optimistic updates for instant UI feedback with rollback on error
- All other mutations wait for server confirmation before updating the UI

### Backend Contract

A `code_snippet` column was added to the `questions` table as a minor additive change. All existing endpoints remain backward compatible — the field is optional and nullable.

## Known Limitations

- **Refresh during quiz** — attempt state is held in React state. Refreshing loses progress and forces a new attempt. Resuming would require `GET /attempts/:id` + `GET /attempts/:id/answers` endpoints and persisting `attemptId` in localStorage.
- **Results not persisted on client** — the results page reads from React Router state, which is lost on refresh or navigation. There is no endpoint to retrieve a past attempt's score and breakdown.
- **Time limit enforcement is frontend-only** — the backend does not validate submission time. A malicious user could submit after the time limit by calling the API directly, or manipulate their system clock to gain extra time. Server-side enforcement (comparing `submitted_at` vs `started_at + time_limit_seconds`) would be the proper fix.
- **startedAt timezone** — the backend strips the `Z` from ISO timestamps. The frontend compensates by re-adding it before parsing, but ideally the backend should return valid ISO 8601 (`toISOString()` without modification).
- **Reorder consistency** — question reordering makes two sequential PATCH requests. If one fails, positions can become inconsistent. A dedicated reorder endpoint with a DB transaction would solve this.
- **No question editing** — existing questions can be reordered and deleted but not edited in the UI.
