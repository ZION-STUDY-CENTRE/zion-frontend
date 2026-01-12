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
  createGroupConversation
} from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MessageCircle, Send, Trash2, Plus, X, Users } from 'lucide-react';
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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
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
      setConversations(prev => {
        const exists = prev.some(c => c._id === conversation._id);
        return exists ? prev : [conversation, ...prev];
      });
      setSelectedConversation(conversation);
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

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return conversation.name || 'Group Chat';
    }
    const otherParticipant = conversation.participants.find(p => p._id !== user?._id);
    return otherParticipant?.name || 'Unknown User';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <MessageCircle className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversation List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNewChat(true)}
                title="New Chat"
              >
                <Plus size={18} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowGroupChat(true)}
                title="Group Chat"
              >
                <Users size={18} />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <Input
            type="text"
            placeholder="Search conversations..."
            className="bg-gray-100"
          />
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map(conversation => (
              <div
                key={conversation._id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedConversation?._id === conversation._id
                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm truncate">
                    {getConversationName(conversation)}
                  </h3>
                  {conversation.isGroup && (
                    <Badge variant="secondary" className="text-xs">
                      Group
                    </Badge>
                  )}
                </div>
                {conversation.lastMessage && (
                  <p className="text-xs text-gray-600 truncate">
                    {conversation.lastMessage.text}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{getConversationName(selectedConversation)}</h2>
                {selectedConversation.isGroup && (
                  <p className="text-xs text-gray-500">
                    {selectedConversation.participants.length} members
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteConversation(selectedConversation._id)}
              >
                <Trash2 size={18} />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message._id}
                  className={`flex ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender._id === user?._id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {!selectedConversation.isGroup || message.sender._id === user?._id ? null : (
                      <p className="text-xs font-semibold mb-1">{message.sender.name}</p>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {typingUsers.size > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
                    <p className="text-xs">
                      {Array.from(typingUsers).join(', ')} is typing...
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                  <Send size={18} />
                </Button>
              </div>
              {!isConnected && (
                <p className="text-xs text-red-500 mt-2">⚠️ Reconnecting...</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Dialog */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Start New Chat</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewChat(false)}
                >
                  <X size={18} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {users.map(u => (
                  <div
                    key={u._id}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => handleStartChat(u._id)}
                  >
                    <p className="font-semibold text-sm">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {u.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Group Chat Dialog */}
      {showGroupChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Create Group Chat</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGroupChat(false)}
                >
                  <X size={18} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Group name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
              />
              <div className="space-y-2">
                <p className="text-sm font-semibold">Select members:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {users.map(u => (
                    <label key={u._id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(u._id)}
                        onChange={() => {
                          setSelectedUsers(prev =>
                            prev.includes(u._id)
                              ? prev.filter(id => id !== u._id)
                              : [...prev, u._id]
                          );
                        }}
                      />
                      <span className="text-sm">{u.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleCreateGroup}
                className="w-full"
                disabled={!groupName.trim() || selectedUsers.length < 2}
              >
                Create Group
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
