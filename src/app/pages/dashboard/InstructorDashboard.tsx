import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Lock, Plus, BookOpen, FileText, Trash2, ArrowLeft } from "lucide-react";
import { ChangePasswordDialog } from "../../components/ChangePasswordDialog";

import { NotificationBell } from "../../components/NotificationBell";
import { showConfirm, showSuccess, showError } from '../../../utils/sweetAlert';
import { getInstructorPrograms, getProgramStudents, getAssignments, getQuizzes, getFileResources, deleteAssignment, deleteQuiz, getAssignmentSubmissions, getQuizSubmissions, createStudentResult, getProgramResults, updateStudentResult, deleteStudentResult } from '../../services/api';
import { AssignmentForm } from '../../components/dashboard/AssignmentForm';
import { QuizForm } from '../../components/dashboard/QuizForm';
import { FileUpload } from '../../components/dashboard/FileUpload';
import { SubmissionView } from '../../components/dashboard/SubmissionView';
import { QuizSubmissionView } from '../../components/dashboard/QuizSubmissionView';
import { ChatComponent } from '../../components/ChatComponent';
import { calculateDaysLeft } from '../../../utils/daysLeft';
import { downloadProfessionalReportCard } from '../../utils/reportCard';

interface Program {
  _id: string;
  title: string;
  durationMonths: number;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  enrollmentDate: string;
  programDuration?: number;
  duration?: number;
  programs?: Array<{
    program: string | { _id: string };
    enrollmentDate?: string;
    duration?: number;
  }>;
}

