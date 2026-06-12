/* Stackly Job Portal — UI Demo Script (No Authentication) */

// Redirect to login page (used by Sign Out buttons)
function logoutUser() {
  window.location.replace('login.html');
}

// Update nav Sign In button on landing pages
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const isDashboardPage = path.includes('recruiter-dashboard.html') || path.includes('job-seeker-dashboard.html');
  const isLoginPage = path.includes('login.html');
  const isSignupPage = path.includes('signup.html');

  if (!isDashboardPage && !isLoginPage && !isSignupPage) {
    const navActions = document.getElementById('navbar-actions-container') || document.querySelector('.nav-actions');
    const mobileNavActions = document.getElementById('mobile-nav-actions-container') || document.querySelector('.mobile-nav-actions');
    const signInBtn = `<a href="login.html" class="btn btn-primary"><i class="fas fa-sign-in-alt"></i> Sign In</a>`;
    if (navActions) {
      navActions.style.display = 'flex';
      navActions.innerHTML = signInBtn;
    }
    if (mobileNavActions) mobileNavActions.innerHTML = signInBtn;
  }
});
