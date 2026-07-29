import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { CalendarIcon, BookOpenIcon, UserIcon, Lock, Download, Clock, CheckCircle, Send } from "lucide-react";
import { ChangePasswordDialog } from "../../components/ChangePasswordDialog";
import { NotificationBell } from "../../components/NotificationBell";
import { getStudentProgram, getAssignments, getQuizzes, getFileResources, getQuiz, submitAssignment, getMyAssignmentSubmission, getQuizSubmission, getPrograms, getStudentResults } from '../../services/api';
import { calculateDaysLeft } from '../../../utils/daysLeft';
import { downloadProfessionalReportCard } from '../../utils/reportCard';
import { QuizTake } from '../../components/dashboard/QuizTake';
import { ChatComponent } from '../../components/ChatComponent';
import { showSuccess, showError, showConfirm } from '../../../utils/sweetAlert';

interface Program {
    _id: string;
    title: string;
    name: string;
    description: string;
    instructors?: {
        name: string;
        email: string;
    }[];
}

interface StudentProgram {
    program: Program;
    enrollmentDate?: string;
    duration?: number;
}

export function StudentDashboard() {
  const { user, logout } = useAuth();
    const [studentPrograms, setStudentPrograms] = useState<StudentProgram[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<StudentProgram | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const [quizDetails, setQuizDetails] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<{[key: string]: any}>({});
  const [quizSubmissions, setQuizSubmissions] = useState<{[key: string]: any}>({});
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<{[key: string]: boolean}>({});
  const [submissionFiles, setSubmissionFiles] = useState<{[key: string]: {file: File | null, url: string}}>({});

    useEffect(() => {
        fetchMyPrograms();
    }, []);

    const fetchMyPrograms = async () => {
        setLoading(true);
        try {
            const data = await getStudentProgram();
            if (Array.isArray(data) && data.length > 0) {
                const firstProgram = data[0];
                setStudentPrograms(data);
                setSelectedProgram(firstProgram);
                const assignmentData = await fetchAssignments(firstProgram.program._id);
                const quizData = await fetchQuizzes(firstProgram.program._id);
                await fetchFiles(firstProgram.program._id);
                await fetchStudentProgress(assignmentData, quizData);
                await fetchResults();
            } else if (data && data.program) {
                setStudentPrograms([data]);
                setSelectedProgram(data);
                const assignmentData = await fetchAssignments(data.program._id);
                const quizData = await fetchQuizzes(data.program._id);
                await fetchFiles(data.program._id);
                await fetchStudentProgress(assignmentData, quizData);
                await fetchResults();
            } else {
                setStudentPrograms([]);
                setSelectedProgram(null);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Server Error');
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async (programId: string) => {
    try {
      const data = await getAssignments(programId);
      setAssignments(data);
      return data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return [];
    }
  };

    const fetchQuizzes = async (programId: string) => {
    try {
      const data = await getQuizzes(programId);
      setQuizzes(data);
      return data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }
  };

    const fetchFiles = async (programId: string) => {
    try {
      const data = await getFileResources(programId);
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchResults = async () => {
    try {
      if (!user?._id) return;
      const results = await getStudentResults(user._id);
      setStudentResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Error fetching student results', error);
    }
  };

  const fetchStudentProgress = async (assignmentData: any[] = [], quizData: any[] = []) => {
    const nextSubmissionMap: {[key: string]: any} = {};
    const nextQuizSubmissionMap: {[key: string]: any} = {};

    for (const assignment of assignmentData) {
      try {
        const submission = await getMyAssignmentSubmission(assignment._id);
        nextSubmissionMap[assignment._id] = submission;
      } catch (err: any) {
        if (!String(err?.message || '').includes('No submission found')) {
          console.error('Error fetching assignment progress:', err);
        }
      }
    }

    for (const quiz of quizData) {
      try {
        const submission = await getQuizSubmission(quiz._id);
        nextQuizSubmissionMap[quiz._id] = submission;
      } catch (err: any) {
        if (!String(err?.message || '').includes('No submission found')) {
          console.error('Error fetching quiz progress:', err);
        }
      }
    }

    setSubmissions(nextSubmissionMap);
    setQuizSubmissions(nextQuizSubmissionMap);
  };

  const handleTakeQuiz = async (quiz: any) => {
    try {
      const fullQuiz = await getQuiz(quiz._id);
      setQuizDetails(fullQuiz);
      setSelectedQuiz(quiz._id);
    } catch (error) {
      console.error('Error loading quiz:', error);
    }
  };
  const isAssignmentOverdue = (dueDate: string) => {
    return new Date() > new Date(dueDate);
  };  const handleFileChange = async (assignmentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(prev => ({ ...prev, [assignmentId]: true }));
      
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${(import.meta.env as any).VITE_API_URL || 'https://zion-backend-og8z.onrender.com/api'}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setSubmissionFiles(prev => ({
        ...prev,
        [assignmentId]: { file, url: data.imageUrl }
      }));
      
      showSuccess('Upload Complete!', 'File uploaded successfully! Now click "Turn In" to submit.');
    } catch (error: any) {
      showError('Upload Failed', error.message || 'File upload failed');
    } finally {
      setUploadingFile(prev => ({ ...prev, [assignmentId]: false }));
    }
  };

  const handleTurnInAssignment = async (assignmentId: string) => {
    try {
      setSubmittingId(assignmentId);
      const fileData = submissionFiles[assignmentId];
      
      await submitAssignment(assignmentId, {
        submissionText: 'Assignment submitted',
        submissionFile: fileData?.url || '',
        fileName: fileData?.file?.name || ''
      });
      
      // Fetch updated submission status
      const submission = await getMyAssignmentSubmission(assignmentId);
      setSubmissions(prev => ({
        ...prev,
        [assignmentId]: submission
      }));
      
      showSuccess('Success!', 'Assignment submitted successfully!');
    } catch (error: any) {
      showError('Submission Failed', error.message || 'Failed to submit assignment');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm('Logout', 'Are you sure you want to logout?', 'Yes, logout', 'Cancel');
    if (confirmed) {
      await logout();
    }
  };

  const performanceSummary = (() => {
    const assignmentScores = assignments.map((assignment) => {
      const submission = submissions[assignment._id];
      return typeof submission?.grade === 'number' ? submission.grade : 0;
    });

    const quizScores = quizzes.map((quiz) => {
      const submission = quizSubmissions[quiz._id];
      return typeof submission?.percentageScore === 'number' ? submission.percentageScore : 0;
    });

    const assignmentAverage = assignmentScores.length > 0
      ? assignmentScores.reduce((sum, score) => sum + score, 0) / assignmentScores.length
      : 0;

    const quizAverage = quizScores.length > 0
      ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length
      : 0;

    const projectAverage = 0;
    const components = [] as number[];
    if (assignments.length > 0) components.push(assignmentAverage);
    if (quizzes.length > 0) components.push(quizAverage);
    if (assignments.length > 0 || quizzes.length > 0) components.push(projectAverage);

    const overallScore = components.length > 0
      ? components.reduce((sum, score) => sum + score, 0) / components.length
      : 0;

    return {
      assignmentAverage,
      quizAverage,
      projectAverage,
      overallScore,
      status: overallScore >= 50 ? 'Passed' : 'Failed'
    };
  })();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Portal</h1>
            <p className="text-lg text-muted-foreground mt-2">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-2 items-center">
            <NotificationBell />
            <Button onClick={() => setIsChangePasswordOpen(true)} variant="outline">
                <Lock className="w-4 h-4 mr-2" /> Change Password
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                Logout
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Course Content Area */}
        <div className="lg:col-span-2 space-y-6">
            {loading ? (
                <Card><CardContent className="p-8">Loading your program...</CardContent></Card>
            ) : error ? (
                <Card className="border-red-200 bg-red-50"><CardContent className="p-8 text-red-600">{error}</CardContent></Card>
            ) : studentPrograms.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Not Enrolled</CardTitle>
                        <CardDescription>You are not currently enrolled in any active program. Please contact the administrator.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <>
                <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
                  <span className="font-semibold">My Programs:</span>
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    {studentPrograms.map((sp, idx) => (
                      <Button
                        key={sp.program._id}
                        variant={selectedProgram?.program._id === sp.program._id ? 'default' : 'outline'}
                        onClick={async () => {
                          setSelectedProgram(sp);
                          setLoading(true);
                          const assignmentData = await fetchAssignments(sp.program._id);
                          const quizData = await fetchQuizzes(sp.program._id);
                          await fetchFiles(sp.program._id);
                          await fetchStudentProgress(assignmentData, quizData);
                          setLoading(false);
                        }}
                        size="sm"
                      >
                        {sp.program.title}
                      </Button>
                    ))}
                  </div>
                </div>
                <Card className="border-l-4 border-l-primary shadow-md">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-black">{selectedProgram?.program.title}</CardTitle>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Active</Badge>
                                {selectedProgram?.enrollmentDate && selectedProgram?.duration && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                                    {calculateDaysLeft(selectedProgram.enrollmentDate, selectedProgram.duration)} days left
                                  </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-700">{selectedProgram?.program.description || "No description available."}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
                            <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                <span>
                                    Instructors: {selectedProgram?.program.instructors && selectedProgram.program.instructors.length > 0 
                                     ? selectedProgram.program.instructors.map(i => i.name).join(', ') 
                                     : "TBA"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                <span>Enrolled: {selectedProgram?.enrollmentDate ? new Date(selectedProgram.enrollmentDate).toLocaleDateString() : '-'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                </>
            )}

            {/* Tabs for Materials/Assignments/Quizzes */}
            {selectedProgram && (
                <Tabs defaultValue="materials" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="materials">Study Materials</TabsTrigger>
                        <TabsTrigger value="assignments">Assignments</TabsTrigger>
                        <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                        <TabsTrigger value="chat">Chat</TabsTrigger>
                    </TabsList>

                    {/* Study Materials Tab */}
                    <TabsContent value="materials">
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Materials</CardTitle>
                                <CardDescription>Access your study guides and learning resources.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {files.length === 0 ? (
                                    <p className="text-muted-foreground text-sm italic py-8 text-center">No materials uploaded yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {files
                                            .filter(file => file.program === selectedProgram?.program._id || file.program?._id === selectedProgram?.program._id)
                                            .map((file) => (
                                                <div
                                                    key={file._id}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{file.title}</p>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {file.description || 'No description'}
                                                        </p>
                                                    </div>
                                                    <a
                                                        href={`${(import.meta.env as any).VITE_API_URL || 'https://zion-backend-og8z.onrender.com/api'}/files/${file._id}/download`}
                                                        download={file.title + (file.extension || '')}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download size={18} className="text-blue-600" />
                                                    </a>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Assignments Tab */}
                    <TabsContent value="assignments">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Assignments</CardTitle>
                                <CardDescription>View and submit your tasks.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {assignments.length === 0 ? (
                                    <p className="text-muted-foreground text-sm italic py-8 text-center">No active assignments.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {assignments.map((assignment) => {
                                            const overdue = isAssignmentOverdue(assignment.dueDate);
                                            return (
                                                <Card key={assignment._id} className={overdue ? 'border-red-200 bg-red-50' : ''}>
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold">{assignment.title}</h3>
                                                                {assignment.description && (
                                                                    <p className="text-sm text-gray-600 mt-2">{assignment.description}</p>
                                                                )}
                                                                <div className="flex items-center gap-4 text-sm mt-3 text-gray-600">
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock size={14} />
                                                                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                                    </span>
                                                                    {assignment.attachments?.length > 0 && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Download size={14} />
                                                                            {assignment.attachments.length} file{assignment.attachments.length !== 1 ? 's' : ''}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <Badge variant={overdue ? 'destructive' : 'secondary'}>
                                                                {overdue ? 'Overdue' : 'Active'}
                                                            </Badge>
                                                        </div>
                                                        
                                                        {assignment.attachments?.length > 0 && (
                                                            <div className="mt-4 pt-4 border-t">
                                                                <p className="text-sm font-medium mb-2">Attached Files:</p>
                                                                <div className="space-y-1">
                                                                    {assignment.attachments.map((file: any, idx: number) => (
                                                                        <a
                                                                            key={idx}
                                                                            href={`${(import.meta.env as any).VITE_API_URL || 'https://zion-backend-og8z.onrender.com/api'}/assignments/${assignment._id}/attachments/${idx}/download`}
                                                                            download={file.fileName || true}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 hover:underline text-sm flex items-center gap-2"
                                                                        >
                                                                            <Download size={14} />
                                                                            {file.fileName}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {!submissions[assignment._id] && (
                                                            <div className="mt-4 pt-4 border-t">
                                                                <p className="text-sm font-medium mb-2">Upload Your Work:</p>
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="file"
                                                                        id={`file-${assignment._id}`}
                                                                        onChange={(e) => handleFileChange(assignment._id, e)}
                                                                        disabled={uploadingFile[assignment._id]}
                                                                        className="text-sm"
                                                                    />
                                                                    {submissionFiles[assignment._id] && (
                                                                        <span className="text-sm text-green-600">✓ {submissionFiles[assignment._id].file?.name}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="mt-4 flex gap-2">
                                                            {submissions[assignment._id] ? (
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-green-600">
                                                                        <CheckCircle size={16} />
                                                                        <span className="text-sm">Submitted</span>
                                                                    </div>
                                                                    {submissions[assignment._id].grade !== null && (
                                                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                                                            <p className="text-sm font-semibold">Grade: {submissions[assignment._id].grade}/100</p>
                                                                            {submissions[assignment._id].feedback && (
                                                                                <p className="text-sm mt-1">{submissions[assignment._id].feedback}</p>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleTurnInAssignment(assignment._id)}
                                                                    disabled={submittingId === assignment._id || !submissionFiles[assignment._id]}
                                                                    className="gap-2"
                                                                >
                                                                    <Send size={14} />
                                                                    {submittingId === assignment._id ? 'Submitting...' : 'Turn In'}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Quizzes Tab */}
                    <TabsContent value="quizzes">
                        {selectedQuiz && quizDetails ? (
                            <div>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedQuiz(null);
                                        setQuizDetails(null);
                                    }}
                                    className="mb-4"
                                >
                                    Back to Quizzes
                                </Button>
                                <QuizTake
                                    quiz={quizDetails}
                                    onQuizComplete={() => {
                                        setSelectedQuiz(null);
                                        setQuizDetails(null);
                                        if (selectedProgram) {
                                            fetchQuizzes(selectedProgram.program._id);
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quizzes</CardTitle>
                                    <CardDescription>Take quizzes to test your knowledge.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {quizzes.length === 0 ? (
                                        <p className="text-muted-foreground text-sm italic py-8 text-center">No quizzes available yet.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {quizzes.map((quiz) => {
                                                const dueDate = new Date(quiz.dueDate);
                                                const isOverdue = new Date() > dueDate;
                                                return (
                                                    <Card key={quiz._id} className={isOverdue ? 'border-red-200 bg-red-50' : ''}>
                                                        <CardContent className="p-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <h3 className="font-semibold">{quiz.title}</h3>
                                                                    {quiz.description && (
                                                                        <p className="text-sm text-gray-600 mt-2">{quiz.description}</p>
                                                                    )}
                                                                    <div className="flex flex-wrap items-center gap-4 text-sm mt-3 text-gray-600">
                                                                        <span className="flex items-center gap-1">
                                                                            📝 {quiz.questions?.length || 0} questions
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            ⏱️ {quiz.duration} minutes
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            🎯 {quiz.totalMarks} marks
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            <Clock size={14} />
                                                                            Due: {dueDate.toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    onClick={() => handleTakeQuiz(quiz)}
                                                                    disabled={isOverdue}
                                                                    className="ml-4"
                                                                >
                                                                    {isOverdue ? 'Closed' : 'Take Quiz'}
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Progress Tab */}
                    <TabsContent value="progress">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Progress</CardTitle>
                                <CardDescription>Overview of your assignments and quiz submissions with grades.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Card className="border-blue-200 bg-blue-50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">Overall Result</p>
                                                <p className="text-3xl font-bold">{performanceSummary.overallScore.toFixed(0)}%</p>
                                            </div>
                                            <Badge variant={performanceSummary.status === 'Passed' ? 'default' : 'destructive'}>
                                                {performanceSummary.status}
                                            </Badge>
                                        </div>
                                        <div className="mt-3 grid grid-cols-3 gap-3 text-sm text-gray-600">
                                            <div>
                                                <p className="font-semibold">Assignments</p>
                                                <p>{performanceSummary.assignmentAverage.toFixed(0)}%</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Quizzes</p>
                                                <p>{performanceSummary.quizAverage.toFixed(0)}%</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Projects</p>
                                                <p>{performanceSummary.projectAverage.toFixed(0)}%</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Summary Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-3xl font-bold">{assignments.length}</p>
                                            <p className="text-sm text-gray-600">Assignments</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-3xl font-bold">{Object.keys(submissions).length}</p>
                                            <p className="text-sm text-gray-600">Submitted</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-3xl font-bold">{quizzes.length}</p>
                                            <p className="text-sm text-gray-600">Quizzes</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-3xl font-bold">{
                                                files.filter(file => file.program === selectedProgram?.program._id || file.program?._id === selectedProgram?.program._id).length
                                            }</p>
                                            <p className="text-sm text-gray-600">Resources</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Assignment Grades */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Assignment Grades</h3>
                                    <div className="space-y-2">
                                        {assignments.length === 0 ? (
                                            <p className="text-sm text-gray-600 italic">No assignments yet.</p>
                                        ) : (
                                            assignments.map((assignment) => (
                                                <div key={assignment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{assignment.title}</p>
                                                        <p className="text-sm text-gray-600">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        {submissions[assignment._id] ? (
                                                            <>
                                                                {submissions[assignment._id].grade !== null ? (
                                                                    <div className="text-2xl font-bold text-blue-600">
                                                                        {submissions[assignment._id].grade}
                                                                        <span className="text-sm text-gray-600">/100</span>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-yellow-600 font-medium">Grading Pending</p>
                                                                )}
                                                                <p className="text-xs text-gray-500">Submitted {new Date(submissions[assignment._id].submittedAt).toLocaleDateString()}</p>
                                                            </>
                                                        ) : (
                                                            <p className="text-sm text-red-600 font-medium">Not Submitted</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Quiz Grades */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Quiz Scores</h3>
                                    <div className="space-y-2">
                                        {quizzes.length === 0 ? (
                                            <p className="text-sm text-gray-600 italic">No quizzes yet.</p>
                                        ) : (
                                            quizzes.map((quiz) => {
                                                const submission = quizSubmissions[quiz._id];
                                                const percentage = typeof submission?.percentageScore === 'number' ? submission.percentageScore : 0;
                                                const status = percentage >= 50 ? 'Passed' : 'Failed';

                                                return (
                                                    <div key={quiz._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium">{quiz.title}</p>
                                                            <p className="text-sm text-gray-600">Total Questions: {quiz.questions?.length || 0}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-semibold">{percentage.toFixed(0)}%</p>
                                                            <Badge variant={status === 'Passed' ? 'default' : 'destructive'}>{status}</Badge>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <h4 className="font-semibold mb-2">Projects</h4>
                                    <p className="text-sm text-gray-600">Project scores will appear here once uploaded or graded by your instructor.</p>
                                    <div className="mt-3 text-2xl font-bold">0%</div>
                                </div>

                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <h4 className="font-semibold mb-2">Official Results</h4>
                                    <p className="text-sm text-gray-600">Download your generated academic result sheet from your instructor.</p>
                                    {studentResults.length === 0 ? (
                                        <p className="text-sm text-gray-500 mt-3">No results generated yet.</p>
                                    ) : (
                                        <div className="space-y-2 mt-3">
                                            {studentResults.map((result) => {
                                                const handleDownload = () => {
                                                    downloadProfessionalReportCard({
                                                        result,
                                                        studentName: user?.name || 'Student',
                                                        programTitle: result.program?.title || 'Program'
                                                    });
                                                };

                                                return (
                                                    <div key={result._id} className="flex items-center justify-between rounded border bg-white p-3">
                                                        <div>
                                                            <p className="font-medium">{result.program?.title || 'Program'}</p>
                                                            <p className="text-xs text-gray-500">{result.academicYear} • {result.term}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold">{result.overallScore}%</p>
                                                            <p className="text-xs text-gray-500">CGPA {result.cgpa}</p>
                                                            <Button size="sm" variant="outline" className="mt-2" onClick={handleDownload}>
                                                                <Download className="mr-1 h-4 w-4" /> Download
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 italic pt-4 border-t">Keep working on your assignments and quizzes to improve your progress! Check your feedback in the Assignments and Quizzes tabs.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Chat Tab */}
                    <TabsContent value="chat">
                        <ChatComponent />
                    </TabsContent>
                </Tabs>
            )}
        </div>

        {/* Sidebar / Info */}
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Announcements</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600">Welcome to the new student portal! Check back here for updates from your instructor.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>Need Help?</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600">Contact admin at admin@zion.com for technical support.</p>
                </CardContent>
            </Card>
        </div>
      </div>
      <ChangePasswordDialog isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
    </div>
  );
}
