import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Upload, X, FileUp } from 'lucide-react';
import { createAssignment } from '../../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AssignmentFormProps {
  programId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface Attachment {
  fileUrl: string;
  fileName: string;
  isUploading?: boolean;
}

export function AssignmentForm({ programId, onSuccess, onCancel }: AssignmentFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '23:59',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '00:00',
    attachments: [] as Attachment[]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileInput, setFileInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Add uploading state
      setFormData(prev => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          { fileUrl: '', fileName: file.name, isUploading: true }
        ]
      }));

      try {
        // Upload file to Cloudinary
        const formDataForUpload = new FormData();
        formDataForUpload.append('image', file);
        
        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formDataForUpload,
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        
        // Update with actual URL
        setFormData(prev => ({
          ...prev,
          attachments: prev.attachments.map(att =>
            att.fileName === file.name && att.isUploading
              ? { fileUrl: data.imageUrl, fileName: file.name }
              : att
          )
        }));
      } catch (err: any) {
        setError(`Failed to upload ${file.name}: ${err.message}`);
        // Remove failed upload
        setFormData(prev => ({
          ...prev,
          attachments: prev.attachments.filter(att => att.fileName !== file.name)
        }));
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addAttachmentFromURL = () => {
    if (fileInput.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          { fileUrl: fileInput, fileName: fileInput.split('/').pop() || 'file' }
        ]
      }));
      setFileInput('');
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Combine date and time
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString();
      const releasedDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString();
      const now = new Date();

      // Validate dates are not in the past
      if (new Date(releasedDateTime) < now) {
        setError('Release date and time cannot be in the past');
        setIsLoading(false);
        return;
      }

      if (new Date(dueDateTime) < now) {
        setError('Due date and time cannot be in the past');
        setIsLoading(false);
        return;
      }

      if (new Date(dueDateTime) <= new Date(releasedDateTime)) {
        setError('Due date must be after release date');
        setIsLoading(false);
        return;
      }

      await createAssignment({
        title: formData.title,
        description: formData.description,
        dueDate: dueDateTime,
        scheduledDate: releasedDateTime,
        attachments: formData.attachments,
        program: programId
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create assignment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Assignment</CardTitle>
        <CardDescription>Add a new assignment for students</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Chapter 5 Practice Problems"
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
              placeholder="Provide instructions and details about the assignment"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Release Date *</Label>
              <Input
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Release Time *</Label>
              <Input
                id="scheduledTime"
                name="scheduledTime"
                type="time"
                value={formData.scheduledTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueTime">Due Time *</Label>
              <Input
                id="dueTime"
                name="dueTime"
                type="time"
                value={formData.dueTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="space-y-3">
              {/* File Picker */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="*/*"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="gap-2 w-full"
                >
                  <FileUp size={16} /> Choose Files
                </Button>
              </div>

              {/* OR divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-white text-gray-500">Or paste URL</span>
                </div>
              </div>

              {/* URL input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Paste file URL (e.g., https://example.com/file.pdf)"
                  value={fileInput}
                  onChange={(e) => setFileInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addAttachmentFromURL();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addAttachmentFromURL}
                  variant="outline"
                  className="gap-2"
                >
                  <Upload size={16} /> Add
                </Button>
              </div>
            </div>

            {formData.attachments.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium">Attached Files:</p>
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-100 rounded"
                  >
                    <div className="flex-1">
                      <span className="text-sm">{file.fileName}</span>
                      {file.isUploading && (
                        <span className="text-xs text-blue-600 ml-2">Uploading...</span>
                      )}
                      {!file.isUploading && file.fileUrl && (
                        <span className="text-xs text-green-600 ml-2">✓ Uploaded</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title || !formData.dueDate}
              className="gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : null}
              Create Assignment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
