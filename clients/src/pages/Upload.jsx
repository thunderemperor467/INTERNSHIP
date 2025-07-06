// clients/src/pages/Upload.jsx
import React, { useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import api from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      // ✅ Corrected field name to match multer config
      formData.append("excelFile", file);

      await api.post("/upload/uploadExcel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Upload successful! Redirecting to Dashboard...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4 py-10">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow p-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Upload Your Excel File
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Only .xlsx, .xls, or .csv files supported. Max size: 5MB.
        </p>

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <UploadCloud className="w-12 h-12 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">Drag & drop or click to select</p>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {file && (
          <p className="mt-4 text-center text-gray-700 dark:text-gray-200">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
            </>
          ) : (
            "Upload"
          )}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
