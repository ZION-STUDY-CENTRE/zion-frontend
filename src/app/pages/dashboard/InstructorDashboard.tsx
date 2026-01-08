import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Lock } from "lucide-react";
import { ChangePasswordDialog } from "../../components/ChangePasswordDialog";
import { getInstructorPrograms, getProgramStudents } from '../../services/api';

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
  const [loading, setLoading] = useState(true);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
    fetchMyPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      fetchStudents(selectedProgram._id);
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

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => setIsChangePasswordOpen(true)} variant="outline">
                <Lock className="w-4 h-4 mr-2" /> Change Password
            </Button>
            <Button onClick={logout} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
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

          {/* Main Content for Students in Selected Program */}
          <Card className="md:col-span-2">
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
                        )})}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
          </Card>
        </div>
      )}
      <ChangePasswordDialog isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
    </div>
  );
}
