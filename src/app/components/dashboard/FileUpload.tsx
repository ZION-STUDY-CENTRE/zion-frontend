import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Upload, Download, Trash2, FileUp } from 'lucide-react';
import { uploadFileResource, deleteFileResource } from '../../services/api';
import { showConfirm, showSuccess, showError } from '../../../utils/sweetAlert';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface FileUploadProps {
  programId: string;
  files: any[];
  onFileAdded: () => void;
  isInstructor: boolean;
}

export function FileUpload({ programId, files, onFileAdded, isInstructor }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileName: '',
    resourceType: 'study-material' as const,
    visibility: 'public' as const
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    setError('');

    try {
      // Upload file to Cloudinary via backend
      const formDataForUpload = new FormData();
      formDataForUpload.append('image', file);
      
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formDataForUpload,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        fileName: file.name,
        fileUrl: data.imageUrl
      }));
      setUploadedFileUrl(data.imageUrl);
    } catch (err: any) {
      setError(`Failed to upload file: ${err.message}`);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.fileUrl) {
      setError('Please fill in title and upload a file');
      return;
    }

    setIsLoading(true);

    try {
      await uploadFileResource({
        ...formData,
        program: programId,
        fileSize: 0
      });
      setFormData({
        title: '',
        description: '',
        fileUrl: '',
        fileName: '',
        resourceType: 'study-material',
        visibility: 'public'
      });
      setUploadedFileUrl('');
      if (filePickerRef.current) {
        filePickerRef.current.value = '';
      }
      onFileAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to send material');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    const confirmed = await showConfirm('Delete File', 'Are you sure you want to delete this file?', 'Yes, delete it', 'Cancel');
    if (!confirmed) return;
    try {
      await deleteFileResource(fileId);
      showSuccess('File deleted successfully');
      onFileAdded();
    } catch (err: any) {
      showError('Failed to delete', err.message || 'Failed to delete file');
    }
  };

  return (
    <div className="space-y-4">
      {isInstructor && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Study Material</CardTitle>
            <CardDescription>Share files with your students</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">File Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Chapter 3 Study Guide"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="What is this file about?"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resourceType">Resource Type</Label>
                  <select
                    id="resourceType"
                    name="resourceType"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={formData.resourceType}
                    onChange={handleInputChange}
                  >
                    <option value="study-material">Study Material</option>
                    <option value="lecture-notes">Lecture Notes</option>
                    <option value="reference">Reference</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <select
                    id="visibility"
                    name="visibility"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={formData.visibility}
                    onChange={handleInputChange}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Select File *</Label>
                <div className="space-y-2">
                  <input
                    ref={filePickerRef}
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => filePickerRef.current?.click()}
                    variant="outline"
                    className="w-full gap-2"
                    disabled={isUploadingFile}
                  >
                    {isUploadingFile ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FileUp size={16} />
                        Choose File
                      </>
                    )}
                  </Button>
                  {formData.fileName && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                      <span className="text-sm text-green-700">{formData.fileName}</span>
                      <span className="text-xs text-green-600">✓ Ready</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || isUploadingFile || !formData.fileUrl}
                className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                Send Material
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Study Materials</CardTitle>
          <CardDescription>{files.length} files available</CardDescription>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No files available yet</p>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{file.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      By: {file.uploadedBy?.name || 'Unknown'} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                    {file.description && (
                      <p className="text-xs text-gray-700 mt-1">{file.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Download"
                    >
                      <Download size={18} className="text-blue-600" />
                    </a>
                    {isInstructor && (
                      <button
                        onClick={() => handleDelete(file._id)}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
