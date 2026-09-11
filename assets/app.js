const DB_KEY="bidexaa_member3_users_v1";const SESSION_KEY="bidexaa_member3_session_v1";
function getUsers(){try{return JSON.parse(localStorage.getItem(DB_KEY)||"[]")}catch(e){return[]}}
function saveUsers(u){localStorage.setItem(DB_KEY,JSON.stringify(u))}
function makeBidderId(){const d=new Date();const y=d.getFullYear();const r=Math.floor(100000+Math.random()*900000);return `BID-${y}-${r}`}
function showMessage(id,text,type="error"){const el=document.getElementById(id);if(!el)return;el.textContent=text;el.className="message "+type}
function validEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}
function registerBidder(e){e.preventDefault();const name=document.getElementById("fullName").value.trim();const mobile=document.getElementById("mobile").value.trim();const email=document.getElementById("email").value.trim().toLowerCase();const pass=document.getElementById("password").value;const confirm=document.getElementById("confirmPassword").value;const terms=document.getElementById("terms").checked;
if(name.length<3)return showMessage("registerMsg","Please enter a valid full name.");
if(!/^[6-9]\d{9}$/.test(mobile))return showMessage("registerMsg","Please enter a valid 10-digit Indian mobile number.");
if(!validEmail(email))return showMessage("registerMsg","Please enter a valid email address.");
if(pass.length<8)return showMessage("registerMsg","Password must contain at least 8 characters.");
if(!/[A-Za-z]/.test(pass)||!/\d/.test(pass))return showMessage("registerMsg","Password must contain at least one letter and one number.");
if(pass!==confirm)return showMessage("registerMsg","Passwords do not match.");
if(!terms)return showMessage("registerMsg","Please accept the registration terms.");
const users=getUsers();if(users.some(u=>u.email===email))return showMessage("registerMsg","An account with this email already exists. Please login.","info");
const user={bidderId:makeBidderId(),name,email,mobile,password:pass,registeredAt:new Date().toISOString(),profileStatus:"Pending verification"};users.push(user);saveUsers(users);localStorage.setItem(SESSION_KEY,user.bidderId);location.href="welcome.html"}
function loginBidder(e){e.preventDefault();const email=document.getElementById("loginEmail").value.trim().toLowerCase();const pass=document.getElementById("loginPassword").value;const user=getUsers().find(u=>u.email===email);
if(!user)return showMessage("loginMsg","No bidder account found with this email. Please register first.");
if(user.password!==pass)return showMessage("loginMsg","Incorrect password. Please try again.");
localStorage.setItem(SESSION_KEY,user.bidderId);location.href="dashboard.html"}
function getCurrentUser(){const id=localStorage.getItem(SESSION_KEY);return getUsers().find(u=>u.bidderId===id)||null}
function protectPage(){if(!getCurrentUser())location.href="login.html"}
function loadDashboard(){const u=getCurrentUser();if(!u)return;document.getElementById("welcomeName").textContent="Welcome, "+u.name.split(" ")[0];document.getElementById("bidderId").textContent=u.bidderId;document.getElementById("dName").textContent=u.name;document.getElementById("dEmail").textContent=u.email;document.getElementById("dMobile").textContent=u.mobile;document.getElementById("dDate").textContent=new Date(u.registeredAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
function logoutBidder(){localStorage.removeItem(SESSION_KEY);location.href="login.html"}