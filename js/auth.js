/* UniShare - auth.js : demo login / register (NOT secure, browser only) */
(function () {
  var USERS_KEY = "unishare_users";
  var DEMO = { name: "Demo Student", university: "Demo University", dept: "CSE",
               email: "demo@example.edu", password: "demo123" };

  function getUsers() {
    var users = UniShareApp.read(USERS_KEY, []);
    if (!users.some(function (u) { return u.email === DEMO.email; })) {
      users.unshift(DEMO);
      UniShareApp.write(USERS_KEY, users);
    }
    return users;
  }
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  window.registerUser = function () {
    var name = val("regName"), uni = val("regUni"), dept = val("regDept"),
        email = val("regEmail").toLowerCase(), pass = document.getElementById("regPass").value;
    if (!name || !uni || !dept || !email || !pass) return UniShareApp.showMessage("regMsg", "Please fill in all fields.", false);
    if (!validEmail(email)) return UniShareApp.showMessage("regMsg", "Enter a valid email address.", false);
    if (pass.length < 6) return UniShareApp.showMessage("regMsg", "Password must be at least 6 characters.", false);
    var users = getUsers();
    if (users.some(function (u) { return u.email === email; }))
      return UniShareApp.showMessage("regMsg", "This email is already registered. Please login.", false);
    users.push({ name: name, university: uni, dept: dept, email: email, password: pass });
    UniShareApp.write(USERS_KEY, users);
    UniShareApp.showMessage("regMsg", "Registration successful! Redirecting to login...", true);
    setTimeout(function () { window.location.href = "login.html"; }, 1200);
  };

  window.loginUser = function () {
    var email = val("loginEmail").toLowerCase(), pass = document.getElementById("loginPass").value;
    if (!email || !pass) return UniShareApp.showMessage("loginMsg", "Enter your email and password.", false);
    var user = getUsers().filter(function (u) { return u.email === email && u.password === pass; })[0];
    if (!user) return UniShareApp.showMessage("loginMsg", "Wrong email or password.", false);
    UniShareApp.setCurrentUser({ name: user.name, university: user.university, dept: user.dept, email: user.email });
    UniShareApp.showMessage("loginMsg", "Login successful! Redirecting...", true);
    setTimeout(function () { window.location.href = "dashboard.html"; }, 800);
  };

  // Press Enter to submit
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    if (document.getElementById("loginPass") && document.activeElement.id.indexOf("login") === 0) window.loginUser();
    if (document.getElementById("regPass") && document.activeElement.id.indexOf("reg") === 0) window.registerUser();
  });
})();
