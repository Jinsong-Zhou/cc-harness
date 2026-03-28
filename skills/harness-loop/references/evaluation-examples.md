# Evaluation Examples

Reference examples showing the specificity and severity calibration expected from the evaluator. These are drawn from real harness runs.

## Example: Retro Game Maker — Level Editor QA

```markdown
# QA Feedback: Level Editor Tools

## Overall Assessment
FAIL

The level editor renders correctly and basic tile placement works, but three of five
tools have functional issues that prevent the described workflows from completing.

## Criterion Scores

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Product Depth | 2 | 3 of 5 tools non-functional despite UI presence |
| Functionality | 2 | Core workflows broken — fill, select, delete all fail |
| Visual Design | 4 | Clean layout, good use of viewport, consistent styling |
| Code Quality | 3 | Acceptable structure but route ordering bug shows carelessness |

## Issues Found

### Critical (must fix before proceeding)

- **Rectangle fill tool allows click-drag to fill a rectangular area with selected
  tile** — FAIL — Tool only places tiles at drag start/end points instead of filling
  the region. `fillRectangle` function exists but isn't triggered properly on mouseUp.

- **User can select and delete placed entity spawn points** — FAIL — Delete key
  handler at `LevelEditor.tsx:892` requires both `selection` and `selectedEntityId`
  to be set, but clicking an entity only sets `selectedEntityId`. Condition should be
  `selection || (selectedEntityId && activeLayer === 'entity')`.

- **User can reorder animation frames via API** — FAIL — `PUT /frames/reorder` route
  defined after `/{frame_id}` routes. FastAPI matches 'reorder' as a frame_id integer
  and returns 422: "unable to parse string as an integer."

### Minor (should fix)
- Grid overlay flickers during rapid zoom — noticeable but not blocking
- Tile palette scrollbar is barely visible against dark background

## What Worked Well
- Single tile placement is responsive and accurate
- Layer switching works correctly
- Undo/redo handles tile operations reliably

## Recommendation
ITERATE — fix the three critical issues and resubmit. The route ordering bug is a
one-line fix. The fill tool and deletion logic need targeted code changes.
```

## Example: DAW — Feature Completeness Review

```markdown
# QA Feedback: Core DAW Features (Round 1)

## Overall Assessment
FAIL

This is a strong app with excellent design fidelity, solid AI agent, and good backend.
The main failure point is Feature Completeness — while the app looks impressive and
the AI integration works well, several core DAW features are display-only without
interactive depth: clips can't be dragged/moved on the timeline, there are no instrument
UI panels (synth knobs, drum pads), and no visual effect editors (EQ curves, compressor
meters). These aren't edge cases — they're the core interactions that make a DAW usable,
and the spec explicitly calls for them.

## Criterion Scores

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| Product Depth | 2 | Display-only panels without interactive depth |
| Functionality | 3 | What works, works — but many stubs |
| Visual Design | 4 | Excellent design fidelity and layout |
| Code Quality | 3 | Acceptable |

## Issues Found

### Critical
- **Clip drag/move** — Clips display on timeline but cannot be dragged or repositioned
- **Instrument panels** — No synth knobs, drum pads, or instrument-specific UIs
- **Effect visualizations** — Numeric sliders only, no graphical EQ curves or compressor meters
- **Audio recording** — Button toggles but no actual mic capture (stub implementation)

### Minor
- Clip resize by edge drag not implemented
- Clip split not implemented
```

## Calibration Notes

Notice these patterns in well-calibrated evaluations:

1. **Specific** — "Delete key handler at `LevelEditor.tsx:892`" not "deletion doesn't work"
2. **Reproducible** — Clear steps to trigger every issue
3. **Severity-appropriate** — Stubs called out as failures, cosmetic issues as minor
4. **Honest positives** — "Design fidelity" and "AI integration" praised because they genuinely worked
5. **No rationalization** — Issues identified are issues reported. No "but overall it's impressive"
6. **References the contract** — "the spec explicitly calls for them"
