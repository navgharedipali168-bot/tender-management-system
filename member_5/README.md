# Member 5 — Tender Document Upload

This is a standalone, self-contained module for the "Tender Document Upload"
task (bidder-wise document checklist, drag-and-drop, PDF/size validation).
It runs on its own so you can build and demo it without waiting on the rest
of the team's project to be wired together.

## What it does

- Loads a document checklist for a given Bidder ID: GST Certificate, PAN
  Certificate, Udyam/MSME Certificate.
- Drag-and-drop or "Choose file" per document.
- Client-side validation: PDF only, max 5MB.
- Uploads to the backend (`POST /api/bidders/<id>/documents`) and shows
  upload status per document.

## Running it standalone

You need Node.js installed. Then:

```
npm install
npm start
```

This opens `http://localhost:3000` (or another port if 3000 is busy) showing
just this module.

**Note:** the upload buttons call a backend at `http://localhost:5000/api`.
That's Member 6's Flask backend. For uploads to actually succeed (not just
show the UI), Member 6's backend needs to be running locally with a bidder
already created in the database — ask them to share their `backend/`
folder and `database/schema.sql` + `dummy_data.sql` if you want to test
end-to-end before the team merges everything.

## Integrating into the main project later

When the team combines everyone's folders into one project:

1. Copy `src/pages/TenderDocumentUpload.jsx` into the main project's
   `frontend/src/pages/` folder.
2. The main project's `src/api.js` should already have
   `uploadBidderDocument` and `listBidderDocuments` (Member 6 adds these
   as part of the shared API file) — you don't need to copy `src/api.js`
   from here, just make sure those two functions exist there.
3. In the main project's `App.js`, add:
   ```javascript
   import TenderDocumentUpload from "./pages/TenderDocumentUpload";
   ```
   and a route:
   ```javascript
   <Route
     path="/tender-document-upload"
     element={
       <PrivateRoute user={user}>
         <TenderDocumentUpload />
       </PrivateRoute>
     }
   />
   ```
4. Optionally add a nav link to it in the shared Navbar.

Everything else in this folder (`package.json`, `public/`, `src/App.js`,
`src/index.js`) was only needed to run this module standalone — it's not
meant to be merged into the main project.
