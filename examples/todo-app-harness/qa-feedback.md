# QA Feedback: Quick Add with Natural Language Dates

## Overall Assessment
FAIL

The quick-add UI works well and date parsing handles the documented cases. However,
the POST endpoint has a silent failure on date validation, and the keyboard shortcut
conflicts with browser search on Firefox.

## Criterion Scores

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Product Depth | 4 | Feature works end-to-end for the defined scope |
| Functionality | 2 | POST endpoint bug and keyboard conflict are blocking |
| Visual Design | 4 | Smooth animation, consistent with design language |
| Code Quality | 3 | Acceptable — date parser could use unit tests |

## Issues Found

### Critical (must fix before proceeding)

- **POST /api/tasks silently drops due_date when format is ISO with timezone** —
  FAIL — Sending `{"title": "test", "due_date": "2026-04-01T00:00:00Z"}` creates
  a task with `due_date: null`. The SQLite column is TEXT type and the FastAPI model
  uses `datetime` which rejects timezone-aware strings. Fix: accept both naive and
  aware datetime, or strip timezone before storing.

- **`/` keyboard shortcut intercepted by Firefox Quick Find** — FAIL — On Firefox,
  pressing `/` opens the browser's Quick Find bar instead of the app's input. The
  `keydown` handler on `document` fires but Firefox's default action isn't prevented.
  Fix: call `e.preventDefault()` in the keydown handler when the target is not an
  input/textarea element.

### Minor (should fix)

- **No loading state on task creation** — When the API is slow, pressing Enter
  shows nothing for ~500ms before the task appears. Add an optimistic insert or
  a loading indicator.

- **Date badge shows ISO format** — Due dates display as "2026-04-01" instead of
  a human-readable format like "Apr 1" or "Tomorrow".

## What Worked Well

- Quick-add animation is smooth and feels native
- Date parsing correctly handles "tomorrow", "next Friday", "in N days"
- Escape to cancel works reliably
- Task persistence across page reloads is solid

## Recommendation
ITERATE — fix the two critical issues (POST date handling and Firefox keyboard
conflict) and resubmit. The minor issues can be addressed in a follow-up.
