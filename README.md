# CLID-TTS Demo

Cross-Lingual Instruction Distillation for Low-Resource Expressive Emotional Text-to-Speech.

A standalone static research demo with page-style navigation, the original method and evaluation figures, and 144 original audio samples. It does not run model inference.

## Pages

- Overview — research abstract and demo entry points.
- Method — bilingual instructions, CLID, and CFG-guided distillation.
- Results — the original objective and subjective emotion-classification figure and its reported overall values.
- Model Comparison — six emotions across GT and five synthesis systems.
- Korean Instructions — 30 samples comparing CLID-TTS and Gemini.
- Emotion Control — two fixed texts, six emotions, and two instruction variants per emotion.

The results table is transcribed from the original figure, not a new evaluation. The systems shown in that figure differ from the audio-comparison systems. Same-text instructions change speaker traits and delivery as well as emotion.

## Local preview

From this directory:

```sh
python3 -m http.server 4180 --bind 127.0.0.1
```

Open <http://127.0.0.1:4180/>. No build or package installation is required.

## GitHub Pages

Intended repository: `LSH-Ajou/CLID-Demo`.

In **Settings → Pages**, choose **Deploy from a branch**, then **main / (root)**. Once deployed, the site will be available at <https://lsh-ajou.github.io/CLID-Demo/>.

## Source material

- [Original demo](https://speechai-lab.github.io/demo/clid-tts/)
- [Original code repository](https://github.com/SpeechAI-Lab/CLID-TTS) — may require access; the paper link was marked coming soon in the original demo.
- `data/samples.js`, `audio/`, and `pics/` are copied from the existing CLID-TTS demo. Audio files and research figures are unchanged.
- The Ajou University mark is reused from the existing challenge page.

Edit presentation in `index.html` and `assets/style.css`, navigation in `js/navigation.js`, and sample presentation in `js/audio.js`. Sample metadata remains in `data/samples.js`.
