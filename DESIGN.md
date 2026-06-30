# Pastizzi Crush — Master Design (research compiled)

Synthesised from Candy Crush Saga (Wikipedia) + match-3 design sources (Room 8, Playrix,
Galaxy4Games) and games like Toon Blast / Royal Match. ✅ = in v1, 🔜 = planned.

## Tiles (the "candies")
- 6 Maltese foods: 🥟 pastizz, 🍕 ftira, 🧀 ġbejna, 🥧 qassata, 🍩 imqaret, 🍰 figolla. ✅

## Special tiles (made by big matches)
- **Match 4 (line) → Blast/Striped** → clears a row + column. ✅ (CC: striped clears a line)
- **Match 5 (line) → Super Pastizz / Color Bomb** → swap onto a treat = clear all of that type. ✅
- **L / T shape (5) → Wrapped bomb** → clears 3×3 area, twice. 🔜
- **Special + special combos:** 🔜
  - Striped × Striped = clear full row AND column
  - Striped × Wrapped = giant 3-row + 3-col cross
  - Wrapped × Wrapped = big 5×5 blast
  - ColorBomb × Striped = turn all of one type into stripers, then fire
  - ColorBomb × ColorBomb = **clear the whole board** 💥

## Blockers / locks (obstacles)
- **Jelly** — tile covered in jelly; clear by matching on it (double-jelly = 2 hits). 🔜
- **Icing / frosting (crates/ice)** — break by matching adjacent; multi-layer. 🔜
- **Licorice lock** — a candy locked in place; match adjacent to free it. 🔜
- **Chocolate** — spreads each turn unless you match next to it. 🔜
- **Marmalade** — encases a candy; clear by matching it. 🔜
- **Boxes / chains / stone** — fill a tile, broken by nearby matches. 🔜

## Level / objective types (mix per level)
- **Target score in N moves** ✅ (current mode)
- **Clear all jelly** 🔜
- **Collect / order** — gather X of certain treats 🔜
- **Ingredients drop** — bring items to the bottom row 🔜
- **Clear all blockers** (ice/crates) 🔜
- **Timed** (score in 60s) 🔜
- **Survive N moves** 🔜

## Board styles
- Square 8×8 ✅; later: odd shapes, holes, conveyor/teleports, gravity shifts (Soda-style). 🔜

## Progression & meta
- **Levels** with rising target ✅ + **tutorial levels 1–3** ✅
- **Stars** (1–3 by score), **level map**, episodes (15 levels each like CC). 🔜
- **Lives/hearts** (5, refill over time) — optional for casual feel. 🔜
- **Boosters** (extra moves, hammer, shuffle, swap) — pre-level & in-level. 🔜
- **Daily streak / rewards**, leaderboard (friends). 🔜

## Scoring & feel
- Cascade chains give escalating points ✅; combo banners ✅.
- **Juice:** 3D pops, particles, screen shake, flash, shockwave, **confetti booms** ✅.
- **Sound:** rising **pentatonic** pop ladder (climbs each cascade), sparkle, boom, win jingle ✅.
  Next: **Howler.js** + real samples + light background music. 🔜
- **Graphics next:** custom drawn Maltese-food art to replace emoji. 🔜
- **Haptics** (vibrate on match/boom) on mobile. 🔜

## Build / ship
- Offline PWA ✅ → **PWABuilder/Bubblewrap APK** (Android) ✅ pipeline; Capacitor for iOS later. 🔜

## Recommended build order (most impact first)
1. Wrapped bomb + special-combos (the "big moment" payoffs). 
2. Jelly + ice blockers + a 2nd objective type (clear jelly) → real level variety.
3. Star ratings + level map + boosters.
4. Custom food art + Howler sound pack + music.
5. Lives/daily/leaderboard meta.
