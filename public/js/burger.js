// Function to handle the click event on 'burger'
function burgerClickHandler() {
  const navUl = document.querySelector("nav ul");
  burger.classList.toggle("active");

  if (burger.classList.contains("active")) {
    navUl.scroll(1000, 0);
  } else {
    navUl.scroll(0, 0);
  }
}

// Wait for the DOM to load completely
document.addEventListener("DOMContentLoaded", () => {
  // Check if the 'burger' element exists
  const burger = document.getElementById("burger");
  if (burger) {
    burger.addEventListener("click", burgerClickHandler);
  } else {
    console.log("Element with ID 'burger' not found.");
  }
});
