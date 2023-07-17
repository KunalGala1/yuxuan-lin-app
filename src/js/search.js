const search = document.getElementById('search');
const searchBar = document.getElementById('search-bar');
const tagsList = document.querySelector('.forces');
const subsections = document.querySelectorAll('.subsection');

const activeTags = new Set(); // Use a Set to store the active tags

function filterSubsections() {
  const searchTerm = searchBar.value.trim().toLowerCase();

  subsections.forEach(subsection => {
    const subsectionTag = subsection.querySelector('h2.main-header').textContent.trim().toLowerCase();
    const isTagSelected = activeTags.size === 0 || activeTags.has(subsectionTag);
    subsection.style.display = isTagSelected ? 'block' : 'none';

    const cards = subsection.querySelectorAll('.card');
    let hasMatchingCards = false;

    cards.forEach(card => {
      const titleElement = card.querySelector('.heading h3').textContent.trim().toLowerCase();
      const subtitleElement = card.querySelector('.heading p');
      const subtitleText = subtitleElement ? subtitleElement.textContent.trim().toLowerCase() : '';

      if (titleElement.includes(searchTerm) || subtitleText.includes(searchTerm)) {
        card.style.display = 'block';
        hasMatchingCards = true;
      } else {
        card.style.display = 'none';
      }
    });

    // Show/hide the subsection based on whether it has matching cards
    subsection.style.display = isTagSelected && hasMatchingCards ? 'block' : 'none';
  });
}

searchBar.addEventListener('input', filterSubsections);

tagsList.addEventListener('click', function (event) {
  const clickedTag = event.target.closest('li');
  if (!clickedTag) return;

  const clickedTagText = clickedTag.textContent.trim().toLowerCase();
  if (activeTags.has(clickedTagText)) {
    // If the clicked tag is already active, remove it from activeTags
    activeTags.delete(clickedTagText);
  } else {
    // If the clicked tag is not active, add it to activeTags
    activeTags.add(clickedTagText);
  }

  // Toggle the 'active' class on the clicked tag
  clickedTag.classList.toggle('active');

  filterSubsections();
});

// Initial filtering
filterSubsections();
