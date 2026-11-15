# GLINT

A one-swipe dash arcade game for the browser. You can only move by dashing; dashing through an enemy slices it, and standing still gets you hit.

No build step, no dependencies, no accounts. The whole game is `index.html`.

## Play locally

Open `index.html` in any modern browser. No server is needed.

## Host on GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
4. The game will be served at `https://<username>.github.io/<repo>/`.

## Controls

| Device | Control |
|---|---|
| Touch | Swipe in a direction, or tap where you want to dash |
| Mouse | Click where you want to dash |
| Keyboard | WASD or arrow keys to dash (hold two for diagonals) |
| Pause | P or Esc, or the pause button |
| Start / restart | Space or Enter |
| Level-up | Click a card, or press 1 / 2 / 3 |
| Mute sound | M |

## How it works

- You hold three dash charges. They refill over time, and every slice refunds one.
- Slices build a combo; the score multiplier rises every four slices, up to x20.
- Slicing several enemies in one dash gives a bonus.
- Enemies drop shards. Collect enough to level up and pick one of three upgrades for that run.
- Spiked enemies (red, with spikes out) hurt you if you dash into them. Wait for them to retract.
- A swarm arrives every 30 seconds, and spawn rate and enemy speed keep rising.
- The Daily Run uses a date-based seed, so everyone gets the same opening each day.
- Skins unlock from lifetime milestones.

## Technology

- HTML5 Canvas 2D, plain JavaScript, CSS
- Web Audio API for synthesized sound effects and music
- `localStorage` for high score, stats, settings and unlocks (key: `glint.save.v1`)
- Google Fonts (Unbounded, Space Grotesk) with a system-font fallback if offline

## Testing status

Tested with automated headless-Chrome scripts at desktop, phone, tablet and landscape-phone sizes, plus bot players for balance. It has not been playtested by people, checked on real devices or Safari, or had its audio checked by ear.

## Known limitations

- Scores are stored per browser; there is no online leaderboard.
- Daily runs share a seed but are not frame-for-frame identical between players.
- `window.__glint` exposes game state for testing; remove it if you do not want it public.

## License

No license has been chosen yet. Add a `LICENSE` file before publishing if you want others to be able to reuse the code.
