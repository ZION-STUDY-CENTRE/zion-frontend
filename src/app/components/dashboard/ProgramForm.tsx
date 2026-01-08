import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Program, uploadImage } from '../../services/api';
import { Plus, Trash2, X, Loader2 } from "lucide-react";

interface ProgramFormProps {
  initialData?: Partial<Program>;
  onSubmit: (data: Partial<Program>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  availableInstructors?: { _id: string; name: string; email: string }[];
}

export function ProgramForm({ initialData, onSubmit, onCancel, isLoading, availableInstructors = [] }: ProgramFormProps) {
  const [formData, setFormData] = useState<Partial<Program>>({
    title: '',
    code: '',
    category: '',
    shortDescription: '',
    description: '',
    overview: '',
    heroImage: '',
    keyStats: {
      duration: '',
      studyMode: '',
      intakes: [],
      certification: ''
    },
    modules: [],
    entryRequirements: [],
    careerOpportunities: [],
    schedule: '',
    students: 0
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newModule, setNewModule] = useState({ title: '', description: '' });
  const [newEntryReq, setNewEntryReq] = useState('');
  const [newCareerOpp, setNewCareerOpp] = useState('');
  const [newIntake, setNewIntake] = useState('');

  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      // Normalize instructors to IDs
      const loadedInstructors = initialData.instructors?.map(i => typeof i === 'string' ? i : i._id) || [];
      setSelectedInstructors(loadedInstructors);

      setFormData({
        title: '',
        code: '',
        category: '',
        shortDescription: '',
        description: '',
        overview: '',
        heroImage: '',
        modules: [],
        entryRequirements: [],
        careerOpportunities: [],
        schedule: '',
        students: 0,
        ...initialData,
        keyStats: {
            duration: '',
            studyMode: '',
            intakes: [],
            certification: '',
            ...(initialData.keyStats || {}) 
        }
      });
    }
  }, [initialData]);

  const toggleInstructor = (id: string) => {
    setSelectedInstructors(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('keyStats.')) {
      const statName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        keyStats: { ...prev.keyStats!, [statName]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleParamsChange = (value: string, name: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
  }

  // --- Dynamic Array Handlers ---

  const addModule = () => {
    if (newModule.title && newModule.description) {
      setFormData(prev => ({
        ...prev,
        modules: [...(prev.modules || []), newModule]
      }));
      setNewModule({ title: '', description: '' });
    }
  };

  const removeModule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules?.filter((_, i) => i !== index)
    }));
  };

  const addEntryReq = () => {
    if (newEntryReq) {
      setFormData(prev => ({
        ...prev,
        entryRequirements: [...(prev.entryRequirements || []), newEntryReq]
      }));
      setNewEntryReq('');
    }
  };

  const removeEntryReq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      entryRequirements: prev.entryRequirements?.filter((_, i) => i !== index)
    }));
  };

  const addCareerOpp = () => {
    if (newCareerOpp) {
      setFormData(prev => ({
        ...prev,
        careerOpportunities: [...(prev.careerOpportunities || []), newCareerOpp]
      }));
      setNewCareerOpp('');
    }
  };

  const removeCareerOpp = (index: number) => {
    setFormData(prev => ({
      ...prev,
      careerOpportunities: prev.careerOpportunities?.filter((_, i) => i !== index)
    }));
  };

    const addIntake = () => {
    if (newIntake) {
      setFormData(prev => ({
        ...prev,
        keyStats: {
            ...prev.keyStats!,
            intakes: [...(prev.keyStats?.intakes || []), newIntake]
        }
      }));
      setNewIntake('');
    }
  };

  const removeIntake = (index: number) => {
     setFormData(prev => ({
        ...prev,
        keyStats: {
            ...prev.keyStats!,
            intakes: prev.keyStats?.intakes?.filter((_, i) => i !== index) || []
        }
      }));
  };

  // --- Submit Handler ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalData = { ...formData };

    if (imageFile) {
      try {
        setUploading(true);
        const imageUrl = await uploadImage(imageFile, 'programs');
        finalData.heroImage = imageUrl;
        finalData.imageUrl = imageUrl; 
      } catch (error) {
        console.error("Image upload failed", error);
        alert("Failed to upload image. Please try again.");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    // Auto-generate Code/Slug if needed
    if (!finalData.code && finalData.title) {
        finalData.code = finalData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Attach selected instructors
    finalData.instructors = selectedInstructors;
    // Explicitly add it because just updating state might not reflect in finalData immediately if we relied only on state
    // But here we are modifyng finalData object directly, so it is fine.
    
    console.log('Validating instructors before submit:', selectedInstructors);
    
    await onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border">
      
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Program Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Web Development" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
           <Select value={formData.category} onValueChange={(val) => handleParamsChange(val, 'category')}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="International Exams">International Exams</SelectItem>
              <SelectItem value="Secondary School">Secondary School</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="code">Slug / Code (Auto-generated if empty)</Label>
            <Input id="code" name="code" value={formData.code} onChange={handleChange} placeholder="web-dev" />
        </div>
         <div className="space-y-2">
            <Label htmlFor="image">Hero Image</Label>
            <Input id="image" type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} accept="image/*" />
            {(formData.heroImage || imageFile) && <p className="text-xs text-green-600">Image selected/present</p>}
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Input id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} required placeholder="One sentence summary" />
      </div>

       <div className="space-y-2">
        <Label htmlFor="overview">Overview</Label>
        <Textarea id="overview" name="overview" value={formData.overview} onChange={handleChange} required placeholder="Detailed overview..." className="h-24" />
      </div>

      {/* Key Stats */}
      <h3 className="font-semibold text-lg border-b pb-2">Key Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <Label>Duration</Label>
            <Input name="keyStats.duration" value={formData.keyStats?.duration} onChange={handleChange} placeholder="e.g. 4 months" />
        </div>
        <div className="space-y-2">
            <Label>Study Mode</Label>
            <Input name="keyStats.studyMode" value={formData.keyStats?.studyMode} onChange={handleChange} placeholder="e.g. Part-time" />
        </div>
         <div className="space-y-2">
            <Label>Certification</Label>
            <Input name="keyStats.certification" value={formData.keyStats?.certification} onChange={handleChange} placeholder="e.g. Professional Certificate" />
        </div>
        <div className="space-y-2">
            <Label>Schedule</Label>
            <Input name="schedule" value={formData.schedule} onChange={handleChange} placeholder="e.g. Mon, Wed, Fri" />
        </div>
      </div>

      {/* Dynamic Intakes */}
      <div className="space-y-2">
        <Label>Intakes</Label>
        <div className="flex gap-2">
            <Input value={newIntake} onChange={(e) => setNewIntake(e.target.value)} placeholder="Add intake (e.g. January)" />
            <Button type="button" onClick={addIntake} size="icon"><Plus className="h-4 w-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
            {formData.keyStats?.intakes?.map((intake, idx) => (
                <div key={idx} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                    {intake}
                    <button type="button" onClick={() => removeIntake(idx)}><X className="h-3 w-3" /></button>
                </div>
            ))}
        </div>
      </div>


      {/* Dynamic Modules */}
      <h3 className="font-semibold text-lg border-b pb-2">Modules</h3>
      <div className="space-y-4">
        <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
                <Label>Module Title</Label>
                <Input value={newModule.title} onChange={(e) => setNewModule({...newModule, title: e.target.value})} placeholder="Intro to HTML" />
            </div>
             <div className="flex-1 space-y-2">
                <Label>Description</Label>
                <Input value={newModule.description} onChange={(e) => setNewModule({...newModule, description: e.target.value})} placeholder="Basics of DOM..." />
            </div>
            <Button type="button" onClick={addModule}><Plus className="h-4 w-4 mr-2" /> Add</Button>
        </div>
        
        <div className="space-y-2">
            {formData.modules?.map((m, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                    <div>
                        <p className="font-medium">{m.title}</p>
                        <p className="text-sm text-gray-500">{m.description}</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeModule(idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
            ))}
        </div>
      </div>

       {/* Entry Requirements */}
      <div className="space-y-2">
        <Label>Entry Requirements</Label>
        <div className="flex gap-2">
            <Input value={newEntryReq} onChange={(e) => setNewEntryReq(e.target.value)} placeholder="Add requirement" />
            <Button type="button" onClick={addEntryReq} size="icon"><Plus className="h-4 w-4" /></Button>
        </div>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            {formData.entryRequirements?.map((req, idx) => (
                <li key={idx} className="flex items-center gap-2">
                    <span className="flex-1">{req}</span>
                    <button type="button" onClick={() => removeEntryReq(idx)}><X className="h-4 w-4 text-gray-400" /></button>
                </li>
            ))}
        </ul>
      </div>

      {/* Instructors Selection */}
      <div className="space-y-4 pt-4 border-t">
          <Label className="text-lg font-semibold">Assign Instructors</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
              {availableInstructors.length === 0 && <p className="text-sm text-gray-400 p-2">No instructors found.</p>}
              {availableInstructors.map((inst) => (
                  <label key={inst._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedInstructors.includes(inst._id)} 
                        onChange={() => toggleInstructor(inst._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{inst.name} ({inst.email})</span>
                  </label>
              ))}
          </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button type="submit" disabled={isLoading || uploading}>
            {(isLoading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Update Program' : 'Create Program'}
        </Button>
      </div>

    </form>
  );
}
