/* UniShare - main.js : navbar, footer and small shared helpers */
var UniShareApp = (function () {
  var USER_KEY = "unishare_current_user";

  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }
  function escapeHtml(text) {
    return String(text == null ? "" : text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function getCurrentUser() { return read(USER_KEY, null); }
  function setCurrentUser(user) { return write(USER_KEY, user); }
  function logout() {
    try { localStorage.removeItem(USER_KEY); } catch (e) {}
    window.location.href = "index.html";
  }

  function buildHeader() {
    var box = document.getElementById("site-header");
    if (!box) return;
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var user = getCurrentUser();
    var links = [
      ["index.html", "Home"], ["explore.html", "Explore"],
      ["add-item.html", "Add Item"], ["about.html", "About"]
    ];
    if (user) { links.push(["dashboard.html", "Dashboard"]); }
    else { links.push(["login.html", "Login"]); links.push(["register.html", "Register"]); }

    var html = '<div class="container nav-wrap">' +
      '<a class="logo" href="index.html">Uni<span class="accent">Share</span></a>' +
      '<button class="nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>' +
      '<nav id="mainNav">';
    links.forEach(function (l) {
      html += '<a href="' + l[0] + '"' + (page === l[0] ? ' class="active"' : '') + '>' + l[1] + '</a>';
    });
    if (user) {
      html += '<a href="#" id="logoutLink">Logout (' + escapeHtml(user.name.split(" ")[0]) + ')</a>';
    }
    html += '</nav></div>';
    box.innerHTML = html;

    var toggle = box.querySelector(".nav-toggle");
    var nav = box.querySelector("#mainNav");
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    var out = document.getElementById("logoutLink");
    if (out) out.addEventListener("click", function (e) { e.preventDefault(); logout(); });
  }

  function buildFooter() {
    var box = document.getElementById("site-footer");
    if (!box) return;
    box.innerHTML = '<div class="container footer-wrap">' +
      '<p>&copy; ' + new Date().getFullYear() + ' UniShare - Student Sharing &amp; Marketplace</p>' +
      '<p class="muted">Frontend prototype. Data is saved only in your browser.</p></div>';
  }

  function showMessage(id, text, ok) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = "msg " + (ok ? "success" : "error");
    el.style.display = "block";
  }

  function init() { buildHeader(); buildFooter(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return {
    read: read, write: write, escapeHtml: escapeHtml,
    getCurrentUser: getCurrentUser, setCurrentUser: setCurrentUser,
    logout: logout, showMessage: showMessage
  };
})();
