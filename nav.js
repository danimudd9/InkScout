// ===================== nav.js =====================

(function() {
  // Active nav link highlight
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a:not(.logo)').forEach(link => {
    const linkPage = link.getAttribute('href')?.split('/').pop();
    if (linkPage === currentPage) link.classList.add('nav-active');
  });

  // Secret admin shortcut — press B + L + O together
  const keys = new Set();
  document.addEventListener('keydown', (e) => {
    keys.add(e.key.toLowerCase());
    if (keys.has('b') && keys.has('l') && keys.has('o')) {
      window.location.href = 'admin-login.html';
    }
  });
  document.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));

  // ── Auth user avatar + dropdown ──
  // Dynamically inject avatar into nav after Firebase loads
  async function initAuthNav() {
    try {
      const { auth, db } = await import('./firebase.js');
      const { onAuthStateChanged, signOut } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
      const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

      onAuthStateChanged(auth, async (user) => {
        // Remove any existing auth widget
        document.getElementById('nav-auth-widget')?.remove();

        const navEl = document.querySelector('.nav nav');
        if (!navEl) return;

        if (!user) {
          // Not logged in — show Login link if not already there
          return;
        }

        // Load user data
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) return;
        const data = userDoc.data();

        // Determine dashboard link
        const dashLink = data.role === 'admin'   ? 'admin-dashboard.html'
                       : data.role === 'artist'  ? 'artist-dashboard.html'
                       : 'canvas-dashboard.html';

        // Hide the Login link since user is logged in
        navEl.querySelectorAll('a').forEach(a => {
          if (a.href.includes('prelogin') || a.href.includes('login')) {
            a.style.display = 'none';
          }
        });

        // Build avatar widget
        const widget = document.createElement('div');
        widget.id = 'nav-auth-widget';
        widget.className = 'nav-auth-widget';
        widget.innerHTML = `
          <button class="nav-avatar-btn" id="navAvatarBtn" aria-label="Account menu">
            <div class="nav-avatar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            ${data.plan === 'pro' ? '<span class="nav-avatar-pro">⚡</span>' : ''}
          </button>
          <div class="nav-dropdown" id="navDropdown">
            <div class="nav-dropdown-header">
              <p class="nav-dropdown-name">${data.name || 'User'}</p>
              <p class="nav-dropdown-role">${data.role === 'admin' ? 'Admin' : data.role === 'artist' ? 'Artist' : 'Canvas'}${data.plan === 'pro' ? ' · Pro' : ''}</p>
            </div>
            <div class="nav-dropdown-divider"></div>
            <a href="${dashLink}" class="nav-dropdown-item" style="text-align:left;display:block;">Dashboard</a>
            ${data.role === 'artist' ? `<a href="profile.html?uid=${user.uid}" class="nav-dropdown-item" style="text-align:left;display:block;">My Profile</a>` : ''}
            <div class="nav-dropdown-divider"></div>
            <button class="nav-dropdown-item nav-dropdown-signout" style="text-align:left;" id="navSignOut">Sign Out</button>
          </div>
        `;

        navEl.appendChild(widget);

        // Toggle dropdown
        const btn      = document.getElementById('navAvatarBtn');
        const dropdown = document.getElementById('navDropdown');

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('open');
        });

        document.addEventListener('click', () => dropdown.classList.remove('open'));

        // Sign out
        document.getElementById('navSignOut').addEventListener('click', async () => {
          await signOut(auth);
          window.location.href = 'index.html';
        });
      });
    } catch (err) {
      // Firebase not available on this page — skip
    }
  }

  initAuthNav();
})();