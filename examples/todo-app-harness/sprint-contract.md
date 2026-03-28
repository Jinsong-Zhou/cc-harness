# Sprint Contract: Quick Add with Natural Language Dates

## Scope

Implement the task quick-add feature with a keyboard shortcut (/) that opens
an input field. The input parses natural language dates ("tomorrow", "next
Friday", "in 3 days") and creates a task with the extracted due date.

## Success Criteria

- [ ] Pressing `/` anywhere opens the quick-add input at the top of the task list
- [ ] Typing a task with a date phrase extracts the date correctly
- [ ] "tomorrow" resolves to tomorrow's date
- [ ] "next Friday" resolves to the upcoming Friday
- [ ] "in 3 days" resolves to 3 days from now
- [ ] Task without a date phrase gets no due date (not today's date)
- [ ] Pressing Enter creates the task and clears the input
- [ ] Pressing Escape closes the input without creating a task
- [ ] New task appears in the task list immediately (optimistic UI)
- [ ] Task persists in the database after page reload

## Verification Plan

1. Open the app, press `/` — verify input appears with focus
2. Type "Buy groceries tomorrow" and press Enter — verify task created with tomorrow's date
3. Type "Submit report next Friday" — verify date is the upcoming Friday
4. Type "Call dentist in 3 days" — verify date is 3 days from now
5. Type "Read a book" (no date) — verify task has no due date
6. Press `/`, then Escape — verify input closes, no task created
7. Create a task, reload the page — verify task persists
8. Edge case: type empty string and press Enter — verify no task created
9. Edge case: press `/` when input is already open — verify it focuses existing input
