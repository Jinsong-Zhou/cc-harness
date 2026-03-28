# Sprint Result: Quick Add with Natural Language Dates

## What Was Built

Implemented the quick-add feature with `/` keyboard shortcut. The input field
slides down from the top of the task list with a smooth animation. Natural
language date parsing uses a lightweight regex-based parser (no external
dependency) that handles common patterns.

## Test Instructions

1. Open http://localhost:5173
2. Press `/` — input slides down from top with placeholder "Add a task... (try 'Buy milk tomorrow')"
3. Type "Buy groceries tomorrow" + Enter — task appears in list with tomorrow's date badge
4. Type "Submit report next Friday" + Enter — task shows correct Friday date
5. Type "Call dentist in 3 days" + Enter — task shows date 3 days from now
6. Type "Read a book" + Enter — task appears with no date badge
7. Press `/` then Escape — input slides up, no task created
8. Reload page — all tasks persist

## API Changes

- `POST /api/tasks` — Creates task. Body: `{ title, due_date?, category_id? }`
- `GET /api/tasks` — Returns all tasks sorted by due_date (nulls last)

## Known Limitations

- Date parser handles English only (no i18n)
- "next Monday" works but "this Monday" doesn't (ambiguous — is it today or next week?)
- No validation on date strings that look like dates but aren't ("February 30th")

## Files Changed

- `src/components/QuickAdd.tsx` — New component: input field with keyboard handling
- `src/components/TaskList.tsx` — Modified: integrated QuickAdd at top
- `src/utils/dateParser.ts` — New: natural language date extraction
- `src/api/routes/tasks.py` — New: POST and GET endpoints for tasks
- `src/store/taskStore.ts` — New: Zustand store for task state
