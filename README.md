# Artificial Alibi

A dark retro sci-fi psychological interrogation game. You are a detective on the Arctic
research station Argus-9, interrogating Suspect #04 after the main generator exploded.

## Play

Open `index.html`, or visit the GitHub Pages site for this repo.

## Features

- Live surveillance header (`CAM 04 — INTERROGATION ROOM`) with animated camera static and clock
- Scrollable interrogation transcript, typewriter suspect replies, text input + INTERROGATE
- Real-time BPM monitor starting at 78 BPM, with an ECG trace that speeds up and spikes
- Evidence Locker: Sector B Camera Log, Blood-Stained Wrench, Missing Hard Drive — click to confront
- Suspect brain: offline deterministic lie engine (zero cost, no key), or link a free-tier model
  (Groq / Gemini / OpenRouter) using the AI LINK panel; the key stays in your browser, never sent anywhere else
- Verdict: LOCK HIM UP or RELEASE SUSPECT, then a Mission Report that reveals the truth

## The truth (spoilers)

#04 ruptured the generator coolant seal to trigger an evacuation covering the theft of nine
years of cryo research. The Sector B pipe work was fabricated. Dr. Vance is innocent.

## Win condition

Lock him up with at least 2 exhibits entered and 2 contradictions caught. Anything less and the
case fails review; releasing him lets the saboteur walk.

## Testing the interrogation logic

The terminal ships with a built-in console. Press the **λ DEBUG** button (bottom left):

- Live internals: brain mode, BPM/stress, contradictions, evidence, questions, last stress delta
- **RUN LOGIC TESTS**: nine checks against a sandboxed copy of state, so your session is untouched

Covered: alibi consistency, contradiction on repeated pressure, Dr. Vance blame behaviour,
denial while composed, cracking under high stress, deflection on unknown input, no outright
confession at any stress level, every reply within 2-3 sentences, contradiction cap at 3.

Headless: `npm install && npm test`

## 2.0 — Title screen, case files, randomized mode

- **Title screen**: ARTIFICIAL ALIBI splash with CRT scanlines, blinking SECURE CONNECTION ESTABLISHED, and menu (Begin, Select Case File, How To Play / Briefing)
- **Three case files**: 01 Marcus Vance (easy, generator sabotage), 02 Dr. Elena Rostova (medium, Lab 3 pathogen), 03 Unit K-7 (hard, falsified medical records). Each has its own 3 exhibits, dialogue bank, truth and four verdict outcomes.
- **Randomized mystery mode**: random suspect AND random guilt. Every exhibit still lands, but the verdict is a real decision — lock an innocent and the report says so.
- **Nav**: ← CASE FILES returns to the docket at any time; SOUND FX toggle drives synthesised keyboard clicks, BPM beeps and a contradiction buzzer (WebAudio, no assets).

Tests: `npm test` runs the nine logic checks plus the screen/case/verdict flow.
