// Only the API calls this module needs. When the team integrates,
// these functions should be merged into the main project's src/api.js
// (they already exist there under the same names) instead of keeping
// a separate copy.

export const API_BASE = "http://localhost:5000/api";

async function readJson(res) {
  const data = await res.json();
  return { ok: res.ok, data };
}

// Phase 1 compatible: documentType defaults to GST Certificate.
export async function uploadBidderDocument(bidderId, file, documentType = "GST Certificate") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("document_type", documentType);

  const res = await fetch(`${API_BASE}/bidders/${bidderId}/documents`, {
    method: "POST",
    body: formData,
  });
  return readJson(res);
}

export async function listBidderDocuments(bidderId) {
  const res = await fetch(`${API_BASE}/bidders/${bidderId}/documents`);
  return res.json();
}
