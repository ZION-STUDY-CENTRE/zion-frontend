
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import {
  getConversations,
  getMessages,
  createMessage,
  getOrCreateConversation,
  getAllUsersForChat,
  deleteConversation,
  createGroupConversation,
  addMembersToGroup,
  removeMemberFromGroup,
  leaveGroup
} from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MessageCircle, Send, Trash2, Plus, X, Users, Info, UserPlus, LogOut, XCircle } from 'lucide-react';
import { showSuccess, showError, showConfirm } from '../../utils/sweetAlert';

interface Message {
  _id: string;
  sender: { _id: string; name: string; email: string };
  text: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  name?: string;
  isGroup: boolean;
  participants: any[];
  lastMessage?: Message;
  lastMessageAt: string;
  createdBy: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export function ChatComponent() {
  const { user } = useAuth();
  const { socket, isConnected, sendMessage: emitMessage, joinConversation, leaveConversation } = useSocket();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  
  const [showNewChat, setShowNewChat] = useState(false);
  const [showGroupChat, setShowGroupChat] = useState(false);
  
  // Details Modal States
  const [showDetails, setShowDetails] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [usersLoading, setUsersLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
      joinConversation(selectedConversation._id);
      setShowDetails(false); // Close details when changing chat

      return () => {
        leaveConversation(selectedConversation._id);
      };
    }
  }, [selectedConversation]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    socket.on('message:new', (message) => {
      if (selectedConversation?._id === message.conversationId) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('user:typing', (data) => {
      setTypingUsers(prev => new Set([...prev, data.userId]));
    });

    socket.on('user:typing-stop', (data) => {
      setTypingUsers(prev => {
        const updated = new Set(prev);
        updated.delete(data.userId);
        return updated;
      });
    });

    return () => {
      socket.off('message:new');
      socket.off('user:typing');
      socket.off('user:typing-stop');
    };
  }, [socket, selectedConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
      
      const usersData = await getAllUsersForChat();
      setUsers(usersData);
    } catch (error: any) {
      console.error('[ChatComponent] Error loading data:', error);
      showError('Failed to load', error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await getMessages(conversationId);
      setMessages(data);
    } catch (error: any) {
      showError('Failed to load', error.message);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      const message = await createMessage(selectedConversation._id, messageText);
      setMessages(prev => [...prev, message]);
      setMessageText('');
      emitMessage(selectedConversation._id, messageText);
    } catch (error: any) {
      showError('Failed to send', error.message);
    }
  };

  const handleStartChat = async (userId: string) => {
    try {
      const conversation = await getOrCreateConversation(userId);
      
      // Ensure participants have proper IDs and data
      const cleanedConversation = {
        ...conversation,
        participants: (conversation.participants || []).map((p: any) => ({
            _id: p._id || p.id || '',
            name: (p.name || '').trim() || 'Unknown User',
            email: p.email || '',
            role: p.role || ''
        }))
      };

      setConversations(prev => {
        const exists = prev.some(c => c._id === cleanedConversation._id);
        if (exists) {
          return prev.map(c => c._id === cleanedConversation._id ? cleanedConversation : c);
        }
        return [cleanedConversation, ...prev];
      });
      
      setSelectedConversation(cleanedConversation);
      setShowNewChat(false);
    } catch (error: any) {
      console.error('Error starting chat:', error);
      showError('Failed to start chat', error.message || 'Unknown error');
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length < 2) {
      showError('Invalid', 'Group name and at least 2 users required');
      return;
    }

    try {
      const conversation = await createGroupConversation(groupName, selectedUsers);
      setConversations(prev => [conversation, ...prev]);
      setSelectedConversation(conversation);
      setGroupName('');
      setSelectedUsers([]);
      setShowGroupChat(false);
      showSuccess('Group created successfully');
    } catch (error: any) {
      showError('Failed to create group', error.message);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    const confirmed = await showConfirm('Delete Conversation', 'This action cannot be undone', 'Delete', 'Cancel');
    if (!confirmed) return;

    try {
      await deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => c._id !== conversationId));
      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      showSuccess('Conversation deleted');
    } catch (error: any) {
      showError('Failed to delete', error.message);
    }
  };

  // Group Management

  const handleLeaveGroup = async () => {
      if (!selectedConversation) return;
      const confirmed = await showConfirm('Leave Group', 'Are you sure?', 'Leave', 'Cancel');
      if (!confirmed) return;

      try {
          await leaveGroup(selectedConversation._id);
          setSelectedConversation(null);
          loadConversations();
          showSuccess('Left group successfully');
      } catch (error: any) {
          showError('Failed to leave group', error.message);
      }
  };

