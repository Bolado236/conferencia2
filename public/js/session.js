/**
 * Session management script to check user session and redirect if unauthorized.
 * This script replaces inline sessionStorage checks in HTML files.
 */

(function() {
  const tipo = sessionStorage.getItem("tipo");
  const usuario = sessionStorage.getItem("usuario");
  const pathname = location.pathname;

  const isLoginPage = pathname.endsWith("login.html");
  const isAdminPage = pathname.endsWith("admin.html");

  if (!usuario && !isLoginPage) {
    // Redirect to login if no user session and not already on login page
    location.href = "login.html";
  }

  if (isAdminPage && tipo !== "admin") {
    // Redirect non-admin users away from admin page
    location.href = "login.html";
  }
})();
