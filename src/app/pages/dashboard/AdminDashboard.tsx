import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Pencil, Trash2, Plus, X, Lock, RefreshCw, Trash } from "lucide-react";
import { ChangePasswordDialog } from '../../components/ChangePasswordDialog';
import { NotificationBell } from '../../components/NotificationBell';
import { ProgramForm } from '../../components/dashboard/ProgramForm';
import { 
    Program, 
    getPrograms, 
    createProgram, 
    updateProgram, 
    deleteProgram,
    getUsers,
    getInstructorsList,
    registerUser,
    updateUser,
    reactivateUser,
    deleteUser
} from '../../services/api';

import { Pagination } from "../../components/Pagination";
import { showSuccess, showError, showConfirm } from '../../../utils/sweetAlert';
import { ChatComponent } from '../../components/ChatComponent';

interface UserSummary {
  _id: string;
  name: string;
  email: string;
  role: string;
  // For multi-program students
  programs?: Array<{
    program: { _id: string; title: string; name?: string };
    enrollmentDate?: string;
    duration?: number;
  }>;
  // Legacy fields for backward compatibility
  program?: { _id: string; title: string; name?: string };
  enrollmentDate?: string;
  programDuration?: number;
}

const ITEMS_PER_PAGE = 10;

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [instructors, setInstructors] = useState<UserSummary[]>([]);
  const [allUsers, setAllUsers] = useState<UserSummary[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Pagination States
  const [currentPagePrograms, setCurrentPagePrograms] = useState(1);
  const [currentPageAdmins, setCurrentPageAdmins] = useState(1);
  const [currentPageInstructors, setCurrentPageInstructors] = useState(1);
  const [currentPageMediaManagers, setCurrentPageMediaManagers] = useState(1);
  const [currentPageStudents, setCurrentPageStudents] = useState(1);

  // New Program State
  const [creatingProgram, setCreatingProgram] = useState(false);

  // New User State
  // For multi-program students: programs is an array of { program: id, duration: number }
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student', programs: [{ program: '', duration: 3 }] });
  const [registeringUser, setRegisteringUser] = useState(false);

  // Edit Program State
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Edit User State
  const [editingUser, setEditingUser] = useState<UserSummary | null>(null);
  // For editing student programs
  const [editUserForm, setEditUserForm] = useState({ name: '', email: '', newPassword: '', programs: [{ program: '', duration: 3 }] });
  
  // Reactivation & Deletion State
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false);
  const [userToReactivate, setUserToReactivate] = useState<UserSummary | null>(null);
  // For multi-program reactivation: array of { program, duration }
  const [reactivatePrograms, setReactivatePrograms] = useState<Array<{ program: string; duration: number }>>([{ program: '', duration: 3 }]);
  
  const [userToDelete, setUserToDelete] = useState<UserSummary | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);

  // Change Password State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Feedback State
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Filter State
  const [adminSearch, setAdminSearch] = useState('');
  
  const [instructorSearch, setInstructorSearch] = useState('');
  const [instructorProgramFilter, setInstructorProgramFilter] = useState('all');

  const [studentSearch, setStudentSearch] = useState('');
  const [studentProgramFilter, setStudentProgramFilter] = useState('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');

  useEffect(() => {
    fetchPrograms();
    fetchInstructors();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await getUsers();
      setAllUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchInstructors = async () => {
      try {
        const data = await getInstructorsList();
        setInstructors(data);
      } catch (error) {
        console.error("Failed to fetch instructors", error);
      }
  };

  const fetchPrograms = async () => {
    setLoadingPrograms(true);
    try {
      const data = await getPrograms();
      setPrograms(data);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to fetch programs' });
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleCreateProgram = async (data: Partial<Program>) => {
    setCreatingProgram(true);
    setMessage(null);
    try {
      
      await createProgram(data);
      
      setMessage({ type: 'success', text: 'Program created successfully!' });
      fetchPrograms(); 
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to create program' });
    } finally {
      setCreatingProgram(false);
    }
  };

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisteringUser(true);
    setMessage(null);
    try {

      const payload: any = { ...newUser };
      // Only send programs for students
      if (payload.role === 'student') {
        payload.programs = payload.programs.filter((p: any) => p.program);
      } else {
        delete payload.programs;
      }
      const data = await registerUser(payload);
      setMessage({ type: 'success', text: `User ${data.user.name} registered successfully with default password!` });
      setNewUser({ name: '', email: '', password: '', role: 'student', programs: [{ program: '', duration: 3 }] });
      fetchUsers(); // Refresh user list

    } catch (error: any) {
       console.error(error);
       setMessage({ type: 'error', text: error.message || 'Failed to register user' });
    } finally {
      setRegisteringUser(false);
    }
  };

  const openEditDialog = (program: Program) => {
    setEditingProgram(program);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProgram = async (data: Partial<Program>) => {
    if (!editingProgram) return;

    try {
      
      await updateProgram(editingProgram._id, data);
      
      setMessage({ type: 'success', text: 'Program updated successfully!' });
      setIsEditDialogOpen(false);
      fetchPrograms();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update program' });
    }
  };

  const handleDeleteProgram = async (id: string) => {
    const confirmed = await showConfirm('Delete Program', 'Are you sure you want to delete this program?', 'Yes, delete it', 'Cancel');
    if (!confirmed) return;
    try {
        
        await deleteProgram(id);
        showSuccess('Program deleted successfully');
        fetchPrograms();
    } catch (error: any) {
        showError('Failed to delete', error.message);
    }
  }



  const openEditUserDialog = (user: UserSummary) => {
    setEditingUser(user);
    // If student, prefill programs array for editing
    if (user.role === 'student') {
      setEditUserForm({
        name: user.name,
        email: user.email,
        newPassword: '',
        programs: user.programs && user.programs.length > 0
          ? user.programs.map(p => ({
              program: typeof p.program === 'string' ? p.program : p.program?._id || '',
              duration: p.duration || 3
            }))
          : [{ program: '', duration: 3 }]
      });
    } else {
      setEditUserForm({ name: user.name, email: user.email, newPassword: '', programs: [{ program: '', duration: 3 }] });
    }
    setIsEditUserDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const payload: any = { name: editUserForm.name, email: editUserForm.email };
      if (editUserForm.newPassword) payload.password = editUserForm.newPassword;
      // If student, include updated programs array
      if (editingUser.role === 'student') {
        payload.programs = editUserForm.programs.filter((p: any) => p.program);
      }
      await updateUser(editingUser._id, payload);
      setMessage({ type: 'success', text: 'User details updated successfully!' });
      fetchUsers();
      setIsEditUserDialogOpen(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update user' });
    }
  };

  const handleReactivateUser = async () => {
    if (!userToReactivate) return;
    try {
      if (userToReactivate.role === 'student') {
        // Send full programs array for multi-program reactivation
        const filtered = reactivatePrograms.filter(p => p.program);
        await reactivateUser(userToReactivate._id, undefined, filtered);
      } else {
        // For non-students, just send duration
        const duration = reactivatePrograms[0]?.duration || 3;
        await reactivateUser(userToReactivate._id, duration);
      }
      setMessage({ type: 'success', text: 'User reactivated successfully' });
      fetchUsers();
      setIsReactivateDialogOpen(false);
      setUserToReactivate(null);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to reactivate user' });
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;
    try {
        
        await deleteUser(userToDelete._id);

        setMessage({ type: 'success', text: 'User deleted successfully' });
        fetchUsers();
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
    } catch (error: any) {
        setMessage({ type: 'error', text: error.message || 'Failed to delete user' });
    }
  };

  const isUserActive = (user: UserSummary) => {
    if (user.role !== 'student') return true;
    // Multi-program logic: active if any program is active
    if (user.programs && user.programs.length > 0) {
      const status = getStudentProgramStatus(user);
      return Object.values(status).some(s => s.active);
    }
    // Fallback for legacy single-program students
    if (!user.enrollmentDate) return false;
    const duration = user.programDuration || 3;
    const enrollment = new Date(user.enrollmentDate);
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

  // Filter Functions
  const getFilteredAdmins = () => {
    return allUsers.filter(u => {
        if (u.role !== 'admin') return false;
        if (adminSearch && !u.name.toLowerCase().includes(adminSearch.toLowerCase()) && !u.email.toLowerCase().includes(adminSearch.toLowerCase())) return false;
        return true;
    });
  };

  const getFilteredInstructors = () => {
    return allUsers.filter(u => {
        if (u.role !== 'instructor') return false;
        if (instructorSearch && !u.name.toLowerCase().includes(instructorSearch.toLowerCase()) && !u.email.toLowerCase().includes(instructorSearch.toLowerCase())) return false;
        
        if (instructorProgramFilter !== 'all') {
            // Find programs where this user IS an instructor
            const programsTeaching = programs.filter(p => p.instructors?.some(i => {
                const iId = typeof i === 'string' ? i : i._id;
                return iId === u._id;
            }));
            const teachesSelected = programsTeaching.some(p => p._id === instructorProgramFilter);
            if (!teachesSelected) return false;
        }
        return true;
    });
  };

  // Returns a map of programId -> { active, enrollmentDate, duration }
  const getStudentProgramStatus = (user: UserSummary) => {
    if (user.role !== 'student' || !user.programs) return {};
    const now = new Date();
    const status: Record<string, { active: boolean; enrollmentDate?: string; duration?: number }> = {};
    user.programs.forEach(entry => {
      if (!entry.program?._id || !entry.enrollmentDate || !entry.duration) return;
      const enrollment = new Date(entry.enrollmentDate);
      const expiryDate = new Date(enrollment);
      const duration = entry.duration;
      const wholeMonths = Math.floor(duration);
      expiryDate.setMonth(expiryDate.getMonth() + wholeMonths);
      const fractionalMonths = duration - wholeMonths;
      if (fractionalMonths > 0) {
        const fractionalMs = fractionalMonths * 2592000000;
        expiryDate.setTime(expiryDate.getTime() + fractionalMs);
      }
      status[entry.program._id] = {
        active: now < expiryDate,
        enrollmentDate: entry.enrollmentDate,
        duration: entry.duration
      };
    });
    return status;
  };

  const getFilteredStudents = () => {
    return allUsers.filter(u => {
      if (u.role !== 'student') return false;
      // Search
      if (studentSearch && !u.name.toLowerCase().includes(studentSearch.toLowerCase()) && !u.email.toLowerCase().includes(studentSearch.toLowerCase())) return false;
      // Program Filter
      if (studentProgramFilter !== 'all') {
        // Match if any program matches
        if (!u.programs || !u.programs.some(p => p.program?._id === studentProgramFilter)) return false;
      }
      // Status Filter
      if (studentStatusFilter !== 'all') {
        // Active if any program is active
        const status = getStudentProgramStatus(u);
        const anyActive = Object.values(status).some(s => s.active);
        if (studentStatusFilter === 'active' && !anyActive) return false;
        if (studentStatusFilter === 'inactive' && anyActive) return false;
      }
      return true;
    });
  };

  // Helper for pagination slicing
  const paginate = (items: any[], pageNumber: number) => {
    const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm('Logout', 'Are you sure you want to logout?', 'Yes, logout', 'Cancel');
    if (confirmed) {
      await logout();
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPagePrograms, currentPageAdmins, currentPageInstructors, currentPageStudents, currentPageMediaManagers]);


  // When opening the Reactivate dialog, prefill with user's current programs
  useEffect(() => {
    if (isReactivateDialogOpen && userToReactivate && userToReactivate.role === 'student') {
      setReactivatePrograms(
        userToReactivate.programs && userToReactivate.programs.length > 0
          ? userToReactivate.programs.map(p => ({
              program: typeof p.program === 'string' ? p.program : p.program?._id || '',
              duration: p.duration || 3
            }))
          : [{ program: '', duration: 3 }]
      );
    }
  }, [isReactivateDialogOpen, userToReactivate]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2">Manage your institution from here.</p>
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

      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <Tabs defaultValue="programs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="users">Register Users</TabsTrigger>
          <TabsTrigger value="user-list">All Users</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="programs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Course Management</h2>
            <Button onClick={() => { setEditingProgram(null); setIsEditDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" /> Add Program
            </Button>
          </div>

            <Card>
              <CardHeader>
                <CardTitle>Existing Programs</CardTitle>
                <CardDescription>All active courses.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPrograms ? (
                  <p>Loading programs...</p>
                ) : programs.length === 0 ? (
                  <p className="text-muted-foreground">No programs found.</p>
                ) : (
                  <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginate(programs, currentPagePrograms).map((prog) => (
                        <TableRow key={prog._id}>
                          <TableCell className="font-medium">{prog.title}</TableCell>
                          <TableCell>{prog.category}</TableCell>
                          <TableCell>{prog.keyStats?.duration || 'N/A'}</TableCell>
                          <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(prog)}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteProgram(prog._id)} className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                              </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Moved Pagination OUTSIDE Table */}
                  <div className="mt-4">
                    <Pagination 
                      currentPage={currentPagePrograms}
                      totalPages={Math.ceil(programs.length / ITEMS_PER_PAGE)}
                      onPageChange={setCurrentPagePrograms}
                    />
                  </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProgram ? 'Edit Program' : 'Create New Program'}</DialogTitle>
                        <DialogDescription>{editingProgram ? 'Update course details' : 'Add a new course to the catalog'}</DialogDescription>
                    </DialogHeader>
                    {/* Key prop ensures form resets when switching between add/edit or different programs */}
                    <ProgramForm 
                        key={editingProgram ? editingProgram._id : 'new'}
                        initialData={editingProgram || undefined} 
                        onSubmit={editingProgram ? (data) => handleUpdateProgram(data) : handleCreateProgram}
                        onCancel={() => setIsEditDialogOpen(false)}
                        isLoading={creatingProgram}
                        availableInstructors={instructors}
                    />
                </DialogContent>
            </Dialog>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Register New User</CardTitle>
              <CardDescription>Add a new student, instructor, or admin to the system.</CardDescription>
            </CardHeader>
            <CardContent className="max-w-2xl">
              <form onSubmit={handleRegisterUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input 
                      id="user-name" 
                      placeholder="John Doe" 
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email Address</Label>
                    <Input 
                      id="user-email" 
                      type="email"
                      placeholder="john@example.com" 
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-pass">Initial Password</Label>
                    <Input 
                      id="user-pass" 
                      type="text"
                      value="zion123"
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Default password for all new users.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Role</Label>
                    <Select onValueChange={(val) => setNewUser({...newUser, role: val})} defaultValue={newUser.role}>
                      <SelectTrigger id="user-role">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="media-manager">Media Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newUser.role === 'student' && (
                  <>
                  <Label>Enroll in Programs</Label>
                  {newUser.programs.map((entry, idx) => (
                    <div key={idx} className="flex gap-2 items-end mb-2">
                      <div className="flex-1">
                        <Select value={entry.program} onValueChange={val => {
                          const updated = [...newUser.programs];
                          updated[idx].program = val;
                          setNewUser({ ...newUser, programs: updated });
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Program" />
                          </SelectTrigger>
                          <SelectContent>
                            {programs.map(prog => (
                              <SelectItem key={prog._id} value={prog._id}>{prog.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-32">
                        <Input
                          type="number"
                          step="any"
                          min={1}
                          value={entry.duration}
                          onChange={e => {
                            const updated = [...newUser.programs];
                            updated[idx].duration = parseFloat(e.target.value);
                            setNewUser({ ...newUser, programs: updated });
                          }}
                          placeholder="Duration (mo)"
                        />
                      </div>
                      <Button type="button" variant="ghost" onClick={() => {
                        setNewUser({ ...newUser, programs: newUser.programs.filter((_, i) => i !== idx) });
                      }} disabled={newUser.programs.length === 1}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => setNewUser({ ...newUser, programs: [...newUser.programs, { program: '', duration: 3 }] })}>
                    <Plus className="w-4 h-4 mr-1" /> Add Program
                  </Button>
                  </>
                )}

                <Button type="submit" className="w-full md:w-auto" disabled={registeringUser}>
                  {registeringUser ? 'Registering...' : 'Register User'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-list">
          <Tabs defaultValue="admins" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">User Directory</h2>
              <TabsList>
                <TabsTrigger value="admins">Admins</TabsTrigger>
                <TabsTrigger value="media-managers">Media Managers</TabsTrigger>
                <TabsTrigger value="instructors">Instructors</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
              </TabsList>
            </div>

            {loadingUsers ? (
              <p>Loading users...</p>
            ) : (
              <>
                {/* Admins Tab */}
                <TabsContent value="admins">
                   <Card>
                    <CardHeader>
                      <CardTitle>Administrators</CardTitle>
                      <CardDescription>Users with full system access.</CardDescription>
                      <div className="flex items-center space-x-2 pt-4">
                        <Input 
                            placeholder="Search admins by name or email..." 
                            value={adminSearch}
                            onChange={(e) => setAdminSearch(e.target.value)}
                            className="max-w-sm"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredAdmins().length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-4">No admins found</TableCell></TableRow>
                          ) : paginate(getFilteredAdmins(), currentPageAdmins).map((u) => (
                            <TableRow key={u._id}>
                              <TableCell className="font-medium">{u.name}</TableCell>
                              <TableCell>{u.email}</TableCell>
                              <TableCell><Badge variant="destructive">Admin</Badge></TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => openEditUserDialog(u)}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Pagination 
                        currentPage={currentPageAdmins}
                        totalPages={Math.ceil(getFilteredAdmins().length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPageAdmins}
                      />
                    </CardContent>
                   </Card>
                </TabsContent>

                {/* Media Managers Tab */}
                <TabsContent value="media-managers">
                   <Card>
                    <CardHeader>
                      <CardTitle>Media Managers</CardTitle>
                      <CardDescription>Users with content management access.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allUsers.filter(u => u.role === 'media-manager').length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-4">No media managers found</TableCell></TableRow>
                          ) : paginate(allUsers.filter(u => u.role === 'media-manager'), currentPageMediaManagers).map((u) => (
                            <TableRow key={u._id}>
                              <TableCell className="font-medium">{u.name}</TableCell>
                              <TableCell>{u.email}</TableCell>
                              <TableCell><Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Media Manager</Badge></TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openEditUserDialog(u)}>
                                        <Pencil className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => {
                                        setUserToDelete(u);
                                        setIsDeleteDialogOpen(true);
                                    }}>
                                        <Trash className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Pagination 
                        currentPage={currentPageMediaManagers}
                        totalPages={Math.ceil(allUsers.filter(u => u.role === 'media-manager').length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPageMediaManagers}
                      />
                    </CardContent>
                   </Card>
                </TabsContent>

                {/* Instructors Tab */}
                <TabsContent value="instructors">
                   <Card>
                    <CardHeader>
                      <CardTitle>Instructors</CardTitle>
                      <CardDescription>Teachers and program facilitators.</CardDescription>
                      <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <Input 
                            placeholder="Search instructors..." 
                            value={instructorSearch}
                            onChange={(e) => setInstructorSearch(e.target.value)}
                            className="max-w-sm"
                        />
                         <Select value={instructorProgramFilter} onValueChange={setInstructorProgramFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by Program" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Programs</SelectItem>
                                {programs.map(prog => (
                                    <SelectItem key={prog._id} value={prog._id}>{prog.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredInstructors().length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center py-4">No instructors found</TableCell></TableRow>
                          ) : paginate(getFilteredInstructors(), currentPageInstructors).map((u) => (
                            <TableRow key={u._id}>
                              <TableCell className="font-medium">{u.name}</TableCell>
                              <TableCell>{u.email}</TableCell>
                              <TableCell><Badge variant="default">Instructor</Badge></TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openEditUserDialog(u)}>
                                        <Pencil className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => {
                                        setUserToDelete(u);
                                        setIsDeleteDialogOpen(true);
                                    }}>
                                        <Trash className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Pagination 
                        currentPage={currentPageInstructors}
                        totalPages={Math.ceil(getFilteredInstructors().length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPageInstructors}
                      />
                    </CardContent>
                   </Card>
                </TabsContent>

                {/* Students Tab */}
                <TabsContent value="students">
                   <Card>
                    <CardHeader>
                      <CardTitle>Students</CardTitle>
                      <CardDescription>Currently enrolled students.</CardDescription>
                      <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <Input 
                            placeholder="Search students..." 
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            className="max-w-sm"
                        />
                         <Select value={studentProgramFilter} onValueChange={setStudentProgramFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by Program" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Programs</SelectItem>
                                {programs.map(prog => (
                                    <SelectItem key={prog._id} value={prog._id}>{prog.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         <Select value={studentStatusFilter} onValueChange={setStudentStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Program</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredStudents().length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-4">No students found</TableCell></TableRow>
                          ) : paginate(getFilteredStudents(), currentPageStudents).map((u) => {
                            const active = isUserActive(u);
                            return (
                            <TableRow key={u._id}>
                              <TableCell className="font-medium">{u.name}</TableCell>
                              <TableCell>{u.email}</TableCell>
                              <TableCell>
                                {u.programs && u.programs.length > 0 ? (
                                  <ul className="list-disc ml-4">
                                    {u.programs.map((p: { program: string | { _id: string; title: string }; duration?: number }, i: number) => {
                                      // Find the full program object from the loaded programs list
                                      const progObj = programs.find(prog => prog._id === (typeof p.program === 'string' ? p.program : p.program?._id));
                                      return (
                                        <li className='my-3' key={progObj?._id || (typeof p.program === 'string' ? p.program : p.program?._id) || i}>
                                          {progObj?.title || (typeof p.program !== 'string' && p.program?.title) || 'Unknown'}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                ) : <span className="text-muted-foreground italic">Not Enrolled</span>}
                              </TableCell>
                              <TableCell>
                                {u.programs && u.programs.length > 0 ? (
                                  <ul className="ml-2">
                                    {(u.programs as Array<{ program: { _id: string; title: string; name?: string }; duration?: number; enrollmentDate?: string }> ).map((p, i) => {
                                      const status = getStudentProgramStatus(u)[p.program?._id];
                                      return (
                                        <li className='my-3' key={p.program?._id || i}>
                                          <Badge variant={status?.active ? 'default' : 'destructive'}>
                                            {status?.active ? 'Active' : 'Inactive'}
                                          </Badge>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                ) : <Badge variant="destructive">Inactive</Badge>}
                              </TableCell>
                              <TableCell><Badge variant="secondary">Student</Badge></TableCell>
                              <TableCell className=" gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openEditUserDialog(u)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Reactivate" onClick={() => {
                                    setUserToReactivate(u);
                                    setIsReactivateDialogOpen(true);
                                }}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => {
                                    setUserToDelete(u);
                                    setIsDeleteDialogOpen(true);
                                }}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )})}
                        </TableBody>
                      </Table>
                      <Pagination 
                        currentPage={currentPageStudents}
                        totalPages={Math.ceil(getFilteredStudents().length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPageStudents}
                      />
                    </CardContent>
                   </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <ChatComponent />
        </TabsContent>
      </Tabs>



      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details, password, and (for students) enrolled programs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-user-name">Full Name</Label>
              <Input
                id="edit-user-name"
                value={editUserForm.name}
                onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-user-email">Email Address</Label>
              <Input
                id="edit-user-email"
                value={editUserForm.email}
                onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
              />
            </div>
            {/* Student program editing UI */}
            {editingUser?.role === 'student' && (
              <div className="border-t pt-4 mt-2">
                <h3 className="text-sm font-medium text-blue-700 mb-2">Enrolled Programs</h3>
                {editUserForm.programs.map((entry, idx) => (
                  <div key={idx} className="flex gap-2 items-end mb-2">
                    <div className="flex-1">
                      <Select value={entry.program} onValueChange={val => {
                        const updated = [...editUserForm.programs];
                        updated[idx].program = val;
                        setEditUserForm({ ...editUserForm, programs: updated });
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                        <SelectContent>
                          {programs.map(prog => (
                            <SelectItem key={prog._id} value={prog._id}>{prog.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        step="any"
                        min={1}
                        value={entry.duration}
                        onChange={e => {
                          const updated = [...editUserForm.programs];
                          updated[idx].duration = parseFloat(e.target.value);
                          setEditUserForm({ ...editUserForm, programs: updated });
                        }}
                        placeholder="Duration (mo)"
                      />
                    </div>
                    <Button type="button" variant="ghost" onClick={() => {
                      setEditUserForm({ ...editUserForm, programs: editUserForm.programs.filter((_, i) => i !== idx) });
                    }} disabled={editUserForm.programs.length === 1}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => setEditUserForm({ ...editUserForm, programs: [...editUserForm.programs, { program: '', duration: 3 }] })}>
                  <Plus className="w-4 h-4 mr-1" /> Add Program
                </Button>
              </div>
            )}
            <div className="border-t pt-4 mt-2">
              <h3 className="text-sm font-medium text-red-600 mb-2">Reset Password</h3>
              <div className="grid gap-2">
                <Label htmlFor="edit-user-pass">New Password (Optional)</Label>
                <Input
                  id="edit-user-pass"
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={editUserForm.newPassword}
                  onChange={(e) => setEditUserForm({ ...editUserForm, newPassword: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Only enter a value if you want to change the user's password.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reactivate User Dialog */}
      <Dialog open={isReactivateDialogOpen} onOpenChange={setIsReactivateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reactivate Student</DialogTitle>
            <DialogDescription>
              This will reset the student's enrollment status and extend their access for each course.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {userToReactivate?.role === 'student' ? (
              <>
                <Label>Set Duration for Each Program</Label>
                {reactivatePrograms.map((entry, idx) => (
                  <div key={idx} className="flex gap-2 items-end mb-2">
                    <div className="flex-1">
                      <Select value={entry.program} onValueChange={val => {
                        const updated = [...reactivatePrograms];
                        updated[idx].program = val;
                        setReactivatePrograms(updated);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                        <SelectContent>
                          {programs.map(prog => (
                            <SelectItem key={prog._id} value={prog._id}>{prog.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        step="any"
                        min={1}
                        value={entry.duration}
                        onChange={e => {
                          const updated = [...reactivatePrograms];
                          updated[idx].duration = parseFloat(e.target.value);
                          setReactivatePrograms(updated);
                        }}
                        placeholder="Duration (mo)"
                      />
                    </div>
                    <Button type="button" variant="ghost" onClick={() => {
                      setReactivatePrograms(reactivatePrograms.filter((_, i) => i !== idx));
                    }} disabled={reactivatePrograms.length === 1}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => setReactivatePrograms([...reactivatePrograms, { program: '', duration: 3 }])}>
                  <Plus className="w-4 h-4 mr-1" /> Add Program
                </Button>
              </>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="reactivate-duration">New Duration (Months)</Label>
                <Input
                  id="reactivate-duration"
                  type="number"
                  step="any"
                  value={reactivatePrograms[0]?.duration || 3}
                  onChange={(e) => setReactivatePrograms([{ program: '', duration: parseFloat(e.target.value) }])}
                  placeholder="3"
                />
                <p className="text-sm text-muted-foreground">
                  Enter decimal values for minutes/seconds logic if needed.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReactivateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReactivateUser}>Reactivate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>User: <strong>{userToDelete?.name}</strong> ({userToDelete?.email})</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUserConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ChangePasswordDialog isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
    </div>
  );
}