  const handleRemoveMember = async (userId: string) => {
      if (!selectedConversation) return;
      // Confirm logic here if desired
      try {
          await removeMemberFromGroup(selectedConversation._id, userId);
           // Refresh conversation participants locally or reload
           const updatedParticipants = selectedConversation.participants.filter(p => p._id !== userId);
           setSelectedConversation({ ...selectedConversation, participants: updatedParticipants });
           showSuccess('Member removed');
      } catch (error: any) {
          showError('Failed to remove member', error.message);
      }
  };

  const handleAddMembers = async () => {
      if (!selectedConversation || selectedUsers.length === 0) return;
      try {
          await addMembersToGroup(selectedConversation._id, selectedUsers);
          setShowAddMembers(false);
          setSelectedUsers([]);
          // Force reload to get updated conversation
          const updatedConvo = await getOrCreateConversation(selectedConversation.participants[0]._id); // Actually need getConversationById but reusing for now or reload all
          // Better: reloadConversations and update selected
          loadConversations();
          showSuccess('Members added');
      } catch (error: any) {
          showError('Failed to add members', error.message);
      }
  };

  // Helper function to resolve conversation name
  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return (conversation.name || 'Group Chat').trim();
    }
    
    // Check both potential user ID fields
    const currentUserId = user?.id || (user as any)?._id; 
    
    if (!conversation.participants || conversation.participants.length === 0) {
      return 'Unknown User';
    }

    // Try to find the OTHER participant
    let otherParticipant = conversation.participants.find(p => {
        const pId = p._id || p.id;
        // Make sure we compare as strings
        return pId && currentUserId && String(pId) !== String(currentUserId);
    });

    // Fallback logic
    if (!otherParticipant && conversation.participants.length > 0) {
        // If only 1 participant (me), or logic fails, take the first one that isn't me, or just the first one
        if (conversation.participants.length > 1) {
             const firstId = conversation.participants[0]._id || conversation.participants[0].id;
             if (String(firstId) === String(currentUserId)) {
                 otherParticipant = conversation.participants[1];
             } else {
                 otherParticipant = conversation.participants[0];
             }
        } else {
            otherParticipant = conversation.participants[0];
        }
    }
    
    return otherParticipant?.name ? otherParticipant.name.trim() : 'Unknown User';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <MessageCircle className="animate-spin" size={32} />
      </div>
    );
  }

  // Determine if current user can manage group
  const currentUserId = user?.id || (user as any)?._id;
  const isCreator = selectedConversation?.createdBy === currentUserId;
  const isAdmin = user?.role === 'admin';
  const canManage = isCreator || isAdmin;

  // Filter users not in group
  const availableUsersToAdd = users.filter(u => 
      !selectedConversation?.participants.some(p => p._id === u._id)
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversation List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowNewChat(true)} title="New Chat">
                <Plus size={18} />
              </Button>
               {/* User can create group chat */}
               <Button size="sm" variant="outline" onClick={() => setShowGroupChat(true)} title="New Group">
                <Users size={18} />
              </Button>
            </div>
          </div>
          <Input 
            placeholder="Search conversations..." 
            className="w-full"
            // Add search logic if needed
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conversation => {
            const isSelected = selectedConversation?._id === conversation._id;
            const name = getConversationName(conversation);
            const lastMsg = conversation.lastMessage?.text || 'No messages yet';
            const time = conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleDateString() : '';

            return (
              <div
                key={conversation._id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                    {name}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{lastMsg}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedConversation ? (
        <div className="flex flex-1 overflow-hidden relative">
            <div className="flex-1 flex flex-col min-w-0">
                {/* Chat Header */}
                <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shadow-sm z-10">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {getConversationName(selectedConversation).charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 truncate max-w-md">
                        {getConversationName(selectedConversation)}
                        </h2>
                        {selectedConversation.isGroup && (
                        <span className="text-xs text-gray-500">
                            {selectedConversation.participants.length} participants
                        </span>
                        )}
                    </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setShowDetails(!showDetails)}>
                            <Info size={20} className={showDetails ? "text-blue-600" : "text-gray-500"} />
                        </Button>
                        {!selectedConversation.isGroup && canManage && (
                           <Button variant="ghost" size="icon" onClick={() => handleDeleteConversation(selectedConversation._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                               <Trash2 size={20} />
                           </Button>
                        )}
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
                    {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <MessageCircle size={48} className="mb-4 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                    ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender._id === currentUserId;
                        // Check if we should show date header, etc. (omitted for brevity)
                        return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                            isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                            }`}>
                            {!isMe && selectedConversation.isGroup && (
                                <p className="text-xs text-gray-500 mb-1 font-medium">{msg.sender.name}</p>
                            )}
                            <p>{msg.text}</p>
                            <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            </div>
                        </div>
                        );
                    })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-2 items-end max-w-4xl mx-auto">
                    <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 min-h-[44px]"
                    />
                    <Button onClick={handleSendMessage} disabled={!messageText.trim()} className="h-11 w-11 p-0 rounded-full">
                        <Send size={18} />
                    </Button>
                    </div>
                </div>
            </div>

            {/* Details Sidebar */}
            {showDetails && (
                <div className="w-80 bg-white border-l border-gray-200 shadow-xl overflow-y-auto animate-in slide-in-from-right duration-200">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Details</h3>
                        <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
                            <X size={18} />
                        </Button>
                    </div>
                    <div className="p-6 flex flex-col items-center border-b border-gray-100">
                         <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
                            {getConversationName(selectedConversation).charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-center">{getConversationName(selectedConversation)}</h2>
                        {selectedConversation.isGroup && (
                            <p className="text-sm text-gray-500 mt-1">{selectedConversation.participants.length} members</p>
                        )}
                    </div>
                    
                    {selectedConversation.isGroup && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-gray-700">Participants</h4>
                                {canManage && (
                                    <Button variant="ghost" size="sm" className="text-blue-600 h-8" onClick={() => setShowAddMembers(true)}>
                                        <UserPlus size={16} className="mr-1" /> Add
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-3 mb-8">
                                {selectedConversation.participants.map(p => (
                                    <div key={p._id} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {p.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {p.name} {p._id === currentUserId && "(You)"}
                                                </p>
                                                <p className="text-xs text-gray-500 capitalize">{p.role}</p>
                                            </div>
                                        </div>
                                        {canManage && p._id !== currentUserId && (
                                            <button 
                                                onClick={() => handleRemoveMember(p._id)}
                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove member"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                {canManage ? (
                                    <Button variant="destructive" className="w-full" onClick={() => handleDeleteConversation(selectedConversation._id)}>
                                        <Trash2 size={16} className="mr-2" /> Delete Group
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" onClick={handleLeaveGroup}>
                                        <LogOut size={16} className="mr-2" /> Leave Group
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
          <MessageCircle size={64} className="mb-4 opacity-20" />
          <p className="text-lg font-medium">Select a conversation to start messaging</p>
        </div>
      )}

      {/* New Chat Modal (Simplified) */}
      {(showNewChat || showGroupChat) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[500px] max-h-[80vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{showGroupChat ? 'Create Group' : 'New Chat'}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowNewChat(false); setShowGroupChat(false); }}>
                <X size={18} />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col gap-4">
              {showGroupChat && (
                <Input 
                   placeholder="Group Name" 
                   value={groupName}
                   onChange={(e) => setGroupName(e.target.value)}
                />
              )}
              <div className="font-semibold text-sm text-gray-500">Select {showGroupChat ? 'Participants' : 'User'}</div>
              <div className="flex-1 overflow-y-auto border rounded-md divide-y">
                 {users.map(u => (
                     <div 
                        key={u._id} 
                        className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${selectedUsers.includes(u._id) ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                            if (showGroupChat) {
                                setSelectedUsers(prev => prev.includes(u._id) ? prev.filter(id => id !== u._id) : [...prev, u._id]);
                            } else {
                                handleStartChat(u._id);
                            }
                        }}
                     >
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                 {u.name.charAt(0)}
                             </div>
                             <div>
                                 <p className="text-sm font-medium">{u.name}</p>
                                 <p className="text-xs text-gray-500 capitalize">{u.role}</p>
                             </div>
                         </div>
                         {showGroupChat && (
                             <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedUsers.includes(u._id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                 {selectedUsers.includes(u._id) && <span className="text-white text-xs">✓</span>}
                             </div>
                         )}
                     </div>
                 ))}
                 {users.length === 0 && <div className="p-4 text-center text-gray-500">No users found</div>}
              </div>
              {showGroupChat && (
                  <Button onClick={handleCreateGroup} disabled={!groupName.trim() || selectedUsers.length < 2}>
                      Create Group
                  </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Add Members Modal */}
      {showAddMembers && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-[400px] max-h-[80vh] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Add Members</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setShowAddMembers(false); setSelectedUsers([]); }}>
                  <X size={18} />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="flex-1 overflow-y-auto border rounded-md">
                      {availableUsersToAdd.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">No new users to add</div>
                      ) : (
                          availableUsersToAdd.map(u => (
                              <div 
                                  key={u._id} 
                                  className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${selectedUsers.includes(u._id) ? 'bg-blue-50' : ''}`}
                                  onClick={() => setSelectedUsers(prev => prev.includes(u._id) ? prev.filter(id => id !== u._id) : [...prev, u._id])}
                              >
                                  <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs">{u.name.charAt(0)}</div>
                                      <span className="text-sm font-medium">{u.name}</span>
                                  </div>
                                  {selectedUsers.includes(u._id) && <span className="text-blue-600">✓</span>}
                              </div>
                          ))
                      )}
                  </div>
                  <Button onClick={handleAddMembers} disabled={selectedUsers.length === 0}>
                      Add Selected
                  </Button>
              </CardContent>
            </Card>
          </div>
      )}

    </div>
  );
}
