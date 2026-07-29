import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Loader2, ArrowLeft } from 'lucide-react';
import { getQuizSubmissions } from '../../services/api';

interface QuizSubmissionViewProps {
  quizId: string;
  onBack: () => void;
}

interface QuizSubmission {
  _id: string;
  student?: { _id?: string; name?: string; email?: string } | null;
  score?: number;
  totalMarks?: number;
  percentageScore?: number;
  passed?: boolean;
  submittedAt?: string;
  feedback?: string;
  reviewed?: boolean;
}

export function QuizSubmissionView({ quizId, onBack }: QuizSubmissionViewProps) {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getQuizSubmissions(quizId);
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to load quiz submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft size={16} /> Back to Quizzes
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No quiz submissions yet.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold">Student Name</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Score</th>
                <th className="px-4 py-3 text-left font-semibold">Percentage</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Submitted</th>
                <th className="px-4 py-3 text-left font-semibold">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => {
                const studentName = submission.student?.name || 'Unknown student';
                const studentEmail = submission.student?.email || 'No email';
                const score = submission.score ?? 0;
                const totalMarks = submission.totalMarks ?? 0;
                const percentage = typeof submission.percentageScore === 'number'
                  ? submission.percentageScore
                  : (totalMarks > 0 ? (score / totalMarks) * 100 : 0);
                const passed = percentage >= 50;

                return (
                  <tr key={submission._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{studentName}</td>
                    <td className="px-4 py-3">{studentEmail}</td>
                    <td className="px-4 py-3">{score} / {totalMarks}</td>
                    <td className="px-4 py-3">{percentage.toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <Badge variant={passed ? 'default' : 'destructive'}>
                        {passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {submission.feedback || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quiz Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold">{submissions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Passed</p>
              <p className="text-2xl font-bold">{submissions.filter((s) => {
                const score = s.score ?? 0;
                const totalMarks = s.totalMarks ?? 0;
                const percentage = typeof s.percentageScore === 'number'
                  ? s.percentageScore
                  : (totalMarks > 0 ? (score / totalMarks) * 100 : 0);
                return percentage >= 50;
              }).length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold">
                {submissions.length > 0
                  ? (() => {
                      const avg = submissions.reduce((sum, s) => sum + (s.score ?? 0), 0) / submissions.length;
                      return avg.toFixed(1);
                    })()
                  : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
