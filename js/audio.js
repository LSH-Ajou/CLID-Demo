(function () {
  "use strict";

  const comparisonModels = [
    { key: "clidTts", label: "CLID-TTS", note: "Proposed model" },
    { key: "clidNoCfg", label: "CLID w/o CFG", note: "Ablation" },
    { key: "qwen3VoiceDesign", label: "Qwen3-TTS-VoiceDesign", note: "Voice design baseline" },
    { key: "gemini", label: "Gemini 3.1 Flash-TTS", note: "Baseline" },
    { key: "voxcpm2", label: "VoxCPM2", note: "Baseline" },
    { key: "gt", label: "GT", note: "Ground-truth recording" }
  ];
  const pairedModels = [comparisonModels[0], comparisonModels[3]];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function pauseAll(except) {
    document.querySelectorAll("audio[data-clid-player]").forEach((audio) => {
      if (audio !== except && !audio.paused) audio.pause();
    });
  }

  window.CLIDAudio = { pauseAll };
  window.addEventListener("hashchange", () => pauseAll());
  window.addEventListener("pagehide", () => pauseAll());

  function emotionNames(items) {
    return [...new Set(items.map((item) => item.emotion))];
  }

  function defaultEmotion(emotions) {
    return emotions.includes("Happy") ? "Happy" : emotions[0];
  }

  function makeSelect(id, label, options, value) {
    const field = element("div", "field");
    const labelNode = element("label", "", label);
    const select = element("select");
    labelNode.htmlFor = id;
    select.id = id;
    options.forEach((option) => {
      const node = element("option", "", option.label);
      node.value = String(option.value);
      select.append(node);
    });
    if (value !== undefined) select.value = String(value);
    field.append(labelNode, select);
    return { field, select };
  }

  function makeEmotionSelect(id, emotions) {
    return makeSelect(id, "Emotion", emotions.map((emotion) => ({
      label: emotion,
      value: emotion
    })), defaultEmotion(emotions));
  }

  function makeStatus(id) {
    const status = element("p", "demo-status");
    status.id = id;
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    return status;
  }

  function makeSpokenText(text) {
    const context = element("div", "sample-context");
    const spoken = element("p", "spoken-text", text);
    spoken.lang = "ko";
    context.append(element("p", "eyebrow", "Spoken text"), spoken);
    return context;
  }

  function makeInstruction(instruction) {
    const block = element("div", "instruction-block");
    const korean = element("p", "", instruction.instructionKo || "");
    korean.lang = "ko";
    block.append(element("p", "eyebrow", "Korean instruction"), korean);

    if (instruction.instructionEn) {
      const translation = element("details", "translation");
      const summary = element("summary", "", "English translation · Not used for inference");
      const english = element("p", "", instruction.instructionEn);
      english.lang = "en";
      translation.append(summary, english);
      block.append(translation);
    }
    return block;
  }

  function makePlayer(model, path, sampleLabel, headingTag) {
    const card = element("div", "player-card");
    if (model.key === "clidTts") card.classList.add("is-ours");
    card.append(
      element(headingTag || "h3", "player-label", model.label),
      element("p", "player-meta", model.note)
    );

    if (!path) {
      card.append(element("p", "audio-error", "Audio is not available for this sample."));
      return card;
    }

    const audio = element("audio");
    const error = element("p", "audio-error", "This audio could not be loaded. Please refresh the page and try again.");
    audio.controls = true;
    audio.preload = "metadata";
    audio.dataset.clidPlayer = "";
    audio.setAttribute("aria-label", `${model.label} — ${sampleLabel}`);
    audio.src = path;
    error.hidden = true;
    error.setAttribute("role", "status");
    audio.append(document.createTextNode("Your browser does not support audio playback."));
    audio.addEventListener("play", () => pauseAll(audio));
    audio.addEventListener("error", () => { error.hidden = false; });
    audio.addEventListener("loadeddata", () => { error.hidden = true; });
    card.append(audio, error);
    return card;
  }

  function makePlayerGrid(models, paths, sampleLabel, headingTag) {
    const grid = element("div", "player-grid");
    models.forEach((model) => {
      grid.append(makePlayer(model, paths[model.key], sampleLabel, headingTag));
    });
    return grid;
  }

  function unavailable(mount) {
    mount.replaceChildren(element("p", "demo-status", "Audio samples are currently unavailable."));
  }

  function mountComparison(samples) {
    const mount = document.getElementById("comparison-demo");
    if (!mount) return;
    if (!samples.length) return unavailable(mount);

    const emotions = emotionNames(samples);
    const { field, select } = makeEmotionSelect("comparison-emotion", emotions);
    const toolbar = element("div", "demo-toolbar");
    const status = makeStatus("comparison-status");
    const content = element("div");
    select.setAttribute("aria-describedby", status.id);
    toolbar.append(field);
    mount.replaceChildren(toolbar, status, content);

    function render() {
      pauseAll();
      const sample = samples.find((item) => item.emotion === select.value);
      if (!sample) return;
      content.replaceChildren(
        makeSpokenText(sample.text),
        makeInstruction(sample),
        makePlayerGrid(comparisonModels, sample.audio || {}, `${sample.emotion} comparison`)
      );
      status.textContent = `${sample.emotion} · 6 models · ${emotions.length} emotions available`;
    }

    select.addEventListener("change", render);
    render();
  }

  function mountBenchmark(samples) {
    const mount = document.getElementById("benchmark-demo");
    if (!mount) return;
    if (!samples.length) return unavailable(mount);

    const emotions = emotionNames(samples);
    const emotionControl = makeEmotionSelect("benchmark-emotion", emotions);
    const sampleControl = makeSelect("benchmark-sample", "Sample", []);
    const toolbar = element("div", "demo-toolbar");
    const status = makeStatus("benchmark-status");
    const content = element("div");
    let filtered = [];
    emotionControl.select.setAttribute("aria-describedby", status.id);
    sampleControl.select.setAttribute("aria-describedby", status.id);
    toolbar.append(emotionControl.field, sampleControl.field);
    mount.replaceChildren(toolbar, status, content);

    function render() {
      pauseAll();
      const index = Number(sampleControl.select.value);
      const sample = filtered[index];
      if (!sample) return;
      content.replaceChildren(
        makeSpokenText(sample.text),
        makeInstruction(sample),
        makePlayerGrid(pairedModels, sample.audio || {}, `${sample.emotion}, sample ${index + 1}`)
      );
      status.textContent = `${sample.emotion} · Sample ${index + 1} of ${filtered.length} · 2 models · ${samples.length} samples available`;
    }

    function changeEmotion() {
      filtered = samples.filter((sample) => sample.emotion === emotionControl.select.value);
      sampleControl.select.replaceChildren(...filtered.map((sample, index) => {
        const option = element("option", "", `Sample ${index + 1}`);
        option.value = String(index);
        return option;
      }));
      sampleControl.select.value = "0";
      render();
    }

    emotionControl.select.addEventListener("change", changeEmotion);
    sampleControl.select.addEventListener("change", render);
    changeEmotion();
  }

  function mountControl(demo) {
    const mount = document.getElementById("control-demo");
    if (!mount) return;
    const texts = Array.isArray(demo.texts) ? demo.texts : [];
    const instructions = Array.isArray(demo.instructions) ? demo.instructions : [];
    if (!texts.length || !instructions.length) return unavailable(mount);

    const emotions = emotionNames(instructions);
    const textControl = makeSelect("control-text", "Text", texts.map((item, index) => ({
      label: `Text ${index + 1}`,
      value: index
    })), 0);
    const emotionControl = makeEmotionSelect("control-emotion", emotions);
    const toolbar = element("div", "demo-toolbar");
    const status = makeStatus("control-status");
    const content = element("div");
    textControl.select.setAttribute("aria-describedby", status.id);
    emotionControl.select.setAttribute("aria-describedby", status.id);
    toolbar.append(textControl.field, emotionControl.field);
    mount.replaceChildren(toolbar, status, content);

    function render() {
      pauseAll();
      const textIndex = Number(textControl.select.value);
      const text = texts[textIndex];
      const emotion = emotionControl.select.value;
      const selectedInstructions = instructions.filter((item) => item.emotion === emotion);
      if (!text) return;
      const stack = element("div", "variant-stack");

      selectedInstructions.forEach((instruction) => {
        const variant = Number(instruction.variant);
        const ordinal = 6 + textIndex * 2 + variant;
        const panel = element("section", "variant-panel");
        const heading = element("h3", "", `Instruction ${variant}`);
        heading.id = `control-variant-${variant}`;
        panel.setAttribute("aria-labelledby", heading.id);
        panel.append(
          heading,
          makeInstruction(instruction),
          makePlayerGrid(pairedModels, {
            clidTts: `audio/sec3_${instruction.key}_${ordinal}.wav`,
            gemini: `audio/sec3_${instruction.key}_${ordinal}_gemini.wav`
          }, `text ${textIndex + 1}, ${emotion}, instruction ${variant}`, "h4")
        );
        stack.append(panel);
      });

      content.replaceChildren(makeSpokenText(text.text), stack);
      status.textContent = `Text ${textIndex + 1} of ${texts.length} · ${emotion} · ${selectedInstructions.length} instructions · 2 models · ${emotions.length} emotions available`;
    }

    textControl.select.addEventListener("change", render);
    emotionControl.select.addEventListener("change", render);
    render();
  }

  function init() {
    mountComparison(Array.isArray(window.CLID_TTS_SAMPLES) ? window.CLID_TTS_SAMPLES : []);
    mountBenchmark(Array.isArray(window.CLID_TTS_KOREAN_BENCHMARK_SAMPLES) ? window.CLID_TTS_KOREAN_BENCHMARK_SAMPLES : []);
    mountControl(window.CLID_TTS_SAME_TEXT_DEMO || {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());
