import redUrl from "./images/red.png";

const heading = document.createElement("h1");
heading.textContent = "Image from nested directory (Vite import)";
document.body.appendChild(heading);

const img = document.createElement("img");
img.src = redUrl;
img.alt = "Red square";
img.style.width = "100px";
img.style.height = "100px";
img.style.imageRendering = "pixelated";
document.body.appendChild(img);

const info = document.createElement("p");
info.textContent = `Resolved URL: ${redUrl}`;
document.body.appendChild(info);
