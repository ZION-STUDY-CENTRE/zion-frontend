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
import { getInstructorPrograms, getProgramStudents, getAssignments, getQuizzes, getFileResources, deleteAssignment, deleteQuiz, getAssignmentSubmissions } from '../../services/api';
import { AssignmentForm } from '../../components/dashboard/AssignmentForm';
import { QuizForm } from '../../components/dashboard/QuizForm';
import { FileUpload } from '../../components/dashboard/FileUpload';
import { SubmissionView } from '../../components/dashboard/SubmissionView';
import { ChatComponent } from '../../components/ChatComponent';

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

  useEffect(() => {
    fetchMyPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      fetchStudents(selectedProgram._id);
      fetchAssignments(selectedProgram._id);
      fetchQuizzes(selectedProgram._id);
      fetchFiles(selectedProgram._id);
    }
  }, [selectedProgram]);

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
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAssignments = async (programId: string) => {
    try {
      const data = await getAssignments(programId);
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchQuizzes = async (programId: string) => {
    try {
      const data = await getQuizzes(programId);
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
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
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="students">Students</TabsTrigger>
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
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {students.map((student) => {
                              const active = isUserActive(student);
                              return (
                                <TableRow key={student._id}>
                                  <TableCell className="font-medium">{student.name}</TableCell>
                                  <TableCell>{student.email}</TableCell>
                                  <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    <Badge variant={active ? "default" : "destructive"} className={active ? "bg-green-100 hover:bg-green-700" : ""}>
                                      {active ? "Active" : "Inactive"}
                                    </Badge>
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
