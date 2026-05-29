# Quiz Maker — UI Specification for Designer

## Overview

A web app with two roles:

- **Quiz Builder** — creates and manages quizzes
- **Quiz Player** — takes a quiz and sees results

All pages are single-column, max-width centered. Currently unstyled beyond basic Tailwind utility classes — full redesign is expected.

---

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/builder` | Create Quiz |
| `/builder/:id` | Edit Quiz |
| `/quiz/:id` | Play Quiz |
| `/quiz/:id/results` | Results |

---

## Pages

### 1. Home Page (`/`)

**Purpose:** Entry point for both builders and players.

**Sections:**

**Header bar**
- App title: "Quiz Maker"
- Button: "Create Quiz" → navigates to `/builder`

**Take Quiz form**
- Text input: "Enter quiz ID to play"
- Button: "Take Quiz" → navigates to `/quiz/:id`
- Validates that the input is a positive integer

**Quiz list**
- Section title: "All Quizzes"
- Fetches all quizzes from the API
- Loading state: shows "Loading..."
- Error state: shows "Failed to load quizzes."
- Empty state: shows "No quizzes yet. Create one!"
- Each quiz item shows:
  - Title (bold)
  - Description (secondary text)
  - ID and published status badge ("Published" / "Draft")
  - Two action links: "Edit" → `/builder/:id`, "Play" → `/quiz/:id`

---

### 2. Builder Page — Create (`/builder`)

**Purpose:** Create a new quiz from scratch.

**Sections:**

**Header**
- Back link: "← Home"
- Page title: "Create Quiz"

**Quiz form** (fields)
- Title (required text input)
- Description (optional textarea)
- Time Limit in seconds (optional number input)
- Published toggle (checkbox)
- Submit button: "Create Quiz" / "Saving..."

After successful creation, redirects to `/builder/:id` (edit mode).

---

### 3. Builder Page — Edit (`/builder/:id`)

**Purpose:** Edit an existing quiz and manage its questions.

**Sections:**

**Header**
- Back link: "← Home"
- Page title: "Edit Quiz"

**Quiz form** (same fields as create, pre-filled)
- Submit button: "Save Quiz" / "Saving..."

**Quiz ID banner**
- Shows: "Quiz ID: {id} (share this ID with players)"

**Questions list**
- Section title: "Questions"
- Empty state: "No questions yet."
- Each question item shows:
  - Type badge (MCQ / SHORT)
  - Question prompt text
  - For MCQ: options listed, correct answer highlighted with ✓
  - Reorder buttons: ↑ / ↓ (disabled at boundaries)
  - Delete button: "Delete"

**Add Question form**
- Section title: "Add Question"
- Type selector: radio buttons — "Multiple Choice" / "Short Answer"
- Prompt textarea (required)
- **If MCQ:** 4 option inputs with radio buttons to select the correct answer
- **If Short Answer:** one "Correct Answer" input (case-insensitive match)
- Submit button: "Add Question" / "Adding..."

---

### 4. Player Page — Start (`/quiz/:id`)

**Purpose:** Entry screen before the quiz begins.

**Sections:**

- Back link: "← Home"
- Title: "Quiz #{id}"
- Error message (if quiz is unpublished or not found)
- Button: "Start Quiz" / "Starting..."

---

### 5. Player Page — In Progress (`/quiz/:id`)

**Purpose:** Answer questions one at a time.

**Sections:**

**Header**
- Quiz title (left)
- Progress indicator: "2 / 5" (right)

**Question card**
- Question prompt text
- **If MCQ:** radio button list of options
- **If Short Answer:** text input

**Navigation**
- "Previous" button (disabled on first question)
- "Next" button (on all but last question) — saves current answer before advancing
- "Submit" button (on last question only) — saves answer then submits attempt

---

### 6. Results Page (`/quiz/:id/results`)

**Purpose:** Show score and per-question breakdown after submission.

**Sections:**

**Score summary card**
- Large score: "{score} / {total}"
- Percentage: "{n}% correct"

**Per-question breakdown list**
- One row per question
- Green background = correct, red background = incorrect
- Label: "Question {n}"
- Status: "✓ Correct" or "✗ Incorrect"
- For incorrect answers: shows expected answer

**Footer**
- Button: "Back to Home"

---

## States to Design For

Every interactive action has these states:

| State | Description |
|---|---|
| Loading | API call in progress — buttons show "..." text and are disabled |
| Error | API call failed — inline red error message |
| Empty | No data yet — friendly empty state message |
| Success | Normal populated state |

---

## Notes for Designer

- All pages are currently max-width `xl` (centered column), no sidebar
- No global navigation bar — each page has its own back link
- No authentication UI — auth is handled via a static token in the env
- The app is desktop-first but should work on mobile
- Question type badge values are: `mcq`, `short` (backend also has `code` but it is excluded from the player)
