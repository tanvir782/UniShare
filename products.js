// products.js - listing cards, home page, explore page, item details

// ---------- small helpers ----------
function typeBadge(type) { return '<span class="badge badge-' + type.toLowerCase() + '">' + type + '</span>'; }

function priceText(item) {
  if (item.type === "Donate") { return "Free"; }
  if (item.type === "Rent") { return "৳" + item.rentalRate + " / " + item.rentalUnit; }
  return "৳" + item.price;
}
function sortPrice(item) {
  if (item.type === "Donate") { return 0; }
  if (item.type === "Rent") { return item.rentalRate; }
  return item.price;
}
// Uploaded photo = real <img>; demo items use an emoji
function imageHTML(item) {
  if (item.image.indexOf("data:") === 0) { return '<img src="' + item.image + '" alt="' + esc(item.title) + '">'; }
  return '<div class="emoji-img">' + item.image + '</div>';
}
function newestFirst(a, b) {
  if (a.datePosted === b.datePosted) { return b.id - a.id; }
  return a.datePosted < b.datePosted ? 1 : -1;
}

// One product card
function cardHTML(item) {
  return '<div class="card"><div class="card-img">' + imageHTML(item) + '</div><div class="card-body">' +
    typeBadge(item.type) + '<span class="status ' + item.availability.toLowerCase() + '">' + item.availability + '</span>' +
    '<h3>' + esc(item.title) + '</h3>' +
    '<p class="muted small">' + esc(item.category) + ' • ' + item.condition + '</p>' +
    '<p class="price">' + priceText(item) + '</p>' +
    '<p class="muted small">' + esc(item.university) + '</p>' +
    '<a class="btn btn-small" href="item-details.html?id=' + item.id + '">View Details</a></div></div>';
}

// ---------- HOME PAGE ----------
function showHome() {
  var tiles = "";
  for (var i = 0; i < categories.length; i++) {
    tiles += '<a class="cat-tile" href="explore.html?cat=' + encodeURIComponent(categories[i]) + '">' + categories[i] + '</a>';
  }
  document.getElementById("categoryGrid").innerHTML = tiles;

  var list = getListings();
  list.sort(newestFirst);
  var html = "";
  for (var j = 0; j < list.length && j < 4; j++) { html += cardHTML(list[j]); }
  document.getElementById("recentGrid").innerHTML = html;
}
function searchFromHome() {
  window.location.href = "explore.html?q=" + encodeURIComponent(val("heroSearch"));
}

// ---------- EXPLORE PAGE ----------
function setupExplore() {
  var options = '<option value="">All Categories</option>';
  for (var i = 0; i < categories.length; i++) { options += '<option>' + categories[i] + '</option>'; }
  document.getElementById("categoryFilter").innerHTML = options;

  // Read ?q=...&type=...&cat=... from the page address (used by nav links and the home page)
  var params = new URLSearchParams(window.location.search);
  document.getElementById("searchBox").value = params.get("q") || "";
  document.getElementById("categoryFilter").value = params.get("cat") || "";
  document.getElementById("typeFilter").value = params.get("type") || "";
  showExplore();
}

function showExplore() {
  var q = val("searchBox").toLowerCase();
  var cat = val("categoryFilter");
  var type = val("typeFilter");
  var cond = val("conditionFilter");
  var sort = val("sortBy");
  var all = getListings();
  var result = [];

  for (var i = 0; i < all.length; i++) {
    var it = all[i];
    if (q !== "" && it.title.toLowerCase().indexOf(q) === -1) { continue; }
    if (cat !== "" && it.category !== cat) { continue; }
    if (type !== "" && it.type !== type) { continue; }
    if (cond !== "" && it.condition !== cond) { continue; }
    result.push(it);
  }

  if (sort === "low") { result.sort(function (a, b) { return sortPrice(a) - sortPrice(b); }); }
  else if (sort === "high") { result.sort(function (a, b) { return sortPrice(b) - sortPrice(a); }); }
  else { result.sort(newestFirst); }

  var html = "";
  for (var j = 0; j < result.length; j++) { html += cardHTML(result[j]); }
  if (html === "") { html = '<p class="muted">No items found. Try different filters.</p>'; }
  document.getElementById("resultCount").innerHTML = result.length + " item(s) found";
  document.getElementById("exploreGrid").innerHTML = html;
}

// ---------- ITEM DETAILS PAGE ----------
function showDetails() {
  var id = Number(new URLSearchParams(window.location.search).get("id"));
  var list = getListings();
  var item = null;
  for (var i = 0; i < list.length; i++) { if (list[i].id === id) { item = list[i]; } }

  var box = document.getElementById("detailsBox");
  if (item === null) {
    box.innerHTML = '<p class="msg error">Item not found. <a href="explore.html">Back to Explore</a></p>';
    return;
  }
  document.title = "UniShare - " + item.title;

  // table of details
  var rows = [["Category", item.category], ["Listing type", item.type], ["Condition", item.condition], ["Price", priceText(item)],
    ["Availability", item.availability], ["University", item.university], ["Department", item.department],
    ["Listed by", item.listerName], ["Date posted", item.datePosted]];
  if (item.type === "Rent") {
    rows.push(["Minimum rental", item.minDuration || "Not specified"]);
    rows.push(["Security deposit", item.deposit > 0 ? "৳" + item.deposit : "None"]);
  }
  var table = "";
  for (var r = 0; r < rows.length; r++) { table += '<tr><td>' + rows[r][0] + '</td><td>' + esc(rows[r][1]) + '</td></tr>'; }

  // contact section - only shows what the lister really provided
  var contact = "";
  if (item.teamsId !== "") {
    if (item.teamsId.indexOf("http") === 0) {
      contact += '<div class="contact-row"><span>Microsoft Teams</span><a class="btn btn-small" target="_blank" href="' + esc(item.teamsId) + '">Contact on Microsoft Teams</a></div>';
    } else {
      contact += '<div class="contact-row"><span>Microsoft Teams ID: <b>' + esc(item.teamsId) + '</b></span><span class="muted small">Search this ID in Microsoft Teams</span></div>';
    }
  }
  if (item.phone !== "") {
    contact += '<div class="contact-row"><span>Phone: <b>' + esc(item.phone) + '</b></span><a class="btn btn-small" href="tel:' + esc(item.phone) + '">Call Now</a></div>';
  }
  if (item.email !== "") {
    contact += '<div class="contact-row"><span>Email: <b>' + esc(item.email) + '</b></span><a class="btn btn-small" href="mailto:' + esc(item.email) + '">Send Email</a></div>';
  }
  if (contact === "") { contact = '<p class="muted">The lister has not added contact details.</p>'; }

  box.innerHTML =
    '<div class="details"><div class="big-img">' + imageHTML(item) + '</div><div>' +
    '<h1>' + esc(item.title) + '</h1>' + typeBadge(item.type) +
    '<table class="info">' + table + '</table></div></div>' +
    '<h3>Description</h3><p class="muted">' + esc(item.description) + '</p>' +
    '<div class="contact-box"><h3>Contact the Lister</h3>' + contact +
    '<p class="note">Please verify item condition and agree on a safe exchange location before completing a transaction.</p></div>';
}
