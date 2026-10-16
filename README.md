# CLID Demo

Cross-Lingual Instruction Distillation for Low-Resource Expressive Emotional Text-to-Speech.

A standalone static research demo with page-style navigation, the original method and evaluation figures, and 144 original audio samples. It does not run model inference.

## Pages

- Abstract — Korean abstract followed by the original English abstract.
- Model Overview — the original CLID-TTS framework figure and caption.
- Emotion Classification — the original objective and subjective confusion matrices.
- Model Comparison — the original six-emotion comparison table, with expandable instructions and transcriptions.
- Korean Instructions — the original 30-row table comparing CLID-TTS and Gemini.
- Same Text — the original table with two fixed texts, six emotions, and two instruction variants per emotion.

The simple header and comparison-table layouts follow the original demo; the top menu switches between pages. Audio metadata loads when its page is first opened. The systems shown in the evaluation figure differ from the audio-comparison systems. Same-text instructions change speaker traits and delivery as well as emotion.

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

Edit presentation in `index.html` and `assets/style.css`, navigation in `js/navigation.js`, and sample presentation in `js/audio.js`. Sample metadata remains in `data/samples.js`.
