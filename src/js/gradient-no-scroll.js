document.querySelector('nav ul').addEventListener('scroll', ev => {
  const gradient = document.getElementById('gradient');
  const burger = document.getElementById('burger');
  const scrollLeft = ev.target.scrollLeft;
  gradient.style.left = scrollLeft + 'px';

  if (scrollLeft > 0) {
    burger.classList.add('active');
  } else {
    burger.classList.remove('active');
  }
});
