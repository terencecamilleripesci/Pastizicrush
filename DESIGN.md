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
1. Wrapped bomb + special-combos (the "big moment" payoffs). ✅
2. Jelly + ice blockers + a 2nd objective type (clear jelly) → real level variety. ✅ (jelly + clear-jelly; ice 🔜)
3. Per-level board shapes + tighter moves (harder). ✅
4. Custom Maltese-food SVG art + procedural music loop + sound toggle. ✅ (Howler/real samples 🔜)
5. Star ratings + level map + boosters. 🔜
6. Lives/daily/leaderboard meta + monetisation. 🔜

---

## Concept refine (2026-06-30) — full vision vs. what's built

Original Maltese match-3 (NOT a Candy Crush clone — own name, art, pieces, specials, sounds, level themes).

### Pieces — HAVE 6, concept lists 8
6 on-board is the right number for fair match-3 difficulty (7–8 makes boards unsolvable-feeling).
- ✅ Built (drawn SVG): pastizz, ftira, ġbejna, qassata, imqaret, figolla.
- 🔜 Concept additions to swap in per-world for flavour: **Kinnie bottle**, **Luzzu boat**, **Maltese-cross biscuit**, pastizz tal-piżelli vs tal-irkotta. Keep 6 active at a time; rotate art by world.

### Specials — mechanics HAVE, re-theme to Maltese 🔜
| Concept name | Our mechanic | Status |
|---|---|---|
| Kinnie Rocket (match-4) | blast = clears row+col | ✅ mechanic, 🔜 rename+art |
| Golden Pastizz (match-5) | super = clears one type | ✅ mechanic, 🔜 rename+art |
| Festa Bomb (L/T) | wrap = 3×3 area blast | ✅ mechanic, 🔜 rename+art |
| Combo effects (fireworks / bells / Kinnie splash) | special+special combos | ✅ mechanic, 🔜 themed FX |

### Objectives — HAVE 2 of 6
- ✅ Target score in N moves; ✅ Clear all jelly.
- 🔜 **Collect X pieces** (e.g. 20 pastizzi); 🔜 **Ingredient drop** (luzzu/bag to bottom row); 🔜 **Clear honey/jam blocks** (spreading blocker); 🔜 **Break frozen tiles** (ice, multi-layer).

### Worlds / map — 🔜 not built
- 🔜 World map screen with 10 worlds (Village Bakery → Valletta → Mdina Night → Marsaxlokk → Gozo Farm → Blue Lagoon → Festa Week → Three Cities → Dingli Cliffs → Pastizzi Factory).
- 🔜 Themed backgrounds per world (limestone, balconies, festa flags, luzzi, sea). Currently one dark backdrop.
- 🔜 **Stars 1–3** per level + saved progress/unlock gating.

### Meta / monetisation — 🔜 not built
- 🔜 Lives/hearts (5, refill over time). 🔜 Coins. 🔜 Boosters: Extra-5-moves, Rolling Pastizz (line), Kinnie Splash (colour), Festa Firework (area), Maltese Cross (reshuffle) — pre-level + in-level.
- 🔜 Rewarded ads / premium no-ads pack + exclusive skins. **Note:** ads need an ad-network SDK (AdMob) — only works in the APK build, not the bare PWA; separate integration + a Google AdMob account.

### Sound — HAVE synth, concept wants character
- ✅ pop ladder, boom, win jingle, NEW procedural music + mute toggle.
- 🔜 Festa-band win, sad bakery-bell lose, combo **voice lines** ("Mela nice!" / "Prosit!" / "Ejja!") — these need short recorded/TTS audio clips (breaks zero-asset offline unless we embed small files).

### Platform note
We're building the **web PWA → Android APK** path (this is live). The concept also mentions **Roblox** — that's a totally separate Luau rebuild inside Roblox Studio, not this codebase. Pick one; can't share code.

### MVP checklist (concept) — status
1. 8×8 grid ✅ · 2. swipe swap ✅ · 3. detect 3+ ✅ · 4. remove ✅ · 5. drop new ✅ · 6. goal counter ✅ · 7. 20 levels (have 8 hand-built + infinite procedural; 🔜 author 20 distinct) · 8. coins+boosters 🔜.
