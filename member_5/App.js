import React from "react";
import TenderDocumentUpload from "./pages/TenderDocumentUpload";

// Standalone entry point for Member 5's module.
// When the team integrates, TenderDocumentUpload.jsx and api.js just
// get dropped into the main project's src/pages and src/ folders --
// this App.js is only here so this module can run on its own.
export default function App() {
  return <TenderDocumentUpload />;
}
