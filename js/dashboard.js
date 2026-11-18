/* UniShare - dashboard.js : user stats and listing management */
(function () {
  var ITEMS_KEY = "unishare_items";

  function loadItems() { return UniShareApp.read(ITEMS_KEY, []); }
  function ownerOf(i) { return String(i.ownerEmail || i.owner || i.email || "").toLowerCase(); }
  function nameOf(i) { return i.name || i.title || "Untitled"; }
  function priceText(i) {
    if (i.type === "Donate") return "Free";
    if (i.type === "Rent") return "৳" + (i.rentPrice || i.price || 0) + " / " + (i.rentUnit || "day");
    return "৳" + (i.sellPrice || i.price || 0);
  }

  window.deleteMyListing = function (id) {
    if (!confirm("Delete this listing?")) return;
    var items = loadItems().filter(function (i) { return String(i.id) !== String(id); });
    UniShareApp.write(ITEMS_KEY, items);
    window.showDashboard();
  };

  window.showDashboard = function () {
    var box = document.getElementById("dashboardBox");
    if (!box) return;
    var user = UniShareApp.getCurrentUser();
    if (!user) {
      box.innerHTML = '<div class="service"><h3>Please login</h3><p>You need to login to see your dashboard.</p>' +
        '<a class="btn btn-small" href="login.html">Login</a> <a class="btn btn-small btn-outline" href="register.html">Register</a></div>';
      return;
    }
    var mine = loadItems().filter(function (i) { return ownerOf(i) === user.email.toLowerCase(); });
    var count = function (t) { return mine.filter(function (i) { return i.type === t; }).length; };
    var e = UniShareApp.escapeHtml;

    var html = '<p class="muted">Welcome, <b>' + e(user.name) + '</b> &middot; ' + e(user.university) + ' &middot; ' + e(user.dept) + '</p><br>' +
      '<div class="grid stats">' +
      '<div class="service stat"><h3>' + mine.length + '</h3><p>Total listings</p></div>' +
      '<div class="service stat"><h3>' + count("Donate") + '</h3><p>Donate</p></div>' +
      '<div class="service stat"><h3>' + count("Rent") + '</h3><p>Rent</p></div>' +
      '<div class="service stat"><h3>' + count("Sell") + '</h3><p>Sell</p></div></div><br>' +
      '<div class="btn-row"><a class="btn" href="add-item.html">+ Add New Item</a></div>' +
      '<h2 class="section-title">My <span>Listings</span></h2>';

    if (!mine.length) {
      html += '<p class="muted">You have not posted anything yet.</p>';
    } else {
      html += '<div class="grid">';
      mine.forEach(function (i) {
        html += '<div class="service"><h3>' + e(nameOf(i)) + '</h3>' +
          '<p><b>' + e(i.type || "") + '</b> &middot; ' + e(priceText(i)) + '</p>' +
          '<p class="muted">' + e(i.category || "") + (i.condition ? ' &middot; ' + e(i.condition) : '') + '</p>' +
          '<div class="btn-row"><a class="btn btn-small" href="item-details.html?id=' + encodeURIComponent(i.id) + '">View</a> ' +
          '<button class="btn btn-small btn-dark" onclick="deleteMyListing(\'' + String(i.id).replace(/'/g, "") + '\')">Delete</button></div></div>';
      });
      html += '</div>';
    }
    box.innerHTML = html;
  };
})();
