document.addEventListener('DOMContentLoaded', () => {
  const languageBtns = document.getElementById('language');
  if (!languageBtns) return;
  const urlParams = new URLSearchParams(window.location.search);

  // Get language from URL or default to 'en'
  const lang = urlParams.get('lang') || 'en';

  // Add 'active' class to the appropriate language button
  if (lang === 'en') {
    languageBtns.querySelector('span:first-child a').classList.add('active');
  } else if (lang === 'zh') {
    languageBtns.querySelector('span:last-child a').classList.add('active');
  }

  // Set link hrefs
  const updateUrl = (currentUrl, newLang) => {
    const url = new URL(currentUrl);
    url.searchParams.set('lang', newLang);
    return url.href;
  };

  // Set href for 'en' language button
  const enHref = updateUrl(window.location.href, 'en');
  languageBtns.querySelector('span:first-child a').href = enHref;

  // Set href for 'zh' language button
  const zhHref = updateUrl(window.location.href, 'zh');
  languageBtns.querySelector('span:last-child a').href = zhHref;
});
