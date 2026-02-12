import React, { useState } from "react";
import { uploadData, getUrl } from "aws-amplify/storage";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [lastError, setLastError] = useState(null);

  const uploadFile = async () => {
    if (!file) {
      alert("Select a file");
      return;
    }

    
    setLastError(null);
    setUploading(true);
    setStatus("Preparing upload...");

    const filename = `${Date.now()}_${file.name}`;

    try {
      const result = await uploadData({
        path: ({ identityId }) => `private/${identityId}/${filename}`,
        data: file,
        options: {
          contentType: file.type,
          onProgress: (progress) => {
            const percentage = Math.round((progress.loaded / progress.total) * 100);
            setStatus(`Uploading — ${percentage}%`);
          }
        },
      }).result;

      setStatus("Upload finished — verifying...");

      try {
        await getUrl({ 
          path: ({ identityId }) => `private/${identityId}/${filename}`
        });
        setStatus("Upload verified — upload successful.");
      } catch (verifyErr) {
        console.error("Verification failed (getUrl):", verifyErr);
        throw verifyErr;
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setLastError(err);
      setStatus(`Upload failed: ${err?.message ?? JSON.stringify(err)}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <h3>Upload file (private)</h3>
      <input
        type="file"
        onChange={(e) => {
          const chosen = e?.target?.files?.[0] ?? null;
          setFile(chosen);
          setStatus(chosen ? `Selected: ${chosen.name}` : "");
          setLastError(null);
        }}
      />
      <div style={{ marginTop: 8 }}>
        <button onClick={uploadFile} disabled={!file || uploading}>
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>
      <div style={{ marginTop: 12 }}>
        <strong>Status:</strong> <span>{status}</span>
      </div>
      {lastError && (
        <div style={{ marginTop: 12, color: "crimson" }}>
          <strong>Error details:</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {String(lastError && (lastError.message ?? JSON.stringify(lastError)))}
          </pre>
          <small>Check browser console for full error object.</small>
        </div>
      )}
    </div>
  );
}