# Sprint Contract Examples

Reference examples for the generator's sprint contracts and the evaluator's review of them.

## Example 1: Sprite Editor (Retro Game Maker)

```markdown
# Sprint Contract: Pixel-Art Sprite Editor

## Scope
Implement a pixel-art sprite editor with drawing tools, color palette, and zoom. Users can
create and edit sprites on a pixel grid with pencil, fill bucket, eraser, and rectangle tools.
Canvas supports 8x8 to 64x64 pixel sprites with configurable palette.

## Success Criteria
- [ ] Pixel canvas renders at configured sprite size with visible grid lines at zoom > 4x
- [ ] Pencil tool draws single pixels on click and drag with selected color
- [ ] Fill bucket tool flood-fills connected same-color regions
- [ ] Eraser tool clears pixels to transparent
- [ ] Color palette displays project colors and allows selection
- [ ] Zoom in/out works from 1x to 16x with mouse wheel
- [ ] Undo/redo works for at least 50 operations
- [ ] Sprite saves to API and persists across page reloads

## Verification Plan
1. Create a new sprite — verify canvas appears at correct size
2. Draw with pencil — verify single pixels and drag strokes work
3. Use fill bucket on a drawn region — verify flood fill stops at boundaries
4. Zoom in to 16x — verify grid lines appear and drawing still works
5. Test undo/redo — draw 5 strokes, undo all 5, redo 3
6. Save sprite, reload page — verify sprite persists
7. Edge case: fill bucket on empty canvas — should fill entire canvas
8. Edge case: draw at 1x zoom — verify pixel placement accuracy

## UI Changes
- New route `/project/:id/sprite/:spriteId`
- Canvas component with tool palette sidebar
- Zoom controls in bottom-right corner

## API Changes
- `POST /api/projects/:id/sprites` — Create new sprite
- `GET /api/projects/:id/sprites/:spriteId` — Get sprite data
- `PUT /api/projects/:id/sprites/:spriteId` — Update sprite pixel data
```

## Example 2: Audio Mixer (DAW)

```markdown
# Sprint Contract: Mixer Panel with Effects

## Scope
Implement a mixer panel with per-track volume faders, pan knobs, mute/solo buttons,
and an effects chain. Each track gets a channel strip. Master bus with volume control.

## Success Criteria
- [ ] Each track displays a vertical channel strip with fader, pan, mute, solo
- [ ] Volume fader controls actual audio output level via Web Audio API gain nodes
- [ ] Pan knob controls stereo positioning via StereoPannerNode
- [ ] Mute silences the track; solo silences all other non-soloed tracks
- [ ] Effects chain allows adding/removing/reordering reverb, delay, EQ
- [ ] Effects have interactive controls (not just numeric inputs)
- [ ] Master bus fader controls final output level
- [ ] Meter visualization shows real-time audio levels per track

## Verification Plan
1. Create 3 tracks with different audio clips
2. Adjust volume fader on track 1 — verify audio level changes audibly
3. Pan track 2 hard left — verify audio only in left channel
4. Mute track 3 — verify silence from that track, others still play
5. Solo track 1 — verify only track 1 is audible
6. Add reverb to track 2 — verify effect is audible
7. Reorder effects — verify chain processes in new order
8. Edge case: solo multiple tracks simultaneously
9. Edge case: mute a soloed track — what should happen?
```

## Anti-Patterns to Avoid

**Too vague:**
> "Build the sprite editor with all the expected tools"

No success criteria, no verification plan. The evaluator can't test this.

**Too implementation-specific:**
> "Use a `<canvas>` element with `getContext('2d')`, implement `drawPixel(x, y, color)` method that calls `fillRect(x * zoom, y * zoom, zoom, zoom)`..."

This constrains the generator's implementation choices. Describe what, not how.
