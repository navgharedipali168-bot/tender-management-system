import React, { useEffect, useState, useCallback } from "react";
import { uploadBidderDocument, listBidderDocuments } from "../api";

// Backend (app.py) currently only accepts these 3 canonical types and
// only PDF files -- see upload_bidder_document(). Keeping this checklist
// in sync with that so uploads actually succeed.
const REQUIRED_DOCUMENTS = [
  { type: "GST Certificate", label: "GST Certificate", hint: "GST registration certificate (PDF)" },
  { type: "PAN Certificate", label: "PAN Certificate", hint: "PAN card / certificate (PDF)" },
  { type: "Udyam/MSME Certificate", label: "Udyam / MSME Certificate", hint: "Udyam registration certificate (PDF)" },
];

const MAX_FILE_SIZE_MB = 5;

function validateFile(file) {
  if (!file) return "No file selected";
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return "Only PDF files are accepted.";
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`;
  }
  return null;
}

function DropZone({ docType, label, hint, uploadedDoc, onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(
    async (fileList) => {
      const file = fileList?.[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError("");
      setUploading(true);
      const { ok, data } = await uploadBidderDocument(
        onUpload.bidderId,
        file,
        docType
      );
      setUploading(false);
      if (!ok) {
        setError(data.error || "Upload failed");
        return;
      }
      onUpload.onSuccess();
    },
    [docType, onUpload]
  );

  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{label}</h3>
          <p className="text-xs text-gray-400">{hint}</p>
        </div>
        {uploadedDoc ? (
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
            Uploaded
          </span>
        ) : (
          <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-full whitespace-nowrap">
            Pending
          </span>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-md p-4 text-center transition-colors ${
          dragActive ? "border-gemblue bg-blue-50" : "border-gray-300"
        }`}
      >
        <p className="text-sm text-gray-500 mb-2">
          Drag &amp; drop the PDF here, or
        </p>
        <label className="inline-block cursor-pointer bg-gemblue text-white text-xs font-semibold px-3 py-2 rounded-md hover:bg-blue-900">
          {uploading ? "Uploading..." : uploadedDoc ? "Replace file" : "Choose file"}
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
        <p className="text-xs text-gray-400 mt-2">PDF only, max {MAX_FILE_SIZE_MB}MB</p>
      </div>

      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

      {uploadedDoc && (
        <p className="text-xs text-gray-400 mt-2">
          Last uploaded: {new Date(uploadedDoc.uploaded_at).toLocaleString("en-IN")}
        </p>
      )}
    </div>
  );
}

export default function TenderDocumentUpload() {
  const [bidderId, setBidderId] = useState("");
  const [activeBidderId, setActiveBidderId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function refreshDocuments(id) {
    setLoading(true);
    try {
      const docs = await listBidderDocuments(id);
      setDocuments(Array.isArray(docs) ? docs : []);
    } catch {
      setError("Could not load this bidder's uploaded documents.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (activeBidderId) refreshDocuments(activeBidderId);
  }, [activeBidderId]);

  function handleLoadBidder(e) {
    e.preventDefault();
    setError("");
    if (!bidderId) return;
    setActiveBidderId(bidderId);
  }

  function latestDocFor(docType) {
    return documents.find((d) => d.document_type === docType);
  }

  const uploadedCount = REQUIRED_DOCUMENTS.filter((d) => latestDocFor(d.type)).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gemblue mb-1">Tender Document Upload</h1>
      <p className="text-gray-500 text-sm mb-6">
        Upload the required compliance documents for a bidder against this tender.
      </p>

      <form
        onSubmit={handleLoadBidder}
        className="bg-white rounded-lg shadow border border-gray-200 p-5 mb-6 flex gap-2 items-end"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bidder ID</label>
          <input
            value={bidderId}
            onChange={(e) => setBidderId(e.target.value)}
            placeholder="e.g. 1"
            className="border border-gray-300 rounded-md px-3 py-2 w-40"
          />
        </div>
        <button
          type="submit"
          className="bg-gemblue text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-900"
        >
          Load Checklist
        </button>
        {activeBidderId && (
          <span className="text-sm text-gray-500 ml-2">
            {uploadedCount}/{REQUIRED_DOCUMENTS.length} documents uploaded
          </span>
        )}
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {loading && <p className="text-gray-400 text-sm mb-4">Loading...</p>}

      {activeBidderId && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REQUIRED_DOCUMENTS.map((doc) => (
            <DropZone
              key={doc.type}
              docType={doc.type}
              label={doc.label}
              hint={doc.hint}
              uploadedDoc={latestDocFor(doc.type)}
              onUpload={{
                bidderId: activeBidderId,
                onSuccess: () => refreshDocuments(activeBidderId),
              }}
            />
          ))}
        </div>
      )}

      {!activeBidderId && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center text-gray-500">
          Enter a Bidder ID above and click "Load Checklist" to start uploading
          documents for that bidder.
        </div>
      )}
    </div>
  );
}
