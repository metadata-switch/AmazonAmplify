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
<div className="container mt-4" style={{ maxWidth: 720 }}>
<div className="card shadow-sm">
<div className="card-body">
<h3 className="card-title mb-4">Upload file (private)</h3>
<div className="mb-3">
<label className="form-label">Select File</label>
<input
              type="file"
              className="form-control"
              onChange={(e) => {
                const chosen = e?.target?.files?.[0] ?? null;
                setFile(chosen);
                setStatus(chosen ? `Selected: ${chosen.name}` : "");
                setLastError(null);
              }}
            />
</div>
 
          <div className="d-grid">
<button 
              className="btn btn-primary" 
              onClick={uploadFile} 
              disabled={!file || uploading}
>
              {uploading ? "Uploading…" : "Upload"}
</button>
</div>
 
          {status && (
<div className="alert alert-info mt-3 mb-0" role="alert">
<strong>Status:</strong> <span>{status}</span>
</div>
          )}
 
          {lastError && (
<div className="alert alert-danger mt-3 mb-0" role="alert">
<strong>Error details:</strong>
<pre className="mt-2 mb-0" style={{ whiteSpace: "pre-wrap" }}>
                {String(lastError && (lastError.message ?? JSON.stringify(lastError)))}
</pre>
<small className="d-block mt-2">Check browser console for full error object.</small>
</div>
          )}
</div>
</div>
</div>
  );
}