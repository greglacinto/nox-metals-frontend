'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Button from './Button';
import Image from 'next/image';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (file: File) => Promise<void>;
  onImageRemove?: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageUpload,
  onImageRemove,
  disabled = false,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      await onImageUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload image. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!onImageRemove) return;

    setIsUploading(true);
    try {
      await onImageRemove();
      setPreviewUrl(null);
    } catch (error) {
      console.error('Remove failed:', error);
      setError('Failed to remove image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        input.files = event.dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Product Image
      </label>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          disabled || isUploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
        />

        {previewUrl ? (
          // Image Preview
          <div className="relative">
            <Image
              src={previewUrl}
              alt="Product preview"
              className="max-h-48 mx-auto rounded-lg shadow-sm"
              width={100}
              height={100}
            />
            {onImageRemove && (
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={disabled || isUploading}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          // Upload Prompt
          <div className="space-y-2">
            {isUploading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="text-gray-600">Uploading...</span>
              </div>
            ) : (
              <>
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    className="inline-flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <p className="mt-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload; 