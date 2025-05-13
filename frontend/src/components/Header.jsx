import { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faFilePdf } from '@fortawesome/free-solid-svg-icons';

export function Header() {
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    setLoading(true);
    setError('');

    try {
      await axios.post('https://querypdf.onrender.com/upload_pdf/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedFileName(acceptedFiles[0].name);
      alert('✅ File uploaded and processed successfully');
    } catch (err) {
      setError('❌ Failed to upload file');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <header className="fixed w-full bg-white shadow-md px-6 py-3 z-50 flex items-center justify-between border-b border-gray-200">
      {/* Logo & Title */}
      <div className="flex items-center space-x-3">
        <img src="./icon.svg" alt="App Icon" className="h-8 w-8" />
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          Query ChatBot
        </h1>
      </div>

      {/* Upload PDF Section */}
      <div {...getRootProps()} className="flex items-center space-x-3 cursor-pointer">
        <input {...getInputProps()} aria-label="Upload PDF" className="hidden" />

        {uploadedFileName && (
          <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm truncate max-w-[200px]">
            <FontAwesomeIcon icon={faFilePdf} className="mr-2 text-green-600" />
            <span className="truncate">{uploadedFileName}</span>
          </div>
        )}

        <Button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition rounded-md">
          {loading ? (
            <>
               <FontAwesomeIcon icon={faFileUpload} />
              Processing...
            </>
          ) : (
            <>
              Upload PDF
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="absolute top-full right-6 mt-2 text-red-600 text-sm">
          {error}
        </div>
      )}
    </header>
  );
}
