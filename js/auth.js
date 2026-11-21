// auth.js - demo login / register (frontend only, NOT secure)
function registerUser() {
  var name = val("regName"), uni = val("regUni"), dept = val("regDept"), email = val("regEmail"), pass = document.getElementById("regPass").value;

  if (name === "" || uni === "" || dept === "" || email === "" || pass === "") { showMsg("regMsg", "Error: all fields are required.", "error"); return; }
  if (email.indexOf("@") === -1) { showMsg("regMsg", "Error: email must contain @.", "error"); return; }
  if (pass.length < 6) { showMsg("regMsg", "Error: password must be at least 6 characters.", "error"); return; }

  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) { showMsg("regMsg", "Error: this email is already registered.", "error"); return; }
  }
  users.push({ fullName: name, university: uni, department: dept, email: email, password: pass });
  saveUsers(users);
  setCurrentUser({ fullName: name, university: uni, department: dept, email: email });
  window.location.href = "dashboard.html";
}

function loginUser() {
  var email = val("loginEmail"), pass = document.getElementById("loginPass").value;
  if (email === "" || pass === "") { showMsg("loginMsg", "Error: enter email and password.", "error"); return; }

  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === pass) {
      setCurrentUser({ fullName: users[i].fullName, university: users[i].university, department: users[i].department, email: users[i].email });
      window.location.href = "dashboard.html";
      return;
    }
  }
  showMsg("loginMsg", "Error: wrong email or password.", "error");
}
