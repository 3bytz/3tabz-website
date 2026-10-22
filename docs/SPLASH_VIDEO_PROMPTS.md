# Intro video and splash prompts (ChatGPT / Sora)

Paste the brand block first, then one scene prompt at a time. Generate each scene separately so you can pick the best take of each.

Format note: ChatGPT's video tool (Sora) exports **MP4**, not GIF. Use the MP4 in the app (it is smaller and sharper than a GIF and plays through `expo-video`). Make a GIF only for social posts or the website.

---

## Step 1: paste this brand block once at the start of the chat

```
You are making short, realistic brand films for 3TABZ, a medicine-reminder app for people managing long-term conditions and the families who help them.

Brand look and feel:
- Calm, warm, real. Natural daylight, soft shadows, shallow depth of field, 35mm look, gentle film grain.
- Palette: sage green (#5B7A61), deep forest green (#2F4A37), warm off-white/linen (#F4F2ED), with small touches of apricot (#F1B77E). Avoid neon, purple gradients, glossy plastic, sci-fi glows and anything that looks computer-generated.
- Props feel lived-in: ceramic mugs, a clear glass of water, a linen napkin, a wooden table, a sage-green ceramic dish, real white round tablets with a score line, an amber pharmacy bottle with a plain white label and no readable text.
- People look like real people of different ages and backgrounds, not models. Relaxed, unhurried, small genuine smiles. Nobody looks ill or distressed.
- Absolutely no readable text, logos, brand names, watermarks or captions anywhere in the frame, including on phone screens and bottles.
- Vertical 9:16, 1080x1920, 24 fps. Smooth, slow camera moves only (slow push-in or gentle handheld). No fast cuts.
- Safe framing: keep the main action in the middle 70% of the frame so it survives cropping on tall phones.

Confirm you understand, then wait for scene prompts.
```

---

## Scene 0 (recommended for the splash): "Three tabs settle" (3 seconds)

```
Scene 0, 3 seconds, vertical 9:16, seamless and loop-friendly.
Overhead macro shot on a warm linen surface in soft morning light. Three white, round, slightly domed tablets with a score line fall gently into frame one after another and settle into a neat, slightly offset stack in the centre, each landing with a tiny bounce and a soft shadow. The background slowly shifts from linen to a deep sage-green (#2F4A37) vignette as the stack settles. Final 0.8 seconds: perfectly still, centred stack, plenty of empty space around it. No text, no logo, no hands.
```

Why this one: it mirrors the app icon, reads instantly at small sizes, and is short enough that nobody waits.

---

## Scene 1: "The pour" (5 seconds)

```
Scene 1, 5 seconds, vertical 9:16.
Close-up in a bright kitchen in the morning. A person's hands tip an amber pharmacy bottle and three white round tablets slide into their open palm. Cut-free continuous move: the camera follows as they lift the tablets to their mouth, then take a slow sip from a clear glass of water. The glass is set down on a wooden table next to a smartphone lying face up whose screen shows only a soft, blurred sage-green notification shape with no readable text. Warm daylight from a window on the left, a sage-green ceramic dish and a sprig of herbs in the background. Calm, ordinary, reassuring.
Casting: a woman in her 30s with medium-brown skin and natural hair, wearing a soft cream knit top.
```

Cast variants (swap the "Casting" line):
- `a man in his 60s with fair skin, short grey hair and reading glasses pushed up on his head, wearing a light blue cotton shirt`
- `a woman in her 40s of South Asian heritage, wearing a mustard cardigan, a simple gold bracelet on her wrist`
- `a Nigerian man in his late 20s with dark skin and a short fade, wearing a sage-green T-shirt, in a bright apartment with a ceiling fan`
- `an older Black woman in her 70s with silver hair, wearing a patterned headwrap in muted greens, seated at a dining table`

---

## Scene 2: "The nudge" (5 seconds)

```
Scene 2, 5 seconds, vertical 9:16.
Mid shot at a desk by a window in the late afternoon. A person is working on a laptop with a mug of tea beside them. The smartphone on the desk lights up with a soft sage-green notification banner (blurred shapes only, no readable text, no icons you could read). They glance at it, smile slightly, reach for a small pill organiser with seven compartments, open today's compartment, and take one white tablet with a sip of water. The camera slowly pushes in on the phone as the banner fades. Warm, golden light; plants on the windowsill; nothing cluttered.
Casting: a man in his 30s with light skin and a short beard, wearing a grey hoodie.
```

Cast variants:
- `a woman in her 50s with olive skin and shoulder-length dark hair, wearing a linen shirt, in a home office with bookshelves`
- `a young Black woman in her 20s with braids, wearing headphones around her neck, at a shared workspace table`
- `a caregiver scene: an adult daughter (30s) and her father (70s) at a kitchen table; her phone lights up, she gently hands him his tablets and a glass of water, they share a small smile`

---

## Scene 3 (optional, onboarding or ads): "Peace of mind from far away" (5 seconds)

```
Scene 3, 5 seconds, vertical 9:16.
Split-feeling story with no split screen: in a city flat in the evening, a woman in her 30s checks her phone and visibly relaxes, letting out a small breath and smiling. Then a gentle match-cut to a sunlit living room in a different country where her mother, in her 60s, sets a glass of water down beside a weekly pill organiser. Same sage and linen palette in both places, warm light, no text anywhere.
Casting: Nigerian family, daughter living in London, mother in Lagos; or swap for any family separated by distance.
```

---

## Step 2: export and compress

1. Download the MP4 of your chosen take.
2. Compress it (keeps the app small, about 400–900 KB for 3–5 seconds):

```
ffmpeg -i scene.mp4 -vf "scale=720:-2,fps=24" -c:v libx264 -profile:v high -crf 27 -preset slow -pix_fmt yuv420p -an -movflags +faststart intro.mp4
```

3. Optional GIF for the website or social (larger file, lower quality):

```
ffmpeg -i intro.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer" intro.gif
```

## Step 3: put it in the app

1. Save the file as `assets/video/intro.mp4` in the app project.
2. In `src/constants/media.ts` change the first line to:

```ts
export const INTRO_VIDEO: number | null = require('@/assets/video/intro.mp4');
```

3. Make a new development or production build (the video player is a native module, so an over-the-air update alone is not enough for the first release that includes it).

How it behaves: the static launch screen (sage background with the three-tablet mark) shows first, as both stores require. The video then plays once after install, muted, with a Skip button, and never for longer than 6.5 seconds. After that the app opens straight to Today. To show it again after a big redesign, change `INTRO_SEEN_KEY` in the same file.
