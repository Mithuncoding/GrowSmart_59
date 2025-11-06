import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.tsx';


interface ImageUploaderProps {
  onImageUpload: (base64: string, file: File) => void;
  idSuffix?: string; // To make input id unique if multiple uploaders are on one page
  enableCamera?: boolean;
  enablePaste?: boolean;
}//hi

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, idSuffix = "", enableCamera = false, enablePaste = false }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLLabelElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { translate } = useLanguage();
  const errorId = `uploader-error-${idSuffix}`;
  const uploaderRef = useRef<HTMLDivElement>(null);

  // Attempt to focus the dropzone on mount to help with paste UX
  useEffect(() => {
    // Only focus if no other interactive element is already focused to avoid stealing focus
    // This is a mild attempt, could be more sophisticated if needed.
    if (document.activeElement === document.body || document.activeElement === null) {
        dropzoneRef.current?.focus();
    }
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(translate('errorImageFile', { default: 'Please select an image file (e.g., JPG, PNG, GIF).' }));
      setPreviewUrl(null);
      return false;
    }
    if (file.size > 30 * 1024 * 1024) { // Limit file size (e.g., 30MB)
       setError(translate('errorFileSize', { default: 'File size exceeds 30MB. Please choose a smaller image.'}));
       setPreviewUrl(null);
       return false;
    }
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      onImageUpload(base64String, file);
    };
    reader.readAsDataURL(file);
    return true;
  }

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [onImageUpload, translate]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dropzoneRef.current?.classList.add('border-green-500', 'bg-green-50'); 
  }, []);
  
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dropzoneRef.current?.classList.remove('border-green-500', 'bg-green-50');
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dropzoneRef.current?.classList.remove('border-green-500', 'bg-green-50');
    const file = event.dataTransfer.files?.[0];
     if (file) {
      processFile(file);
    }
  }, [onImageUpload, translate]);

  const handlePaste = useCallback(async (event: Event) => {
    const clipboardEvent = event as ClipboardEvent;
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      if (dropzoneRef.current && dropzoneRef.current.contains(activeElement)) {
        // Potentially an input inside the uploader, but not the dropzone itself. Let it be.
      } else {
        return;
      }
    }
    const items = clipboardEvent.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          if(processFile(file)) {
            clipboardEvent.preventDefault();
            return;
          }
        }
      }
    }
  }, [onImageUpload, translate]);

  useEffect(() => {
    if (enablePaste) {
      document.addEventListener('paste', handlePaste);
      return () => {
        document.removeEventListener('paste', handlePaste);
      };
    }
  }, [handlePaste, enablePaste]);

  // Camera capture handler
  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const clearPreview = () => {
    setPreviewUrl(null);
    setError(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
     // Re-focus after clearing for easy paste or keyboard navigation
    if (document.activeElement === document.body || document.activeElement === null || dropzoneRef.current?.contains(document.activeElement)) {
        dropzoneRef.current?.focus();
    }
  }

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (document.activeElement !== uploaderRef.current) return;
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
              processFile(file);
              e.preventDefault();
              break;
            }
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [processFile]);

  return (
    <div className="w-full" ref={uploaderRef} tabIndex={0}>
      <label
        htmlFor={`file-upload-${idSuffix}`}
        ref={dropzoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0} 
        className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-green-300 border-dashed rounded-md cursor-pointer hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:border-green-600 transition-colors"
        aria-label={translate('imageUploadArea', { default: 'Image upload area: Click to upload, drag and drop, or paste an image' })}
        aria-describedby={error ? errorId : undefined}
      >
        <div className="space-y-1 text-center">
          {previewUrl ? (
            <img src={previewUrl} alt={translate('imagePreviewAlt', { default: "Preview" })} className="mx-auto h-40 sm:h-48 w-auto object-contain rounded-md" />
          ) : (
            <svg
              className="mx-auto h-12 w-12 text-green-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <div className="flex flex-col sm:flex-row text-sm text-gray-600 items-center justify-center">
            <span
              className="relative rounded-md bg-white font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
              onClick={(e) => { e.preventDefault(); triggerFileInput(); }} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); triggerFileInput();}}} // keyboard accessible
              role="button" // Semantics for accessibility
              tabIndex={0} // Make it focusable
            >
              {translate('uploadFile')}
            </span>
            <input id={`file-upload-${idSuffix}`} name={`file-upload-${idSuffix}`} type="file" className="sr-only" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
            <p className="pl-1 hidden sm:inline">{translate('dragAndDrop')}</p>
            {enableCamera && (
              <>
                <span
                  className="ml-2 relative rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 cursor-pointer"
                  onClick={(e) => { e.preventDefault(); cameraInputRef.current?.click(); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cameraInputRef.current?.click();}}}
                  role="button"
                  tabIndex={0}
                >
                  📷 Use Camera
                </span>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={handleCameraCapture}
                />
              </>
            )}
          </div>
           <p className="text-xs text-gray-500">{translate('pasteFromClipboard')}</p>
          <p className="text-xs text-gray-500">{translate('fileTypes')}</p>
        </div>
      </label>
      {error && <p id={errorId} className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
      {previewUrl && (
         <button
          type="button"
          onClick={clearPreview}
          className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
        >
          {translate('clearImage')}
        </button>
      )}
      <div className="text-xs text-gray-400 mt-2">Tip: You can also paste an image here (Ctrl+V)</div>
    </div>
  );
};

export default ImageUploader;
