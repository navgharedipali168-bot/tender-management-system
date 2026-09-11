BIDEXAA MEMBER 3 — LIVE SERVER PROTOTYPE
===========================================

Purpose
-------
Registration + Login module for Member 3.
This version is designed to run directly in VS Code using Live Server.
It does NOT require PHP, XAMPP or MySQL.

FILES
-----
index.html       -> Professional landing page
register.html    -> New bidder registration
login.html       -> Registered bidder login
welcome.html     -> Registration success + Bidder ID
dashboard.html   -> Logged-in bidder dashboard
assets/style.css -> Complete UI styling
assets/app.js    -> Registration/login/session logic
README_SETUP.txt -> This guide

HOW TO RUN IN VS CODE
---------------------
1. Extract this folder.
2. Open the folder in VS Code.
3. Install the "Live Server" extension if needed.
4. Right-click index.html.
5. Select "Open with Live Server".
6. Browser opens automatically.

TEST FLOW
---------
Home
  -> Create bidder account
  -> Fill registration form
  -> Registration successful
  -> Unique Bidder ID is generated
  -> Dashboard opens
  -> Logout
  -> Login using same email/password
  -> Dashboard opens again

IMPORTANT FOR MEMBER 4
----------------------
Member 4 can use the generated Bidder ID as the common identifier and
extend the dashboard/profile with:
- PAN
- GST
- UDYAM
- Personal/business information
- Document upload
- Verification status
- Admin approval

IMPORTANT TECHNICAL NOTE
------------------------
Because Live Server only serves HTML/CSS/JavaScript, this prototype stores
demo account data in browser localStorage. This is NOT suitable for real
production authentication. For final deployment, connect register/login to
PHP + MySQL (or another backend) and store passwords using secure hashing.

To reset the demo completely:
Browser DevTools -> Application -> Local Storage -> clear storage
or run in console:
localStorage.clear();

HANDOFF
-------
Give the entire BIDEXAA_Member3_LiveServer folder to Member 4.
Do not remove assets/app.js because it contains the authentication flow.
