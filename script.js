const grid = document.getElementById("grid");
const resetBtn = document.getElementById("reset");

function pickRandomIdeas(n) {
  const shuffled = [...ideas].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function createScratchTile(ideaText) {
  const canvas = document.createElement("canvas");
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext("2d");

  // Draw the scratch layer (dark gray)
  ctx.fillStyle = "#555";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Scratch me!", canvas.width / 2, canvas.height / 2);

  // Hidden message
  const hidden = document.createElement("div");
  hidden.style.position = "absolute";
  hidden.style.width = "120px";
  hidden.style.height = "120px";
  hidden.style.display = "flex";
  hidden.style.alignItems = "center";
  hidden.style.justifyContent = "center";
  hidden.style.fontWeight = "bold";
  hidden.style.fontSize = "14px";
  hidden.style.color = "#222";
  hidden.innerText = ideaText;

  // Tile container
  const container = document.createElement("div");
  container.style.position = "relative";
  container.appendChild(hidden);
  container.appendChild(canvas);

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
    const { x, y } = getMousePos(e);
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 15, 0, Math.PI * 2);
    scratchCtx.fill();
  };

  canvas.addEventListener("mousedown", () => (isDrawing = true));
  canvas.addEventListener("mouseup", () => (isDrawing = false));
  canvas.addEventListener("mousemove", scratch);

  canvas.addEventListener("touchstart", () => (isDrawing = true));
  canvas.addEventListener("touchend", () => (isDrawing = false));
  canvas.addEventListener("touchmove", scratch);

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