export function InstructorDashboard() {
  const { user, logout } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(user?.isFirstLogin ? true : false);
  const [activeTab, setActiveTab] = useState('students');
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [viewingSubmissions, setViewingSubmissions] = useState<string | null>(null);
  const [viewingQuizSubmissions, setViewingQuizSubmissions] = useState<string | null>(null);
  const [studentProgress, setStudentProgress] = useState<{[key: string]: {assignmentAverage: number; quizAverage: number; overallScore: number; status: string}}>({});
  const [results, setResults] = useState<any[]>([]);
  const [selectedResultStudent, setSelectedResultStudent] = useState<Student | null>(null);
  const [previewResult, setPreviewResult] = useState<any | null>(null);
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [editStatusValue, setEditStatusValue] = useState('Pending');
  const [resultForm, setResultForm] = useState({ academicYear: '', term: 'Current Term', status: 'Pending', remarks: '' });

  useEffect(() => {
    fetchMyPrograms();
  }, []);

  useEffect(() => {
    const loadProgramData = async () => {
      if (!selectedProgram) return;

      const [studentData, assignmentData, quizData] = await Promise.all([
        fetchStudents(selectedProgram._id),
        fetchAssignments(selectedProgram._id),
        fetchQuizzes(selectedProgram._id)
      ]);

      await fetchFiles(selectedProgram._id);
      await fetchStudentProgress(selectedProgram._id, studentData, assignmentData, quizData);
    };

    loadProgramData();
  }, [selectedProgram]);

  useEffect(() => {
    if (!selectedResultStudent) return;

    const progress = studentProgress[selectedResultStudent._id];
    setResultForm({
      academicYear: '',
      term: 'Current Term',
      status: progress?.overallScore && progress.overallScore >= 50 ? 'Passed' : 'Pending',
      remarks: ''
    });
  }, [selectedResultStudent, studentProgress]);

  const isUserActive = (student: Student) => {
    if (!student.enrollmentDate) return false;
    
    // Logic matching backend
    const duration = student.programDuration || 3;
    const enrollment = new Date(student.enrollmentDate);
    const expiryDate = new Date(enrollment);
    
    const wholeMonths = Math.floor(duration);
    expiryDate.setMonth(expiryDate.getMonth() + wholeMonths);
    
    const fractionalMonths = duration - wholeMonths;
    if (fractionalMonths > 0) {
        const fractionalMs = fractionalMonths * 2592000000;
        expiryDate.setTime(expiryDate.getTime() + fractionalMs);
    }
    
    return new Date() < expiryDate;
  };


  const fetchMyPrograms = async () => {
    try {
      console.log('Fetching programs for instructor...');
      
      const data = await getInstructorPrograms();
      
      // console.log('Response data:', data);
      
      setPrograms(data);
      if (data.length > 0) {
        setSelectedProgram(data[0]);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  

  const fetchStudents = async (programId: string) => {
    try {
      const data = await getProgramStudents(programId);
      setStudents(data);
      return data;
    } catch (error) {
      console.error(error);
      return [];
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

  const fetchStudentProgress = async (programId: string, studentData: Student[] = [], assignmentData: any[] = [], quizData: any[] = []) => {
    const nextProgress: {[key: string]: {assignmentAverage: number; quizAverage: number; overallScore: number; status: string}} = {};

    const assignmentSubmissions = await Promise.all(
      assignmentData.map(async (assignment) => {
        try {
          return await getAssignmentSubmissions(assignment._id);
        } catch (error) {
          return [];
        }
      })
    );

    const quizSubmissionLists = await Promise.all(
      quizData.map(async (quiz) => {
        try {
          return await getQuizSubmissions(quiz._id);
        } catch (error) {
          return [];
        }
      })
    );

    studentData.forEach((student) => {
      const assignmentScores: number[] = [];
      assignmentSubmissions.forEach((submissions) => {
        const submission = submissions.find((item: any) => {
          const studentId = item.student?._id || item.student;
          return studentId?.toString() === student._id.toString();
        });

        if (submission) {
          const grade = typeof submission.grade === 'number'
            ? submission.grade
            : (typeof submission.score === 'number' ? submission.score : 0);

          if (typeof grade === 'number') {
            assignmentScores.push(grade);
          }
        }
      });

      const quizScores: number[] = [];
      quizSubmissionLists.forEach((submissions) => {
        const submission = submissions.find((item: any) => {
          const studentId = item.student?._id || item.student;
          return studentId?.toString() === student._id.toString();
        });

        if (submission) {
          const percentage = typeof submission.percentageScore === 'number'
            ? submission.percentageScore
            : (typeof submission.totalMarks === 'number' && submission.totalMarks > 0
                ? ((submission.score || 0) / submission.totalMarks) * 100
                : 0);

          if (typeof percentage === 'number') {
            quizScores.push(percentage);
          }
        }
      });

      const assignmentAverage = assignmentScores.length > 0
        ? assignmentScores.reduce((sum, score) => sum + score, 0) / assignmentScores.length
        : 0;
      const quizAverage = quizScores.length > 0
        ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length
        : 0;

      const projectAverage = 0;
      const components = [] as number[];
      if (assignmentData.length > 0) components.push(assignmentAverage);
      if (quizData.length > 0) components.push(quizAverage);
      if (assignmentData.length > 0 || quizData.length > 0) components.push(projectAverage);

      const overallScore = components.length > 0
        ? components.reduce((sum, score) => sum + score, 0) / components.length
        : 0;

      nextProgress[student._id] = {
        assignmentAverage,
        quizAverage,
        overallScore,
        status: overallScore >= 50 ? 'Passed' : 'Failed'
      };
    });

    setStudentProgress(nextProgress);

    try {
      const programResults = await getProgramResults(programId);
      if (Array.isArray(programResults)) {
        setResults(programResults);
      }
    } catch (error) {
      // Keep the current local results state if the service is unavailable.
    }
  };

  const getCalculatedResultValues = (student: Student) => {
    const progress = studentProgress[student._id];
    if (!progress) return null;

    const assignmentAverage = Number(progress.assignmentAverage || 0);
    const quizAverage = Number(progress.quizAverage || 0);
    const projectAverage = 0;
    const overallScore = Number(progress.overallScore || 0);
    const cgpa = Number(Math.max(0, Math.min(4, overallScore / 25)).toFixed(2));
    const status = overallScore >= 50 ? 'Passed' : 'Failed';

    return {
      assignmentAverage,
      quizAverage,
      projectAverage,
      overallScore,
      cgpa,
      status
    };
  };

  const handleCreateResult = async (student: Student) => {
    try {
      const calculatedValues = getCalculatedResultValues(student);
      if (!calculatedValues) return;

      const payload = {
        student: student._id,
        program: selectedProgram?._id,
        academicYear: resultForm.academicYear || '2026/2027',
        term: resultForm.term,
        assignmentAverage: calculatedValues.assignmentAverage,
        quizAverage: calculatedValues.quizAverage,
        projectAverage: calculatedValues.projectAverage,
        overallScore: calculatedValues.overallScore,
        cgpa: calculatedValues.cgpa,
        status: calculatedValues.status,
        remarks: resultForm.remarks
      };

      const savedResult = await createStudentResult(payload);
      const normalizedResult = savedResult && typeof savedResult === 'object' && savedResult._id
        ? savedResult
        : {
            _id: `local-${Date.now()}`,
            student: { _id: student._id, name: student.name, email: student.email },
            program: { _id: selectedProgram?._id, title: selectedProgram?.title || 'Program' },
            academicYear: payload.academicYear,
            term: payload.term,
            assignmentAverage: payload.assignmentAverage,
            quizAverage: payload.quizAverage,
            projectAverage: payload.projectAverage,
            overallScore: payload.overallScore,
            cgpa: payload.cgpa,
            status: payload.status,
            remarks: payload.remarks,
            generatedAt: new Date().toISOString()
          };

      setResults(prev => [normalizedResult, ...prev]);
      setPreviewResult(normalizedResult);
      setSelectedResultStudent(null);
      setResultForm({ academicYear: '', term: 'Current Term', status: 'Pending', remarks: '' });
      showSuccess('Result created', 'The student result has been generated successfully.');
    } catch (error: any) {
      const fallbackResult = {
        _id: `local-${Date.now()}`,
        student: { _id: student._id, name: student.name, email: student.email },
        program: { _id: selectedProgram?._id, title: selectedProgram?.title || 'Program' },
        academicYear: resultForm.academicYear || '2026/2027',
        term: resultForm.term,
        assignmentAverage: getCalculatedResultValues(student)?.assignmentAverage || 0,
        quizAverage: getCalculatedResultValues(student)?.quizAverage || 0,
        projectAverage: getCalculatedResultValues(student)?.projectAverage || 0,
        overallScore: getCalculatedResultValues(student)?.overallScore || 0,
        cgpa: getCalculatedResultValues(student)?.cgpa || 0,
        status: getCalculatedResultValues(student)?.status || 'Pending',
        remarks: resultForm.remarks,
        generatedAt: new Date().toISOString()
      };
      setResults(prev => [fallbackResult, ...prev]);
      setPreviewResult(fallbackResult);
      setSelectedResultStudent(null);
      setResultForm({ academicYear: '', term: 'Current Term', status: 'Pending', remarks: '' });
      showSuccess('Result saved locally', 'The report card was prepared locally while the service sync is unavailable.');
    }
  };

  const handleUpdateResultStatus = async (result: any) => {
    try {
      const updatedResult = await updateStudentResult(result._id, {
        status: editStatusValue,
        remarks: result.remarks
      });
      const normalizedResult = updatedResult && typeof updatedResult === 'object' && updatedResult._id ? updatedResult : { ...result, status: editStatusValue };
      setResults(prev => prev.map(item => item._id === result._id ? normalizedResult : item));
      setPreviewResult(normalizedResult);
      setEditingResultId(null);
      showSuccess('Status updated', 'The report card status has been updated.');
    } catch (error: any) {
      const normalizedResult = { ...result, status: editStatusValue };
      setResults(prev => prev.map(item => item._id === result._id ? normalizedResult : item));
      setPreviewResult(normalizedResult);
      setEditingResultId(null);
      showSuccess('Status updated locally', 'The status was updated in the current view.');
    }
  };

  const handleDeleteResult = async (resultId: string) => {
    try {
      await deleteStudentResult(resultId);
      setResults(prev => prev.filter(item => item._id !== resultId));
      if (previewResult?._id === resultId) {
        setPreviewResult(null);
      }
      showSuccess('Result deleted', 'The report card has been removed.');
    } catch (error: any) {
      setResults(prev => prev.filter(item => item._id !== resultId));
      if (previewResult?._id === resultId) {
        setPreviewResult(null);
      }
      showSuccess('Result removed locally', 'The report card was removed from the current view.');
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    const confirmed = await showConfirm('Delete Assignment', 'Are you sure you want to delete this assignment?', 'Yes, delete it', 'Cancel');
    if (!confirmed) return;
    try {
      await deleteAssignment(assignmentId);
      showSuccess('Assignment deleted');
      if (selectedProgram) {
        fetchAssignments(selectedProgram._id);
      }
    } catch (error: any) {
      showError('Failed to delete', error.message || 'Error deleting assignment');
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    const confirmed = await showConfirm('Delete Quiz', 'Are you sure you want to delete this quiz?', 'Yes, delete it', 'Cancel');
    if (!confirmed) return;
    try {
      await deleteQuiz(quizId);
      showSuccess('Quiz deleted');
      if (selectedProgram) {
        fetchQuizzes(selectedProgram._id);
      }
    } catch (error: any) {
      showError('Failed to delete', error.message || 'Error deleting quiz');
    }
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm('Logout', 'Are you sure you want to logout?', 'Yes, logout', 'Cancel');
    if (confirmed) {
      await logout();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
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

      {loading ? (
        <p>Loading your courses...</p>
      ) : programs.length === 0 ? (
        <Card>
            <CardHeader>
                <CardTitle>No Assigned Programs</CardTitle>
                <CardDescription>You have not been assigned to teach any programs yet. Please contact the administrator.</CardDescription>
            </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar for Programs */}
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>My Programs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {programs.map((prog) => (
                <div 
                  key={prog._id} 
                  onClick={() => setSelectedProgram(prog)}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${selectedProgram?._id === prog._id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  <div className="font-semibold">{prog.title}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Main Content for Selected Program */}
          <div className="md:col-span-2 space-y-4">
            {showAssignmentForm ? (
              <div>
                <AssignmentForm
                  programId={selectedProgram!._id}
                  onSuccess={() => {
                    setShowAssignmentForm(false);
                    if (selectedProgram) {
                      fetchAssignments(selectedProgram._id);
                    }
                  }}
                  onCancel={() => setShowAssignmentForm(false)}
                />
              </div>
            ) : showQuizForm ? (
              <div>
                <QuizForm
                  programId={selectedProgram!._id}
                  onSuccess={() => {
                    setShowQuizForm(false);
                    if (selectedProgram) {
                      fetchQuizzes(selectedProgram._id);
                    }
                  }}
                  onCancel={() => setShowQuizForm(false)}
                />
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="assignments">Assignments</TabsTrigger>
                  <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                  <TabsTrigger value="files">Materials</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>

                {/* Students Tab */}
                <TabsContent value="students">
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedProgram?.title} - Class Roster</CardTitle>
                      <CardDescription>
                        {students.length} Student{students.length !== 1 ? 's' : ''} enrolled
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {students.length === 0 ? (
                        <p className="text-muted-foreground py-8 text-center italic">No students enrolled in this program yet.</p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Student Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Enrolled Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Result</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {students.map((student) => {
                              // Find the student's program entry for the selected program FIRST
                              let enrollmentDate = student.enrollmentDate;
                              let duration = student.duration ?? student.programDuration;
                              let isPaused = false;
                              
                              if (Array.isArray(student.programs) && selectedProgram) {
                                const progEntry = student.programs.find((p: any) => {
                                  if (!p.program) return false;
                                  if (typeof p.program === 'object' && p.program._id) {
                                    return p.program._id === selectedProgram._id;
                                  }
                                  return p.program === selectedProgram._id;
                                });
                                if (progEntry) {
                                  enrollmentDate = progEntry.enrollmentDate || enrollmentDate;
                                  duration = progEntry.duration ?? duration;
                                  // Access isPaused safely
                                  isPaused = (progEntry as any).isPaused === true;
                                }
                              }

                              // Calculate active status locally based on resolved dates
                              let isActive = false;
                              if (enrollmentDate) {
                                 const dur = duration || 3;
                                 const enrollment = new Date(enrollmentDate);
                                 const expiryDate = new Date(enrollment);
                                 const wholeMonths = Math.floor(dur);
                                 expiryDate.setMonth(expiryDate.getMonth() + wholeMonths);
                                 const fractionalMonths = dur - wholeMonths;
                                 if (fractionalMonths > 0) {
                                     const fractionalMs = fractionalMonths * 2592000000;
                                     expiryDate.setTime(expiryDate.getTime() + fractionalMs);
                                 }
                                 isActive = new Date() < expiryDate;
                              }
                              
                              // Determine badge style
                              let badgeVariant: "default" | "destructive" | "secondary" | "outline" = isActive ? 'default' : 'destructive';
                              let badgeLabel = isActive ? 'Active' : 'Inactive';
                              let badgeClass = isActive ? "bg-green-100 hover:bg-green-700 text-green-800" : ""; // Default destructive is red enough

                              if (isPaused) {
                                badgeVariant = "secondary";
                                badgeLabel = "Paused";
                                badgeClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200";
                              }

                              return (
                                <TableRow key={student._id}>
                                  <TableCell className="font-medium">{student.name}</TableCell>
                                  <TableCell>{student.email}</TableCell>
                                  <TableCell>{enrollmentDate ? new Date(enrollmentDate).toLocaleDateString() : '-'}</TableCell>
                                  <TableCell>
                                    <Badge variant={badgeVariant as any} className={badgeClass}>
                                      {badgeLabel}
                                    </Badge>
                                    {enrollmentDate && duration != null && (
                                      <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold">
                                        {calculateDaysLeft(enrollmentDate, duration)} days left
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {studentProgress[student._id] ? (
                                      <div className="space-y-1">
                                        <div className="font-semibold">{Math.round(studentProgress[student._id].overallScore)}%</div>
                                        <Badge variant={studentProgress[student._id].status === 'Passed' ? 'default' : 'destructive'}>
                                          {studentProgress[student._id].status}
                                        </Badge>
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="students" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedProgram?.title} - Class Roster</CardTitle>
                      <CardDescription>
                        {students.length} Student{students.length !== 1 ? 's' : ''} enrolled
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {students.length === 0 ? (
                        <p className="text-muted-foreground py-8 text-center italic">No students enrolled in this program yet.</p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Student Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Enrolled Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Result</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {students.map((student) => {
                              let enrollmentDate = student.enrollmentDate;
                              let duration = student.duration ?? student.programDuration;
                              let isPaused = false;
                              
                              if (Array.isArray(student.programs) && selectedProgram) {
                                const progEntry = student.programs.find((p: any) => {
                                  if (!p.program) return false;
                                  if (typeof p.program === 'object' && p.program._id) {
                                    return p.program._id === selectedProgram._id;
                                  }
                                  return p.program === selectedProgram._id;
                                });
                                if (progEntry) {
                                  enrollmentDate = progEntry.enrollmentDate || enrollmentDate;
                                  duration = progEntry.duration ?? duration;
                                  isPaused = (progEntry as any).isPaused === true;
                                }
                              }

                              let isActive = false;
                              if (enrollmentDate) {
                                 const dur = duration || 3;
                                 const enrollment = new Date(enrollmentDate);
                                 const expiryDate = new Date(enrollment);
                                 const wholeMonths = Math.floor(dur);
                                 expiryDate.setMonth(expiryDate.getMonth() + wholeMonths);
                                 const fractionalMonths = dur - wholeMonths;
                                 if (fractionalMonths > 0) {
                                     const fractionalMs = fractionalMonths * 2592000000;
                                     expiryDate.setTime(expiryDate.getTime() + fractionalMs);
                                 }
                                 isActive = new Date() < expiryDate;
                              }
                              
                              let badgeVariant: "default" | "destructive" | "secondary" | "outline" = isActive ? 'default' : 'destructive';
                              let badgeLabel = isActive ? 'Active' : 'Inactive';
                              let badgeClass = isActive ? "bg-green-100 hover:bg-green-700 text-green-800" : "";

                              if (isPaused) {
                                badgeVariant = "secondary";
                                badgeLabel = "Paused";
                                badgeClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200";
                              }

                              return (
                                <TableRow key={student._id}>
                                  <TableCell className="font-medium">{student.name}</TableCell>
                                  <TableCell>{student.email}</TableCell>
                                  <TableCell>{enrollmentDate ? new Date(enrollmentDate).toLocaleDateString() : '-'}</TableCell>
                                  <TableCell>
                                    <Badge variant={badgeVariant as any} className={badgeClass}>
                                      {badgeLabel}
                                    </Badge>
                                    {enrollmentDate && duration != null && (
                                      <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold">
                                        {calculateDaysLeft(enrollmentDate, duration)} days left
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {studentProgress[student._id] ? (
                                      <div className="space-y-1">
                                        <div className="font-semibold">{Math.round(studentProgress[student._id].overallScore)}%</div>
                                        <Badge variant={studentProgress[student._id].status === 'Passed' ? 'default' : 'destructive'}>
                                          {studentProgress[student._id].status}
                                        </Badge>
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => setSelectedResultStudent(student)}>
                                      Generate Result
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>

                  {selectedResultStudent && (() => {
                    const calculatedValues = getCalculatedResultValues(selectedResultStudent);
                    return (
                      <Card>
                        <CardHeader>
                          <CardTitle>Student Report Card</CardTitle>
                          <CardDescription>Auto-generated from assignments, quizzes, and the student’s progress record.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="rounded-lg border bg-slate-50 p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Student Name</p>
                                <p className="font-semibold">{selectedResultStudent.name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Class / Program</p>
                                <p className="font-semibold">{selectedProgram?.title || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-semibold">{selectedResultStudent.email}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="rounded border bg-white p-3">
                                <p className="text-xs text-muted-foreground">Assignment Avg</p>
                                <p className="text-lg font-semibold">{calculatedValues ? `${calculatedValues.assignmentAverage.toFixed(1)}%` : '0.0%'}</p>
                              </div>
                              <div className="rounded border bg-white p-3">
                                <p className="text-xs text-muted-foreground">Quiz Avg</p>
                                <p className="text-lg font-semibold">{calculatedValues ? `${calculatedValues.quizAverage.toFixed(1)}%` : '0.0%'}</p>
                              </div>
                              <div className="rounded border bg-white p-3">
                                <p className="text-xs text-muted-foreground">Overall Score</p>
                                <p className="text-lg font-semibold">{calculatedValues ? `${calculatedValues.overallScore.toFixed(1)}%` : '0.0%'}</p>
                              </div>
                              <div className="rounded border bg-white p-3">
                                <p className="text-xs text-muted-foreground">CGPA</p>
                                <p className="text-lg font-semibold">{calculatedValues ? calculatedValues.cgpa.toFixed(2) : '0.00'}</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Academic Year</label>
                              <input value={resultForm.academicYear} onChange={(e) => setResultForm({ ...resultForm, academicYear: e.target.value })} className="w-full border rounded px-3 py-2 mt-1" placeholder="2026/2027" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Term</label>
                              <input value={resultForm.term} onChange={(e) => setResultForm({ ...resultForm, term: e.target.value })} className="w-full border rounded px-3 py-2 mt-1" />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium">Remarks</label>
                            <textarea value={resultForm.remarks} onChange={(e) => setResultForm({ ...resultForm, remarks: e.target.value })} className="w-full border rounded px-3 py-2 mt-1" rows={3} />
                          </div>

                          <div className="flex gap-2">
                            <Button onClick={() => handleCreateResult(selectedResultStudent)}>Save Result</Button>
                            <Button variant="outline" onClick={() => setSelectedResultStudent(null)}>Cancel</Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}

                  {previewResult && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Report Card Preview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="rounded-lg border bg-slate-50 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{previewResult.student?.name || 'Student'}</p>
                              <p className="text-sm text-gray-600">{previewResult.program?.title || selectedProgram?.title || 'Class'}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{previewResult.overallScore}%</p>
                              <p className="text-sm text-gray-500">CGPA {previewResult.cgpa}</p>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div className="rounded bg-white p-2 border">Assignment Avg: {previewResult.assignmentAverage}%</div>
                            <div className="rounded bg-white p-2 border">Quiz Avg: {previewResult.quizAverage}%</div>
                            <div className="rounded bg-white p-2 border">Project Avg: {previewResult.projectAverage}%</div>
                            <div className="rounded bg-white p-2 border">Status: {previewResult.status}</div>
                          </div>
                          <p className="mt-3 text-sm text-gray-600">Remarks: {previewResult.remarks || 'Good progress'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Generated Report Cards</CardTitle>
                      <CardDescription>All report cards created for this class are listed here with download and status actions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {results.length === 0 ? (
                        <div className="rounded border border-dashed p-6 text-center text-muted-foreground">
                          No report cards have been generated yet. Create one from the Students tab.
                        </div>
                      ) : (
                        results.map((result) => (
                          <div key={result._id} className="rounded-lg border bg-slate-50 p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                              <div>
                                <p className="font-semibold">{result.student?.name || 'Student'}</p>
                                <p className="text-sm text-gray-600">{result.program?.title || selectedProgram?.title || 'Class'}</p>
                                <p className="text-xs text-gray-500">{result.academicYear} • {result.term}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{result.overallScore}%</p>
                                <p className="text-sm text-gray-500">CGPA: {result.cgpa}</p>
                                <p className="text-sm font-medium text-emerald-600">{result.status}</p>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div className="rounded bg-white p-2 border">Assignment: {result.assignmentAverage}%</div>
                              <div className="rounded bg-white p-2 border">Quiz: {result.quizAverage}%</div>
                              <div className="rounded bg-white p-2 border">Project: {result.projectAverage}%</div>
                              <div className="rounded bg-white p-2 border">Remarks: {result.remarks || 'Good progress'}</div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Button size="sm" variant="outline" onClick={() => setPreviewResult(result)}>View</Button>
                              <Button size="sm" variant="outline" onClick={() => downloadProfessionalReportCard({ result, studentName: result.student?.name, programTitle: result.program?.title || selectedProgram?.title })}>Download</Button>
                              <Button size="sm" variant="outline" onClick={() => { setEditingResultId(result._id); setEditStatusValue(result.status || 'Pending'); }}>Edit Status</Button>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteResult(result._id)}>Delete</Button>
                            </div>
                            {editingResultId === result._id && (
                              <div className="mt-3 rounded border bg-white p-3 space-y-2">
                                <label className="text-sm font-medium">Update Status</label>
                                <select value={editStatusValue} onChange={(e) => setEditStatusValue(e.target.value)} className="w-full border rounded px-3 py-2">
                                  <option value="Pending">Pending</option>
                                  <option value="Passed">Passed</option>
                                  <option value="Failed">Failed</option>
                                </select>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleUpdateResultStatus(result)}>Save</Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingResultId(null)}>Cancel</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Assignments Tab */}
                <TabsContent value="assignments" className="space-y-4">
                  {viewingSubmissions ? (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={() => setViewingSubmissions(null)}
                        className="gap-2"
                      >
                        <ArrowLeft size={16} /> Back to Assignments
                      </Button>
                      <SubmissionView
                        assignmentId={viewingSubmissions}
                        onBack={() => setViewingSubmissions(null)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-end">
                        <Button onClick={() => setShowAssignmentForm(true)} className="gap-2">
                          <Plus size={16} /> Create Assignment
                        </Button>
                      </div>

                      {assignments.length === 0 ? (
                        <Card>
                          <CardContent className="p-8 text-center text-muted-foreground">
                            No assignments yet. Create one to get started!
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-3">
                          {assignments.map((assignment) => (
                            <Card key={assignment._id} className="hover:shadow-md transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                                    <CardDescription className="mt-2">{assignment.description}</CardDescription>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setViewingSubmissions(assignment._id)}
                                    >
                                      View Submissions
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteAssignment(assignment._id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="flex gap-4 text-sm">
                                  <div>
                                    <span className="font-semibold">Release Date:</span> {new Date(assignment.scheduledDate).toLocaleDateString()}
                                  </div>
                                  <div>
                                    <span className="font-semibold">Due Date:</span> {new Date(assignment.dueDate).toLocaleDateString()}
                                  </div>
                                  {assignment.attachments?.length > 0 && (
                                    <div>
                                      <span className="font-semibold">Files:</span> {assignment.attachments.length} attached
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="space-y-4">
                  {viewingQuizSubmissions ? (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={() => setViewingQuizSubmissions(null)}
                        className="gap-2"
                      >
                        <ArrowLeft size={16} /> Back to Quizzes
                      </Button>
                      <QuizSubmissionView
                        quizId={viewingQuizSubmissions}
                        onBack={() => setViewingQuizSubmissions(null)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-end">
                        <Button onClick={() => setShowQuizForm(true)} className="gap-2">
                          <Plus size={16} /> Create Quiz
                        </Button>
                      </div>

                      {quizzes.length === 0 ? (
                        <Card>
                          <CardContent className="p-8 text-center text-muted-foreground">
                            No quizzes yet. Create one to get started!
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-3">
                          {quizzes.map((quiz) => (
                            <Card key={quiz._id} className="hover:shadow-md transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                                    <CardDescription className="mt-2">{quiz.description}</CardDescription>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setViewingQuizSubmissions(quiz._id)}
                                    >
                                      View Results
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteQuiz(quiz._id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-4 text-sm">
                                  <div>
                                    <span className="font-semibold">Questions:</span> {quiz.questions?.length || 0}
                                  </div>
                                  <div>
                                    <span className="font-semibold">Total Marks:</span> {quiz.totalMarks}
                                  </div>
                                  <div>
                                    <span className="font-semibold">Duration:</span> {quiz.duration} min
                                  </div>
                                  <div>
                                    <span className="font-semibold">Passing:</span> {quiz.passingMarks} marks
                                  </div>
                                  <div>
                                    <span className="font-semibold">Due:</span> {new Date(quiz.dueDate).toLocaleDateString()}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                {/* Files Tab */}
                <TabsContent value="files">
                  <FileUpload
                    programId={selectedProgram!._id}
                    files={files}
                    onFileAdded={() => {
                      if (selectedProgram) {
                        fetchFiles(selectedProgram._id);
                      }
                    }}
                    isInstructor={true}
                  />
                </TabsContent>
                {/* Chat Tab */}
                <TabsContent value="chat">
                  <ChatComponent />
                </TabsContent>              </Tabs>
            )}
          </div>
        </div>
      )}
      <ChangePasswordDialog isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
    </div>
  );
}
