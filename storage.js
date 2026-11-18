// storage.js - localStorage helpers + demo data
var LISTINGS_KEY = "unishare_listings";
var USERS_KEY = "unishare_users";
var CURRENT_KEY = "unishare_current_user";

var categories = ["Books & Textbooks", "Electronics", "Study Materials", "Project Materials", "Laboratory Equipment", "Stationery", "Other Academic Items"];

// Demo account (frontend-only, NOT secure)
var demoUsers = [
  { fullName: "Demo Student", university: "Example University", department: "Computer Science", email: "demo@example.edu", password: "demo123" }
];

// Sample listings (all contact details are fake examples)
var demoListings = [
  { id: 1, title: "Programming Fundamentals Book", category: "Books & Textbooks", type: "Donate", description: "A useful programming textbook with clean pages. Free for a student who needs it.", condition: "Like New", price: 0, rentalRate: null, rentalUnit: "", minDuration: "", deposit: 0, image: "📘", university: "Example University", department: "Computer Science", listerName: "Demo Student", teamsId: "demo@example.edu", phone: "0123456789", email: "demo@example.edu", ownerEmail: "demo@example.edu", availability: "Available", datePosted: "2026-11-18" },
  { id: 2, title: "Scientific Calculator", category: "Electronics", type: "Sell", description: "Works perfectly. Great for engineering exams.", condition: "Used", price: 600, rentalRate: null, rentalUnit: "", minDuration: "", deposit: 0, image: "🧮", university: "Example University", department: "Electrical Engineering", listerName: "Sara Student", teamsId: "https://teams.microsoft.com/l/chat/0/0?users=sara@example.edu", phone: "", email: "sara@example.edu", ownerEmail: "sara@example.edu", availability: "Available", datePosted: "2026-11-16" },
  { id: 3, title: "Arduino Starter Kit", category: "Project Materials", type: "Rent", description: "Complete kit with board, sensors and jumper wires. Good for course projects.", condition: "Like New", price: 0, rentalRate: 80, rentalUnit: "day", minDuration: "2 days", deposit: 500, image: "🔌", university: "Example University", department: "Computer Science", listerName: "Demo Student", teamsId: "", phone: "0123456789", email: "demo@example.edu", ownerEmail: "demo@example.edu", availability: "Available", datePosted: "2026-11-15" },
  { id: 4, title: "Data Structures Lecture Notes", category: "Study Materials", type: "Donate", description: "Handwritten, well organised notes for the whole semester.", condition: "Used", price: 0, rentalRate: null, rentalUnit: "", minDuration: "", deposit: 0, image: "📝", university: "Example University", department: "Computer Science", listerName: "Rafi Student", teamsId: "rafi@example.edu", phone: "", email: "", ownerEmail: "rafi@example.edu", availability: "Available", datePosted: "2026-11-12" },
  { id: 5, title: "Lab Coat (Size M)", category: "Laboratory Equipment", type: "Rent", description: "Clean white lab coat for chemistry lab sessions.", condition: "Used", price: 0, rentalRate: 150, rentalUnit: "week", minDuration: "1 week", deposit: 0, image: "🥼", university: "Example University", department: "Chemistry", listerName: "Nila Student", teamsId: "", phone: "0111111111", email: "nila@example.edu", ownerEmail: "nila@example.edu", availability: "Available", datePosted: "2026-11-10" },
  { id: 6, title: "Notebook and Pen Set", category: "Stationery", type: "Sell", description: "Brand new notebooks (5 pcs) with a gel pen set.", condition: "New", price: 250, rentalRate: null, rentalUnit: "", minDuration: "", deposit: 0, image: "✏️", university: "Example University", department: "Business", listerName: "Demo Student", teamsId: "", phone: "", email: "demo@example.edu", ownerEmail: "demo@example.edu", availability: "Available", datePosted: "2026-11-08" }
];

function getListings() {
  var data = localStorage.getItem(LISTINGS_KEY);
  if (data === null) { saveListings(demoListings); return demoListings; }
  return JSON.parse(data);
}
function saveListings(list) { localStorage.setItem(LISTINGS_KEY, JSON.stringify(list)); }

function getUsers() {
  var data = localStorage.getItem(USERS_KEY);
  if (data === null) { saveUsers(demoUsers); return demoUsers; }
  return JSON.parse(data);
}
function saveUsers(list) { localStorage.setItem(USERS_KEY, JSON.stringify(list)); }

function getCurrentUser() {
  var data = localStorage.getItem(CURRENT_KEY);
  return data === null ? null : JSON.parse(data);
}
function setCurrentUser(user) { localStorage.setItem(CURRENT_KEY, JSON.stringify(user)); }
function logout() {
  localStorage.removeItem(CURRENT_KEY);
  window.location.href = "index.html";
}

// Unique id = highest existing id + 1
function nextId(list) {
  var max = 0;
  for (var i = 0; i < list.length; i++) { if (list[i].id > max) { max = list[i].id; } }
  return max + 1;
}
function today() { return new Date().toISOString().slice(0, 10); }
