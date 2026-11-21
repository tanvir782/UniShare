// main.js - shared navbar/footer + small helpers used by every page

// Makes user text safe to put inside HTML
function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
// Read and trim the value of an input
function val(id) { return document.getElementById(id).value.trim(); }
// Show a message. type = "error" or "success" (matches CSS classes)
function showMsg(id, text, type) {
  var el = document.getElementById(id);
  el.innerHTML = text;
  el.className = "msg " + type;
}
// Mobile menu open / close
function toggleMenu() {
  var menu = document.getElementById("navLinks");
  menu.className = (menu.className.indexOf("open") === -1) ? "nav-links open" : "nav-links";
}

// Build the navbar and footer on every page
function loadLayout() {
  var user = getCurrentUser();
  var auth = user
    ? '<a href="#" onclick="logout(); return false;">Logout (' + esc(user.fullName.split(" ")[0]) + ')</a>'
    : '<span><a href="login.html">Login</a> / <a href="register.html">Register</a></span>';

  document.getElementById("site-header").innerHTML =
    '<nav class="navbar"><div class="nav-inner">' +
    '<a class="logo" href="index.html">Uni<span>Share</span></a>' +
    '<button class="menu-btn" onclick="toggleMenu()">☰</button>' +
    '<div class="nav-links" id="navLinks">' +
    '<a href="index.html">Home</a><a href="explore.html">Explore</a>' +
    '<a href="explore.html?type=Donate">Donate</a><a href="explore.html?type=Rent">Rent</a><a href="explore.html?type=Sell">Sell</a>' +
    '<a href="add-item.html">Add Item</a>' + auth + '<a href="dashboard.html">My Dashboard</a>' +
    '</div></div></nav>';

  document.getElementById("site-footer").innerHTML =
    '<div class="container footer-grid">' +
    '<div><h3 class="logo">Uni<span>Share</span></h3><p>Donate, rent and sell unused academic items on campus.</p></div>' +
    '<div><h4>Quick Links</h4><a href="index.html">Home</a><a href="explore.html">Explore</a><a href="add-item.html">Add Item</a><a href="about.html">About</a></div>' +
    '<div><h4>Contact</h4><p>unishare@example.edu</p><p>University student project</p></div>' +
    '</div><p class="copy">© 2026 UniShare - Academic frontend prototype</p>';
}
loadLayout();
