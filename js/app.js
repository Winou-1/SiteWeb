const parallax_el = document.querySelectorAll(".parallax");
const main = document.querySelector("main");
let animationCompleted = false; // Détermine si l'animation GSAP est terminée

let xValue = 0,
  yValue = 0;
let rotateDegree = 0;

function update(cursorPosition) {
  parallax_el.forEach((el) => {
    let speedx = el.dataset.speedx;
    let speedy = el.dataset.speedy;
    let speedz = el.dataset.speedz;
    let rotateSpeed = el.dataset.rotation;

    let isInLeft =
      parseFloat(getComputedStyle(el).left) < window.innerWidth / 2 ? 1 : -1;
    let zValue =
      (cursorPosition - parseFloat(getComputedStyle(el).left)) * isInLeft * 0.1;

    el.style.transform = `perspective(2300px) translateZ(${
      zValue * speedz
    }px) rotateY(${rotateDegree * rotateSpeed}deg) translateX(calc(-50% + ${
      -xValue * speedx
    }px)) translateY(calc(-50% + ${yValue * speedy}px))`;
  });
}

update(0);

window.addEventListener("mousemove", (e) => {
  if (!animationCompleted) return; // Désactive l'effet parallax tant que l'animation GSAP n'est pas terminée

  xValue = e.clientX - window.innerWidth / 2;
  yValue = e.clientY - window.innerHeight / 2;

  rotateDegree = (xValue / (window.innerWidth / 2)) * 20;

  update(e.clientX);
});

if (window.innerWidth >= 725) {
  main.style.maxHeight = `${window.innerWidth * 0.6}px`;
} else {
  main.style.maxHeight = `${window.innerWidth * 1.6}px`;
}

// Animation GSAP
function startAnimation() {
  let timeline = gsap.timeline();

  parallax_el.forEach((el) => {
    el.style.transition = "0.45s cubic-bezier(0.2, 0.49, 0.32, 0.99)";
  });

  // Assurez-vous que toutes les images deviennent visibles au début de l'animation
  Array.from(parallax_el)
    .filter((el) => !el.classList.contains("text"))
    .forEach((el) => {
      timeline.from(
        el,
        {
          top: `${el.offsetHeight / 2 + +el.dataset.distance}px`,
          duration: 3.5, // Durée de l'animation
          ease: "power3.out",
        },
        "1.2"
      );
    });

  timeline
    .from(
      ".text h1",
      {
        y:
          window.innerHeight -
          document.querySelector(".text h1").getBoundingClientRect().top +
          200,
        duration: 2,
      },
      "2.5"
    )
    .from(
      ".text h2",
      {
        y: -150,
        opacity: 0,
        duration: 1.5,
      },
      "3"
    )
    .from(
      ".button-theme",
      {
        y:
          window.innerHeight -
          document.querySelector(".button-theme").getBoundingClientRect().top +
          200,
        duration: 2,
        duration: 1.5,
      },
      "3"
    )
    .from(
      ".hide",
      {
        opacity: 0,
        duration: 1.5,
      },
      "3"
    )
    .eventCallback("onComplete", () => {
      animationCompleted = true; // L'animation GSAP est terminée
    });
}

window.onload = function () {
  const button = document.querySelector("#play-button");
  const page = document.querySelector(".page");

  button.addEventListener("click", function handleClick() {
    document.documentElement.scrollTop = 0;
    // Désactive le défilement
    document.body.style.overflow = "hidden";
    page.style.display = "block"; // Affiche l'élément
    setTimeout(() => {
      page.style.opacity = "1";
    }, 220);

    // Démarre l'animation immédiatement au clic du bouton
    startAnimation();

    // Une fois l'animation commencée, on enlève l'event listener pour ne pas la redémarrer
    button.removeEventListener("click", handleClick);

    // Cache le bouton sans laisser d'espace
    button.classList.add("hidden");
  });
};
