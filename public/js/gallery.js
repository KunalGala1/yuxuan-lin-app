const spotlight = document.getElementById("spotlight"),
  cards = document.querySelectorAll(
    "#photos-pg main section[role='content'] .card"
  ),
  closeBtn = document.querySelector("#spotlight .close-btn"),
  nextBtn = document.querySelectorAll("#spotlight .angle-btn")[1],
  prevBtn = document.querySelectorAll("#spotlight .angle-btn")[0];
spotlight.addEventListener("click", (t) => {
  t.target == spotlight &&
    (spotlight.classList.remove("active"),
    document.body.classList.remove("frozen"),
    (spotlight.querySelector("img").src = ""),
    spotlight.querySelector("img").setAttribute("alt", ""));
}),
  closeBtn.addEventListener("click", () => {
    spotlight.classList.remove("active"),
      document.body.classList.remove("frozen"),
      (spotlight.querySelector("img").src = ""),
      spotlight.querySelector("img").setAttribute("alt", "");
  }),
  Array.from(cards).forEach((t) => {
    t.addEventListener("click", (t) => {
      spotlight.classList.add("active");
      const e = t.target.src;
      (spotlight.querySelector("img").src = e),
        document.body.classList.add("frozen"),
        (spotlight.style.top = window.scrollY + "px");
    });
  }),
  window.addEventListener("resize", () => {
    spotlight.style.top = window.scrollY + "px";
  }),
  nextBtn.addEventListener("click", () => {
    for (let t = 0; t < Array.from(cards).length; t++) {
      const e = Array.from(cards)[t];
      if (e.firstElementChild.src == spotlight.querySelector("img").src) {
        let t = Array.from(cards).indexOf(e);
        t++,
          t >= cards.length && (t = 0),
          (spotlight.querySelector("img").src = cards[t].firstElementChild.src);
        break;
      }
    }
  }),
  prevBtn.addEventListener("click", () => {
    for (let t = 0; t < Array.from(cards).length; t++) {
      const e = Array.from(cards)[t];
      if (e.firstElementChild.src == spotlight.querySelector("img").src) {
        let t = Array.from(cards).indexOf(e);
        t--,
          t < 0 && (t = cards.length - 1),
          (spotlight.querySelector("img").src = cards[t].firstElementChild.src);
        break;
      }
    }
  });
