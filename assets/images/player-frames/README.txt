FL1NK CHARACTER SPRITE PACK

Folders:
- idle/: 4 frames (idle-01.png to idle-04.png)
- walk-down/: 8 frames
- walk-left/: 8 frames
- walk-right/: 8 frames
- walk-up/: 8 frames
- climb/: 8 frames
- sprite-sheets/fl1nk-full-sprite-sheet.png: combined sheet
- preview/animation-preview.gif: animated preview

Frame dimensions: 512 x 512 pixels, RGBA PNG with transparent padding.
Total individual frames: 44.

Suggested playback:
- Idle: idle-01.png -> idle-02.png -> idle-03.png -> idle-04.png, loop.
- Walking: play the corresponding directional folder in numeric order, loop while the arrow key is held.
- Climbing: play climb-01.png through climb-08.png in order while climbing.
- On no input, return to the idle sequence.

Implementation note:
These frames were extracted from an AI-generated sprite sheet and centered on uniform transparent canvases. They are not individually hand-redrawn; inspect the cycles in-game for pose consistency before production use.
