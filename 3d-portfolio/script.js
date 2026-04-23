document.addEventListener("DOMContentLoaded", () => {
  const cube = document.getElementById("cube");

  let x = 0;
  let y = 0;

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") x -= 90;
    if (event.key === "ArrowDown") x += 90;
    if (event.key === "ArrowLeft") y -= 90;
    if (event.key === "ArrowRight") y += 90;

    cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  });
});
