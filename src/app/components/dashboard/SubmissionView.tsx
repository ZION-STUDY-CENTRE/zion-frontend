import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Download, Save } from 'lucide-react';
import { showSuccess, showError } from '../../../utils/sweetAlert';
import { getAssignmentSubmissions, gradeAssignmentSubmission } from '../../services/api';

interface SubmissionViewProps {
  assignmentId: string;
  onBack: () => void;
}

interface Submission {
  _id: string;
  student: { _id: string; name: string; email: string };
  submittedAt: string;
  isLate: boolean;
  submissionFile?: string;
  fileName?: string;
  grade: number | null;
  feedback: string;
  status: string;
}

export function SubmissionView({ assignmentId, onBack }: SubmissionViewProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [grades, setGrades] = useState<{[key: string]: { grade: number; feedback: string }}>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await getAssignmentSubmissions(assignmentId);
      setSubmissions(data);
      
      // Initialize grades state
      const gradesData: {[key: string]: { grade: number; feedback: string }} = {};
      data.forEach((sub: Submission) => {
        gradesData[sub._id] = {
          grade: sub.grade || 0,
          feedback: sub.feedback || ''
        };
      });
      setGrades(gradesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGrade = async (submissionId: string) => {
    try {
      setSaving(true);
      await gradeAssignmentSubmission(submissionId, {
        grade: grades[submissionId].grade,
        feedback: grades[submissionId].feedback,
        status: 'graded'
      });

      // Update local state
      setSubmissions(prev => prev.map(sub =>
        sub._id === submissionId
          ? { ...sub, grade: grades[submissionId].grade, feedback: grades[submissionId].feedback, status: 'graded' }
          : sub
      ));

      setEditingId(null);
      showSuccess('Grade saved successfully!');
    } catch (err: any) {
      showError('Failed to save', err.message || 'Failed to save grade');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assignment Submissions</h2>
        <Button variant="outline" onClick={onBack}>Back to Assignments</Button>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No submissions yet.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold">Student Name</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Submitted</th>
                <th className="px-4 py-3 text-left font-semibold">Late</th>
                <th className="px-4 py-3 text-left font-semibold">File</th>
                <th className="px-4 py-3 text-left font-semibold">Grade / 100</th>
                <th className="px-4 py-3 text-left font-semibold">Feedback</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{submission.student.name}</td>
                  <td className="px-4 py-3">{submission.student.email}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${submission.isLate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {submission.isLate ? 'Late' : 'On Time'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {submission.submissionFile ? (
                      <a
                        href={submission.submissionFile}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Download size={14} />
                        {submission.fileName}
                      </a>
                    ) : (
                      <span className="text-gray-400">No file</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === submission._id ? (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={grades[submission._id]?.grade || 0}
                        onChange={(e) => setGrades(prev => ({
                          ...prev,
                          [submission._id]: { ...prev[submission._id], grade: parseInt(e.target.value) || 0 }
                        }))}
                        className="w-20"
                      />
                    ) : (
                      <span className={submission.grade !== null ? 'font-semibold' : 'text-gray-400'}>
                        {submission.grade !== null ? submission.grade : '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === submission._id ? (
                      <textarea
                        value={grades[submission._id]?.feedback || ''}
                        onChange={(e) => setGrades(prev => ({
                          ...prev,
                          [submission._id]: { ...prev[submission._id], feedback: e.target.value }
                        }))}
                        placeholder="Add feedback..."
                        className="w-full p-2 border rounded text-sm min-h-[60px]"
                      />
                    ) : (
                      <span className="text-sm text-gray-600 truncate">{submission.feedback || '-'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === submission._id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveGrade(submission._id)}
                          disabled={saving}
                          className="gap-1"
                        >
                          <Save size={14} /> Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(submission._id)}
                      >
                        Grade
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grade Summary */}
      {submissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Grade Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">{submissions.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Graded</p>
                <p className="text-2xl font-bold">{submissions.filter(s => s.grade !== null).length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold">
                  {submissions.length > 0
                    ? (submissions.reduce((sum, s) => sum + (s.grade || 0), 0) / submissions.filter(s => s.grade !== null).length).toFixed(1)
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
