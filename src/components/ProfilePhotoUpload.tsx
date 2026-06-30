import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';

interface ProfilePhotoUploadProps {
  value?: string;
  onChange: (photoUrl: string | undefined) => void;
  label?: string;
  description?: string;
}

export default function ProfilePhotoUpload({
  value,
  onChange,
  label = 'Profile Photo',
  description = 'Take a clear photo of your face. Buyers will see this on your listings.',
}: ProfilePhotoUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    // Convert to base64 so the image persists in localStorage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onChange(base64);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleClear = useCallback(() => {
    setPreview(undefined);
    onChange(undefined);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [onChange]);

  const triggerCamera = () => {
    cameraInputRef.current?.click();
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <User className="w-3.5 h-3.5 text-leaf" />
        <span className="text-sm font-semibold text-charcoal">{label}</span>
      </div>
      <p className="text-xs text-stone">{description}</p>

      {preview ? (
        <div className="relative w-28 h-28 mx-auto">
          <img
            src={preview}
            alt="Profile preview"
            className="w-28 h-28 rounded-full object-cover border-2 border-leaf shadow-md"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {/* Hidden inputs - moved outside flex, styled as visually hidden but accessible */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="sr-only"
            aria-label="Upload profile photo from device"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="sr-only"
            aria-label="Take profile photo with camera"
          />

          {/* Upload options - using button elements with onClick for reliability */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={triggerCamera}
              className="flex items-center gap-2 px-4 py-2.5 bg-leaf text-white text-sm font-medium rounded-xl hover:bg-forest active:bg-forest active:scale-95 transition-all select-none touch-manipulation"
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </button>
            <button
              type="button"
              onClick={triggerFileSelect}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-leaf text-leaf text-sm font-medium rounded-xl hover:bg-leaf/5 active:bg-leaf/10 active:scale-95 transition-all select-none touch-manipulation"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>

          {/* Placeholder circle */}
          <div className="w-20 h-20 rounded-full bg-fog flex items-center justify-center">
            <User className="w-8 h-8 text-stone/50" />
          </div>
        </div>
      )}
    </div>
  );
}
