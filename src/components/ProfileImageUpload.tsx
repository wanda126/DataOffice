import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface ProfileImageUploadProps {
  currentImage?: string;
  onImageChange: (file: File) => void;
  type: 'avatar' | 'logo';
  className?: string;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImage,
  onImageChange,
  type,
  className = ''
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isAvatar = type === 'avatar';
  const size = isAvatar ? 'w-24 h-24' : 'w-32 h-24';
  const shape = isAvatar ? 'rounded-full' : 'rounded-lg';

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${size} ${shape} border-2 border-dashed ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors overflow-hidden`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt={isAvatar ? 'Avatar' : 'Logo'}
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            {isAvatar ? (
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            )}
            <p className="text-xs text-gray-500">
              {isAvatar ? 'Foto de perfil' : 'Logo empresa'}
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-gray-500 mt-2 text-center">
        {isAvatar ? 'JPG, PNG hasta 5MB' : 'Logo de empresa (JPG, PNG)'}
      </p>
    </div>
  );
};