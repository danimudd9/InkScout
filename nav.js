// ===================== nav.js =====================
// Highlights the active nav link based on current page
// Include at the bottom of every page: <script src="nav.js"></script>

(function() {
  // Active nav highlight
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(link => {
    const linkPage = link.getAttribute('href')?.split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('nav-active');
    }
  });

  // Secret admin shortcut — press B + L + O together
  const keys = new Set();
  document.addEventListener('keydown', (e) => {
    keys.add(e.key.toLowerCase());
    if (keys.has('b') && keys.has('l') && keys.has('o')) {
      window.location.href = 'admin-login.html';
    }
  });
  document.addEventListener('keyup', (e) => {
    keys.delete(e.key.toLowerCase());
  });
})();