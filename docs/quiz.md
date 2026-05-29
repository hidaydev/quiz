React Take‐Home: Quiz Maker

1) Overview
You are tasked with building a Quiz Maker application in React. The application should allow users
to:
● Create a quiz with coding‐related questions.
● Take a quiz and view a result summary.
● (Optional, bonus) Implement lightweight anti‐cheat signals (e.g., focus tracking, paste
detection).
The project is intentionally scoped to be small. Please focus on clarity, maintainability, and good
engineering practices rather than additional unrequested features.

Technical Constraints
● Framework: React (you may choose your setup - Vite, or Next.js in SPA mode).
● Tooling: Tanstack Query v5 is required
● Styling: You may use any component or styling libraries.
● Backend: A Node.js + SQLite backend will be provided for local use.
○ Authentication: Include the header Authorization: Bearer dev-token with
each request (or configure your own token in .env).
○ Contract: Do not make major changes to the backend endpoints or data structures.
Minor tweaks are acceptable.

Backend API code FE Take-Home Project: Quiz Maker
Deliverables
Submit a GitHub repository containing:
● Your source code.
● A clear README including:
○ Instructions for running the app locally.
○ Any architecture decisions or trade‐offs.
○ (Optional) Description of anti‐cheat implementation (what you log and where).

2) Core User Flows & Requirements
2.1 Quiz Builder
● Create a quiz with:
○ Title and description.
○ At least two question types:
■ Multiple Choice (single correct answer).
■ Short Answer (string match; case‐insensitive).
○ For each question:
■ Prompt text.
■ Optional code snippet (display only).
■ Choices (for Multiple Choice questions).
■ Correct answer(s).
● Save the quiz to the provided API.
2.2 Quiz Player
● Load a quiz by ID.
● Answer questions with navigation between them.
● Submit answers and display a result summary:
○ Overall score.
○ Per‐question correctness.
2.3 Optional Anti‐Cheat (Bonus)
● Log and report simple anti‐cheat events:
○ Focus events: tab/window blur and focus with timestamps.
○ Paste events: paste actions inside answer inputs with timestamps.
● Display a compact anti‐cheat summary on the results page (e.g., “2 tab switches, 3 pastes”).
3) API (Provided)
Refer to the provided postman collection and the backend code.
4) UX Outline (minimum)
● Builder: create quiz → add questions → save → show generated quizId.
● Player: input quizId → load → answer → submit → results page with score and (if
implemented) anti‐cheat summary.
5) Notes
● Keep scope tight and avoid extra features beyond the requirements.

● Gracefully handle loading states and API errors.
● You may use JavaScript or TypeScript (TS is encouraged but not required).