/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSocketStore } from '@/features/messaging/model/socket.store';
import { useNotificationStore } from '@/stores/notificationStore';
import { talentXApi } from '@/shared/api/talentXApi';
import { Button } from "@/shared/components/ui/button";
import { MessageSquare, Users, Clock } from 'lucide-react';
import { User } from '@/shared/types';
import { toast } from 'sonner';

interface MessagesViewProps {
    user: User;
    initialShowSupport?: boolean;
}

export const MessagesView = ({ user, initialShowSupport = false }: MessagesViewProps) => {
    const queryClient = useQueryClient();
    const { lastMessage, unreadCount } = useNotificationStore();
    const { sendMessage, isConnected } = useSocketStore();
    // Default to Support tab for non-admin users since they can't access General
    const [showSupport, setShowSupport] = useState(user?.role === 'admin' || user?.role === 'core_team' ? initialShowSupport : true);
    const [selectedThreadUser, setSelectedThreadUser] = useState<string | null>(null);

    // Use admin user ID from seed (only needed for admin/core_team users)
    const ADMIN_USER_ID = '67a52004-635b-4c37-9415-9f9d64a943cf';

    // WebSocket is now handled by SocketProvider

    const { data: currentMessages, isLoading: messagesLoading } = useQuery({
        queryKey: ['messages', showSupport, selectedThreadUser],
        queryFn: async () =>
            talentXApi.entities.Message.list({
                isSupport: showSupport,
                userId: showSupport && user?.role === 'admin' ? selectedThreadUser : undefined,
            }),
    });

    const messageCount = useMemo(() => currentMessages?.length || 0, [currentMessages]);

    // Handle incoming messages via WebSocket
    useEffect(() => {
        if (lastMessage) {
            const newMsg = lastMessage;
            const isRelevant = showSupport
                ? newMsg.isSupport &&
                  (user.role === 'admin'
                      ? newMsg.senderId === selectedThreadUser ||
                        newMsg.receiverId === selectedThreadUser
                      : true)
                : !newMsg.isSupport;

            if (isRelevant) {
                // Instantly update the list in cache
                queryClient.setQueryData(
                    ['messages', showSupport, selectedThreadUser],
                    (old: any) => {
                        if (!old) return [newMsg];
                        // Avoid duplicates
                        if (old.find((m: any) => m.id === newMsg.id)) return old;
                        return [...old, newMsg];
                    }
                );
            }
            // Always invalidate unread-counts
            queryClient.invalidateQueries({ queryKey: ['unread-counts'] });

            // If admin, update threads list
            if (user.role === 'admin' && showSupport) {
                queryClient.invalidateQueries({ queryKey: ['support-threads'] });
            }
        }
    }, [lastMessage, showSupport, selectedThreadUser, queryClient, user.role]);

    // Unread count is now handled by WebSocket via useNotificationStore

    const markReadMutation = useMutation({
        mutationFn: async (params: { isSupport: boolean; threadUserId?: string }) =>
            talentXApi.entities.Message.markRead(params),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['unread-counts'] }),
    });

    // Mark as read when viewing messages
    React.useEffect(() => {
        if (!messagesLoading && currentMessages && messageCount > 0) {
            markReadMutation.mutate({
                isSupport: showSupport,
                threadUserId:
                    showSupport && user?.role === 'admin'
                        ? selectedThreadUser || undefined
                        : undefined,
            });
        }
    }, [showSupport, selectedThreadUser, messageCount, messagesLoading]);

    const { data: supportThreads } = useQuery({
        queryKey: ['support-threads'],
        queryFn: async () => talentXApi.entities.Message.list({ isSupport: true, type: 'threads' }),
        enabled: showSupport && user?.role === 'admin',
    });

    const sendMessageMutation = useMutation({
        mutationFn: async (data: any) => {
            // Priority 1: Try WebSocket (Real-time)
            // We check 'isConnected' AND the result of 'sendMessage' (boolean).
            // If sendMessage returns false, the socket is not ready/open, so we default to REST.
            if (isConnected) {
                const sent = sendMessage(data.receiver_id, data.content, data.isSupport);
                if (sent) {
                    return { status: 'ws_sent' };
                }
            }
            // Priority 2: Fallback to REST API
            // This ensures message delivery even if the socket is disconnected or fails silently.
            // We do NOT show a socket error toast here to avoid confusing the user if REST succeeds.
            return talentXApi.entities.Message.create(data);
        },
        onSuccess: (res: any) => {
            if (res?.status !== 'ws_sent') {
                // If we fell back to REST, we must manually invalidate queries to update the UI
                queryClient.invalidateQueries({ queryKey: ['messages'] });
                queryClient.invalidateQueries({ queryKey: ['support-threads'] });
            }
        },
        onError: () => toast.error('Failed to send message'),
        // Prevent multiple submissions
        onMutate: () => {
             const toastId = toast.loading('Sending message...');
             return { toastId };
        },
        onSettled: (_data, _error, _variables, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
        }
    });

    return (
      
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[600px] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <MessageSquare className="w-5 h-5 text-[#204ecf]" />
                        <div
                            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-[#1a1a2e]">Messages</h2>
                        <span className="text-[10px] text-gray-400 block -mt-1">
                            {isConnected ? 'Real-time active' : 'Connecting...'}
                        </span>
                    </div>
                </div>
                <div className="bg-gray-200/50 p-1 rounded-xl flex items-center gap-1">
                    {/* Only show General tab for admin and core_team */}
                    {(user?.role === 'admin' || user?.role === 'core_team') && (
                        <button
                            onClick={() => setShowSupport(false)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                                !showSupport
                                    ? 'bg-white text-[#204ecf] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            General
                            {unreadCount.general > 0 && (
                                <span className="bg-[#204ecf] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                    {unreadCount.general}
                                </span>
                            )}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setShowSupport(true);
                            setSelectedThreadUser(null);
                        }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                            showSupport
                                ? 'bg-white text-green-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Support
                        {unreadCount.support > 0 && (
                            <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {unreadCount.support}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Admin Sidebar for Support Threads */}
                {showSupport && user?.role === 'admin' && (
                    <div className="w-64 border-r border-gray-100 overflow-y-auto bg-gray-50/30">
                        <div className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Active Requests
                        </div>
                        <div className="space-y-1 p-2">
                            {supportThreads?.map((thread: any) => (
                                <button
                                    key={thread.userId}
                                    onClick={() => setSelectedThreadUser(thread.userId)}
                                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group ${
                                        selectedThreadUser === thread.userId
                                            ? 'bg-white border border-gray-200 shadow-sm text-[#204ecf]'
                                            : 'hover:bg-white/50 text-gray-600'
                                    }`}
                                >
                                    <div className="relative">
                                        <img
                                            src={
                                                thread.userAvatar ||
                                                `https://ui-avatars.com/api/?name=${thread.userName}`
                                            }
                                            className="w-8 h-8 rounded-full border border-gray-200"
                                            alt=""
                                        />
                                        {/* Thread-specific unread indicator could go here if implemented on backend */}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="text-xs font-bold truncate">
                                            {thread.userName}
                                        </div>
                                        <div className="text-[10px] text-gray-400 truncate">
                                            {thread.lastMessage}
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {(!supportThreads || supportThreads.length === 0) && (
                                <div className="text-center py-8 px-4">
                                    <p className="text-[10px] text-gray-400 italic">
                                        No active support requests
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {showSupport && user?.role === 'admin' && !selectedThreadUser ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                <Users className="w-12 h-12 text-gray-200 mb-4" />
                                <h3 className="font-bold text-gray-700">Select a support ticket</h3>
                                <p className="text-sm text-gray-400 max-w-xs mx-auto mt-2">
                                    Pick a client from the list to start assisting them.
                                </p>
                            </div>
                        ) : messagesLoading ? (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                Loading interaction...
                            </div>
                        ) : currentMessages?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-50">
                                <MessageSquare className="w-12 h-12 text-gray-200" />
                                <p className="text-sm text-gray-400">
                                    {showSupport
                                        ? 'No support history found.'
                                        : 'Safe and private communication.'}
                                </p>
                            </div>
                        ) : (
                            currentMessages?.map((msg: any) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-4 ${msg.senderId === user?.id ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className="flex-shrink-0">
                                        <img
                                            src={
                                                msg.sender_avatar ||
                                                `https://ui-avatars.com/api/?name=${msg.sender_name}`
                                            }
                                            className="w-10 h-10 rounded-full border border-gray-100 shadow-sm"
                                            alt={msg.sender_name}
                                        />
                                    </div>
                                    <div
                                        className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'} max-w-[80%]`}
                                    >
                                        <div className="flex items-center gap-2 mb-1 px-1">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                                {msg.sender_name}
                                            </span>
                                            <span className="text-[10px] text-gray-300">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                        <div
                                            className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                                                msg.senderId === user?.id
                                                    ? 'bg-[#204ecf] text-white rounded-tr-none'
                                                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Area */}
                    {showSupport && user?.role === 'admin' && !selectedThreadUser ? null : (
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    
                                    // Prevent multiple submissions
                                    if (sendMessageMutation.isPending) return;
                                    
                                    const input = (e.target as any).message;
                                    const receiverId = showSupport
                                        ? user?.role === 'admin'
                                            ? selectedThreadUser
                                            : 'support-system-user-id-001'
                                        : user?.role === 'admin'
                                            ? null // Admin doesn't send to "admin"
                                            : ADMIN_USER_ID;

                                    if (!receiverId) {
                                        toast.error("Please select a recipient first.");
                                        return;
                                    }

                                    sendMessageMutation.mutate({
                                        content: input.value,
                                        isSupport: showSupport,
                                        receiver_id: receiverId,
                                    });
                                    input.value = '';
                                }}
                                className="flex items-center gap-3 bg-white text-black p-2 rounded-2xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-[#204ecf]/20 transition-all"
                            >
                                <textarea
                                    name="message"
                                    rows={1}
                                    placeholder={showSupport ? "Type support response..." : "Write your message..."}
                                    className="flex-1 bg-transparent px-4 py-2 outline-none text-sm resize-none overflow-y-auto"
                                />
                                <Button type="submit" className="bg-[#204ecf] hover:bg-[#1a3da8] text-white px-6 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer">
                                    Send
                                </Button>
                            </form>
                            {showSupport && (
                                <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Support tickets are handled by our concierge team. Messages
                                    vanish safely after 48 hours.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
