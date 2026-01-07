import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordDialog({ isOpen, onClose }: ChangePasswordDialogProps) {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    setLoading(true);
    setMsg(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
            currentPassword: passwords.current,
            newPassword: passwords.new
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setMsg({ type: 'success', text: 'Password changed successfully' });
        setPasswords({ current: '', new: '', confirm: '' });
        setTimeout(onClose, 2000);
      } else {
        setMsg({ type: 'error', text: data.msg || 'Failed to change password' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your account password safely.
            </DialogDescription>
          </DialogHeader>
          {msg && (
            <div className={`p-3 text-sm rounded ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {msg.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-pass">Current Password</Label>
              <Input 
                id="current-pass" 
                type="password"
                required
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pass">New Password</Label>
              <Input 
                id="new-pass" 
                type="password"
                required
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pass">Confirm New Password</Label>
              <Input 
                id="confirm-pass" 
                type="password"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              />
            </div>
            <DialogFooter>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}
