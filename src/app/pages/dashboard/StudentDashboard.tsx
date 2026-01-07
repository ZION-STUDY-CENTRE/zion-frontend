import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { CalendarIcon, BookOpenIcon, UserIcon, Lock } from "lucide-react";
import { ChangePasswordDialog } from "../../components/ChangePasswordDialog";

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

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
    fetchMyProgram();
  }, []);

  const fetchMyProgram = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/programs/student/my-program', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setProgram(data);
      } else {
        // If 404, it means not enrolled.
        if (response.status !== 404) {
             setError(data.msg || 'Failed to load program');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Server Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Portal</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Course Content Area */}
        <div className="lg:col-span-2 space-y-6">
            {loading ? (
                <Card><CardContent className="p-8">Loading your program...</CardContent></Card>
            ) : error ? (
                <Card className="border-red-200 bg-red-50"><CardContent className="p-8 text-red-600">{error}</CardContent></Card>
            ) : !program ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Not Enrolled</CardTitle>
                        <CardDescription>You are not currently enrolled in any active program. Please contact the administrator.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <Card className="border-l-4 border-l-primary shadow-md">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-black">{program.title}</CardTitle>
                            </div>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Active</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-700">{program.description || "No description available."}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
                            <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                <span>
                                    Instructors: {program.instructors && program.instructors.length > 0 
                                     ? program.instructors.map(i => i.name).join(', ') 
                                     : "TBA"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                <span>Enrolled: {user?.role === 'student' ? 'Active' : '-'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tabs for Materials/Assignments (Placeholder for now) */}
            {program && (
                <Tabs defaultValue="materials" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="materials">Learning Materials</TabsTrigger>
                        <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    </TabsList>
                    <TabsContent value="materials">
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Materials</CardTitle>
                                <CardDescription>Access your study guides and videos here.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-muted-foreground text-sm italic">No materials uploaded yet.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="assignments">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Assignments</CardTitle>
                                <CardDescription>View and submit your tasks.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm italic">No active assignments.</p>
                            </CardContent>
                        </Card>
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
