"use client";

import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { fetcher } from '@/app/utils/fetcher';
import { useAuthStore } from '@/app/stores/useAuthStore';
import Image from 'next/image';

let socket: Socket | null = null;

type Message = {
  sender_id: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp?: string;
  roomId?: string;
};

type ChatWindow = {
  id: string;
  username: string;
  avatar: string;
  minimized: boolean;
  messages: Message[];
  typing?: string | boolean;
};

export default function ChatWidget() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const currentUser = useAuthStore(state => state.currentUser);


  const [openChats, setOpenChats] = useState<ChatWindow[]>([]);
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageEndRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const [existingContacts, setExistingContacts] = useState<any[]>([]);

  const connectedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !currentUser.id) {
      setOpenChats([]); // Reset chat windows
      return;
    }

    const fetchExistingContacts = async () => {
      try {
        const contacts = await fetcher(`/chat/contacts/${currentUser.id}`);
        setExistingContacts(contacts);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      }
    };

    fetchExistingContacts();
  }, [currentUser.id, isAuthenticated]);


  useEffect(() => {
    if (!isAuthenticated) return;
    if (!socket && !connectedRef.current) {
      const socketUrl =
        process.env.NODE_ENV === 'production'
          ? 'https://ihive.onrender.com'
          : 'http://localhost:5000';

      socket = io(socketUrl, {
        transports: ['websocket'], // fallback to polling if needed
        withCredentials: true,
      });

      connectedRef.current = true;
    }


    const handleMessage = (msg: Message) => {
      if (msg.sender_id === currentUser.id) return;

      // Play sound for every incoming message
      if (audioRef.current) {
        audioRef.current.play().catch(() => { });
      }

      setOpenChats(prev => {
        const exists = prev.find(chat => chat.id === msg.roomId);

        if (exists) {
          return prev.map(chat =>
            chat.id === msg.roomId
              ? { ...chat, messages: [...chat.messages, msg], typing: false }
              : chat
          );
        }

        // If room hasn't been opened yet, join it
        socket?.emit('joinRoom', { roomId: msg.roomId, userId: currentUser.id });

        // Create a new minimized chat window
        return [
          ...prev,
          {
            id: msg.roomId!,

            username: msg.senderName,
            avatar: msg.senderAvatar || '/Images/sample.jpeg',
            minimized: true,
            messages: [msg],
            typing: false,
          },
        ];
      });
    };


    const handleTyping = ({ roomId, senderId }: { roomId: string; senderId: string }) => {
      if (senderId === currentUser.id) return;

      setOpenChats(prev =>
        prev.map(chat =>
          chat.id === roomId ? { ...chat, typing: senderId } : chat
        )
      );

      setTimeout(() => {
        setOpenChats(prev =>
          prev.map(chat =>
            chat.id === roomId ? { ...chat, typing: undefined } : chat
          )
        );
      }, 2000);
    };

    socket?.on('message', handleMessage);
    socket?.on('typing', handleTyping);

    return () => {
      socket?.off('message', handleMessage);
      socket?.off('typing', handleTyping);
    };
  }, [currentUser.id, isAuthenticated]);

  // Clean up on logout
  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        socket = null;
        connectedRef.current = false;
      }
      setOpenChats([]);
      setSearchResults([]);
      setExistingContacts([]);
    }
  }, [isAuthenticated]);


  useEffect(() => {
    openChats.forEach(chat => {
      const ref = messageEndRefs.current[chat.id];
      if (ref) ref.scrollIntoView({ behavior: 'smooth' });
    });
  }, [openChats]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim() || !currentUser.id) return setSearchResults([]);
      try {
        const users = await fetcher('/users/all', 'POST', {
          query: searchQuery,
          excludeId: currentUser.id,
        });
        setSearchResults(users);
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, currentUser.id]);

  const getReceiverFromRoom = async (roomId: string, userId: string) => {
    const receiver = await fetcher(`/chat/${roomId}/receiver?userId=${userId}`);
    return receiver[0];
  };

  const openChat = async (user: { id: string; username: string; avatar: string }) => {
    const room = await fetcher('/chat/get-dm-room', 'POST', {
      user1: currentUser.id,
      user2: user.id,
    });
    const roomId = room.id;
    if (openChats.some(c => c.id === roomId)) return;

    socket?.emit('joinRoom', { roomId, userId: currentUser.id });
    const messages = await fetcher(`/chat/${roomId}/messages`);
    const receiver = await getReceiverFromRoom(roomId, currentUser.id);

    setOpenChats(prev => [
      ...prev.map(c => ({ ...c, minimized: true })),
      {
        id: roomId,
        username: receiver.username,
        avatar: receiver.avatar,
        minimized: false,
        messages: messages || [],
      },
    ]);
  };

  const sendMessage = async (chatId: string, content: string) => {
    if (!content.trim()) return;

    const msg: Message = {
      sender_id: currentUser.id,
      senderName: currentUser.username,
      senderAvatar: currentUser.avatar,
      content,
      roomId: chatId,
    };

    socket?.emit('message', msg);
    setOpenChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, messages: [...chat.messages, msg] } : chat
      )
    );

    try {
      await fetcher('/chat/send', 'POST', {
        roomId: chatId,
        senderId: currentUser.id,
        content,
      });
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  };

  const handleTyping = (chatId: string) => {
    socket?.emit('typing', { roomId: chatId, userId: currentUser.id });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-row-reverse items-end gap-2">
      <audio ref={audioRef} src="/media/notification.mp3" preload="auto" />

      {/* Chat launcher */}
      {chatMenuOpen ? (
        <div className="bg-gray-100 border rounded shadow-lg p-4 w-72">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Start a Chat</span>
            <button onClick={() => setChatMenuOpen(false)}>✕</button>
          </div>
          <div className="mb-2">
            <span className="text-sm text-gray-600">Recent Contacts:</span>
            <div className="max-h-28 overflow-y-auto mt-1 mb-2">
              {existingContacts.map(user => (
                <div
                  key={user.id}
                  onClick={() => {
                    openChat(user);
                    setChatMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 bg-white rounded hover:bg-gray-50 cursor-pointer"
                >
                  <Image
                    src={user.avatar || '/Images/sample.jpeg'}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full"
                    alt={user.username}
                  />


                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          </div>

          <input
            placeholder="Search users..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border rounded px-2 py-1 mb-2"
            autoComplete="off"
          />
          <div className="max-h-48 overflow-y-auto space-y-2">
            {searchResults.map(user => (
              <div
                key={user.id}
                onClick={() => {
                  openChat(user);
                  setChatMenuOpen(false);
                  setSearchQuery('');
                }}
                className="flex items-center gap-2 p-2 bg-white rounded hover:bg-gray-50 cursor-pointer"
              >
                <Image src={user.avatar} className="w-8 h-8 rounded-full" alt={''} />
                <span>{user.username}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setChatMenuOpen(true)}
          className="bg-[#FED22B] text-black px-6 py-3 text-lg rounded-full shadow-lg"
        >
          💬 Chat
        </button>
      )}

      {/* Chat windows */}
      {openChats.map(chat => (
        <div
          key={chat.id}
          className={`bg-white w-80 border rounded shadow-lg flex flex-col overflow-hidden transition-all duration-300 ${chat.minimized ? 'h-10' : 'h-96'}`}
        >
          <div className="flex justify-between items-center bg-gray-200 px-3 py-2">
            <div className="flex items-center gap-2">
              {chat.avatar && (
                <Image
                  src={chat.avatar}
                  width={24} // Explicitly set the width
                  height={24} // Explicitly set the height
                  className="w-6 h-6 rounded-full"
                  alt={chat.username || 'User Avatar'}
                />
              )}
              <span className="font-medium text-sm">{chat.username}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setOpenChats(prev =>
                    prev.map(c =>
                      c.id === chat.id ? { ...c, minimized: !c.minimized } : c
                    )
                  )
                }
              >
                {chat.minimized ? '🔼' : '🔽'}
              </button>
              <button onClick={() => setOpenChats(prev => prev.filter(c => c.id !== chat.id))}>
                ✕
              </button>
            </div>
          </div>

          {!chat.minimized && (
            <>
              <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
                {chat.messages.map((msg, i) => {
                  const isOwn = msg.sender_id === currentUser.id;
                  return (
                    <div
                      key={i}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`px-3 py-2 max-w-xs rounded-lg text-sm ${isOwn ? 'bg-gray-200' : 'bg-[#FED22B]'} text-black`}
                      >
                        {!isOwn && (
                          <div className="text-xs text-gray-600 mb-1 text-right">
                            {chat.username}
                          </div>
                        )}
                        <span>{msg.content}</span>
                      </div>
                    </div>
                  );
                })}

                {chat.typing && (
                  <div className="text-xs text-gray-500 italic text-right">
                    {chat.messages.at(-1)?.sender_id !== currentUser.id && 'Typing...'}
                  </div>
                )}

                <div ref={el => { messageEndRefs.current[chat.id] = el; }} />
              </div>
              <div className="p-2 border-t flex gap-2">
                <input
                  ref={el => { inputRefs.current[chat.id] = el; }}
                  className="flex-1 border rounded px-2 py-1 text-sm"
                  placeholder="Type a message..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const content = e.currentTarget.value.trim();
                      if (content) {
                        sendMessage(chat.id, content);
                        e.currentTarget.value = '';
                      }
                    } else {
                      handleTyping(chat.id);
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}