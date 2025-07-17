const grid = document.getElementById("grid");
const resetBtn = document.getElementById("reset");

function pickRandomIdeas(n) {
  const shuffled = [...ideas].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function createScratchTile(ideaText) {
  // Canvas setup
  const canvas = document.createElement("canvas");
  canvas.width = 120;
  canvas.height = 120;
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "2";
  canvas.style.borderRadius = "8px";

  const ctx = canvas.getContext("2d");

  // Draw gray scratch layer
  ctx.fillStyle = "#555";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Scratch me!", canvas.width / 2, canvas.height / 2);

  // Hidden idea text
  const hidden = document.createElement("div");
  hidden.textContent = ideaText;
  hidden.style.width = "120px";
  hidden.style.height = "120px";
  hidden.style.display = "flex";
  hidden.style.alignItems = "center";
  hidden.style.justifyContent = "center";
  hidden.style.fontWeight = "bold";
  hidden.style.fontSize = "14px";
  hidden.style.color = "#222";
  hidden.style.background = "#eee";
  hidden.style.position = "absolute";
  hidden.style.top = "0";
  hidden.style.left = "0";
  hidden.style.zIndex = "1";
  hidden.style.borderRadius = "8px";

  // Tile container
  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.width = "120px";
  container.style.height = "120px";
  container.style.margin = "5px";
  container.appendChild(hidden);
  container.appendChild(canvas);

  // Scratch logic
  const scratchCtx = ctx;
  scratchCtx.globalCompositeOperation = "destination-out";
  let isDrawing = false;

  const getMousePos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x, y };
  };

  const scratch = (e) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    const { x, y } = getMousePos(e);
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 15, 0, Math.PI * 2);
    scratchCtx.fill();
  };

  // Mouse and touch events
  canvas.addEventListener("mousedown", () => (isDrawing = true));
  canvas.addEventListener("mouseup", () => (isDrawing = false));
  canvas.addEventListener("mouseleave", () => (isDrawing = false));
  canvas.addEventListener("mousemove", scratch);

  canvas.addEventListener("touchstart", (e) => {
    isDrawing = true;
    if (e.cancelable) e.preventDefault();
  }, { passive: false });

  canvas.addEventListener("touchend", () => (isDrawing = false));
  canvas.addEventListener("touchcancel", () => (isDrawing = false));
  canvas.addEventListener("touchmove", scratch, { passive: false });

  return container;
}

function renderGrid() {
  grid.innerHTML = "";
  const selectedIdeas = pickRandomIdeas(9);
  selectedIdeas.forEach((idea) => {
    const tile = createScratchTile(idea);
    grid.appendChild(tile);
  });
}

resetBtn.addEventListener("click", renderGrid);
renderGrid();

