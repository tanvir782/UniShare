// dashboard.js - student dashboard: stats + manage my listings
var editingId = null;   // id of the listing being edited (null = none)

function showDashboard() {
  var user = getCurrentUser();
  var box = document.getElementById("dashboardBox");
  if (user === null) {
    box.innerHTML = '<p class="msg error">Please <a href="login.html">login</a> to see your dashboard.</p>';
    return;
  }
  var all = getListings();
  var mine = [], donated = 0, rented = 0, selling = 0;
  for (var i = 0; i < all.length; i++) {
    if (all[i].ownerEmail === user.email) {
      mine.push(all[i]);
      if (all[i].type === "Donate") { donated++; }
      if (all[i].type === "Rent") { rented++; }
      if (all[i].type === "Sell") { selling++; }
    }
  }
  var rows = "";
  for (var j = 0; j < mine.length; j++) { rows += listingRow(mine[j]); }
  if (rows === "") { rows = '<p class="muted">You have no listings yet. <a href="add-item.html">Add your first item</a>.</p>'; }

  box.innerHTML =
    '<div class="profile"><h3>' + esc(user.fullName) + '</h3><p class="muted">' + esc(user.department) + ' • ' + esc(user.university) + ' • ' + esc(user.email) + '</p></div>' +
    '<div class="stats"><div class="stat"><b>' + mine.length + '</b>Total listings</div><div class="stat"><b>' + donated + '</b>Donated items</div>' +
    '<div class="stat"><b>' + rented + '</b>Rental listings</div><div class="stat"><b>' + selling + '</b>Items for sale</div></div>' +
    '<h2 class="section-title">My <span>Listings</span></h2>' + rows;
}

// One row in "My Listings" (normal view or edit view)
function listingRow(it) {
  if (it.id === editingId) {
    var priceField = "";
    if (it.type === "Sell") { priceField = '<label>Price (৳)</label><input type="number" id="editPrice" value="' + it.price + '">'; }
    if (it.type === "Rent") { priceField = '<label>Rental rate (৳ per ' + it.rentalUnit + ')</label><input type="number" id="editPrice" value="' + it.rentalRate + '">'; }
    return '<div class="listing-row edit"><label>Title</label><input type="text" id="editTitle" value="' + esc(it.title) + '">' +
      '<label>Description</label><textarea id="editDesc">' + esc(it.description) + '</textarea>' +
      '<label>Condition</label><select id="editCond">' + condOptions(it.condition) + '</select>' + priceField +
      '<div class="btn-row"><button class="btn btn-small" onclick="saveEdit(' + it.id + ')">Save</button>' +
      '<button class="btn btn-small btn-dark" onclick="cancelEdit()">Cancel</button></div><p class="msg" id="editMsg"></p></div>';
  }
  var quick = "";
  if (it.type === "Sell" && it.availability !== "Sold") { quick = '<button class="btn btn-small" onclick="markSold(' + it.id + ')">Mark as Sold</button>'; }
  if (it.type === "Rent" && it.availability === "Available") { quick = '<button class="btn btn-small" onclick="markUnavailable(' + it.id + ')">Mark Unavailable</button>'; }

  var select = '<select onchange="setAvailability(' + it.id + ', this.value)">';
  var states = ["Available", "Unavailable", "Sold"];
  for (var s = 0; s < states.length; s++) {
    select += '<option' + (states[s] === it.availability ? ' selected' : '') + '>' + states[s] + '</option>';
  }
  select += '</select>';

  return '<div class="listing-row"><div><h3>' + esc(it.title) + '</h3><p class="muted small">' + typeBadge(it.type) + ' ' + priceText(it) + ' • Posted ' + it.datePosted + '</p></div>' +
    '<div class="row-actions">' + select + quick +
    '<button class="btn btn-small btn-outline" onclick="startEdit(' + it.id + ')">Edit</button>' +
    '<button class="btn btn-small btn-dark" onclick="deleteListing(' + it.id + ')">Delete</button></div></div>';
}

function condOptions(selected) {
  var list = ["New", "Like New", "Used"], html = "";
  for (var i = 0; i < list.length; i++) { html += '<option' + (list[i] === selected ? ' selected' : '') + '>' + list[i] + '</option>'; }
  return html;
}

function setAvailability(id, value) {
  var all = getListings();
  for (var i = 0; i < all.length; i++) { if (all[i].id === id) { all[i].availability = value; } }
  saveListings(all);
  showDashboard();
}
function markSold(id) { setAvailability(id, "Sold"); }
function markUnavailable(id) { setAvailability(id, "Unavailable"); }

function deleteListing(id) {
  if (!confirm("Delete this listing?")) { return; }
  var all = getListings(), keep = [];
  for (var i = 0; i < all.length; i++) { if (all[i].id !== id) { keep.push(all[i]); } }
  saveListings(keep);
  showDashboard();
}

function startEdit(id) { editingId = id; showDashboard(); }
function cancelEdit() { editingId = null; showDashboard(); }

function saveEdit(id) {
  var title = val("editTitle"), desc = val("editDesc"), cond = val("editCond");
  var priceBox = document.getElementById("editPrice");
  var price = priceBox ? Number(priceBox.value) : 0;
  if (title === "" || desc === "") { showMsg("editMsg", "Error: title and description cannot be empty.", "error"); return; }
  if (priceBox && (isNaN(price) || price <= 0)) { showMsg("editMsg", "Error: price must be greater than 0.", "error"); return; }

  var all = getListings();
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) {
      all[i].title = title; all[i].description = desc; all[i].condition = cond;
      if (all[i].type === "Sell") { all[i].price = price; }
      if (all[i].type === "Rent") { all[i].rentalRate = price; }
    }
  }
  saveListings(all);
  editingId = null;
  showDashboard();
}
