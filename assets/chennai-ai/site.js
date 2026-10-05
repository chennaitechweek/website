const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const toggle = document.querySelector('.theme-toggle');
let chosenTheme = null;
try {
  const saved = localStorage.getItem('chennai-theme');
  if (saved === 'light' || saved === 'dark') chosenTheme = saved;
} catch { /* The system theme remains usable when storage is unavailable. */ }
function applyTheme() {
  const theme = chosenTheme || (systemTheme.matches ? 'dark' : 'light');
  if (chosenTheme) document.documentElement.dataset.theme = chosenTheme;
  if (toggle) {
    toggle.hidden = false;
    toggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
    toggle.setAttribute('aria-label', `Use ${theme === 'dark' ? 'light' : 'dark'} appearance`);
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#151713' : '#f5f4ee');
}
toggle?.addEventListener('click', () => {
  const current = chosenTheme || (systemTheme.matches ? 'dark' : 'light');
  chosenTheme = current === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('chennai-theme', chosenTheme); } catch { /* Theme changes still apply for this visit. */ }
  applyTheme();
});
systemTheme.addEventListener('change', applyTheme);
applyTheme();
