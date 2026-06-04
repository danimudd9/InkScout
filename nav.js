// ===================== nav.js =====================
// Highlights the active nav link based on current page
// Include at the bottom of every page: <script src="nav.js"></script>

(function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(link => {
    const linkPage = link.getAttribute('href')?.split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('nav-active');
    }
  });
})();