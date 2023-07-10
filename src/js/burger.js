const burger = document.getElementById('burger');

burger.addEventListener('click', () => {
  const navUl = document.querySelector('nav ul');
  burger.classList.toggle('active');

  if (burger.classList.contains('active')) {
    navUl.scroll(1000, 0);
  } else {
    navUl.scroll(0, 0);
  }
});
