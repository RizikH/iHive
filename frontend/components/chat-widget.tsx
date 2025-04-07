'use client';

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
// Uncomment the following lines when Supabase is set up:
// import { useSession } from '@supabase/auth-helpers-react';
// import { supabase } from '@/lib/supabaseClient';

// Connect to your backend WebSocket server
const socket = io('http://localhost:5000');

// Replace with Supabase-authenticated user session when ready:
// const session = useSession();
// const currentUser = {
//   id: session?.user.id,
//   name: session?.user.user_metadata.full_name || 'Anonymous',
//   avatar: session?.user.user_metadata.avatar_url || '/default-avatar.png',
// };

// Fallback mock user (used for development/demo)
const currentUser = {
  id: 'user123',
  name: 'You',
  avatar: '/Images/sample.jpeg',
};

// Replace this with Supabase call to get all users (except currentUser):
// const [allUsers, setAllUsers] = useState([]);
// useEffect(() => {
//   const fetchUsers = async () => {
//     const { data, error } = await supabase
//       .from('users')
//       .select('id, name, avatar_url')
//       .neq('id', currentUser.id);
//     if (data) setAllUsers(data);
//   };
//   if (currentUser.id) fetchUsers();
// }, [currentUser.id]);

// Hardcoded users for now
const allUsers = [
  { id: 'user123', name: 'You', avatar: '/Images/sample.jpeg' },
  { id: 'user456', name: 'Dalton', avatar: '/Images/sample.jpeg' },
  { id: 'user789', name: 'Rizik', avatar: '/Images/sample.jpeg' },
  { id: 'user321', name: 'Sam', avatar: '/Images/sample.jpeg' },
  { id: 'user654', name: 'Yixi', avatar: '/Images/sample.jpeg' },
];

// Define message type
type Message = {
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
};

// Define what each chat window holds
type ChatWindow = {
  id: string;
  name: string;
  avatar: string;
  minimized: boolean;
  messages: Message[];
};

export default function ChatWidget() {
  // Track open chats, menu toggle, and state for group messaging
  const [openChats, setOpenChats] = useState<ChatWindow[]>([]);
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupMode, setGroupMode] = useState(false);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<any[]>([]);

  // Setup listener for incoming socket messages
  useEffect(() => {
    const handleMessage = (msg: Message) => {
      setOpenChats(prev =>
        prev.map(chat =>
          chat.id === msg.senderId || chat.id.includes(msg.senderId)
            ? { ...chat, messages: [...chat.messages, msg] }
            : chat
        )
      );
    };

    socket.on('message', handleMessage); // listen for 'message' events
    return () => socket.off('message', handleMessage); // cleanup listener
  }, []);

  // Handles opening a direct (1-to-1) chat
  const openChat = (user: { id: string; name: string; avatar: string }) => {
    const existing = openChats.find(c => c.id === user.id);
    if (!existing) {
      const roomId = `dm-${[currentUser.id, user.id].sort().join('-')}`; // generate room ID
      socket.emit('joinRoom', { roomId, userId: currentUser.id }); // join socket room

      // Replace with Supabase function to get/create room:
      // const { data: room } = await supabase.rpc('get_or_create_dm_room', {
      //   user1: currentUser.id,
      //   user2: user.id,
      // });

      setOpenChats(prev => [
        ...prev.map(c => ({ ...c, minimized: true })), // minimize all other chats
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          minimized: false,
          messages: [],
        }
      ]);
    }
  };

  // Handles creating a new group chat
  const openGroupChat = () => {
    const participants = [currentUser, ...selectedGroupUsers];
    const roomId = `group-${participants.map(p => p.id).sort().join('-')}`;
    const customName = window.prompt('Name your group chat:')?.trim() || 'Group Chat';
    socket.emit('joinRoom', { roomId, userId: currentUser.id });

    // Replace with Supabase chat room + participants insert:
    // const { data: newRoom } = await supabase
    //   .from('chat_rooms')
    //   .insert([{ name: customName, is_group: true }])
    //   .select()
    //   .single();
    // await supabase.from('chat_participants').insert(
    //   participants.map(p => ({ user_id: p.id, room_id: newRoom.id }))
    // );

    setOpenChats(prev => [
      ...prev.map(c => ({ ...c, minimized: true })),
      {
        id: roomId,
        name: customName,
        avatar: '',
        minimized: false,
        messages: [],
      }
    ]);
    setGroupMode(false);
    setSelectedGroupUsers([]);
    setChatMenuOpen(false);
  };
  /// Handles sending a message
  const sendMessage = (chatId: string, content: string) => {
    if (!content.trim()) return;
  
    const msg: Message = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
    };
  
    socket.emit('message', msg); // send through socket
  
    // Add message to chat locally right away (so it appears immediately)
    setOpenChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, msg] }
          : chat
      )
    );
  
    // Uncomment this when saving to Supabase:
    // await supabase.from('messages').insert({
    //   room_id: chatId,
    //   sender_id: currentUser.id,
    //   content: content,
    // });
  };
  

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-row-reverse items-end gap-2">
      {/* Chat launcher panel */}
      {chatMenuOpen ? (
        <div className="bg-gray-100 border rounded shadow-lg p-4 w-72">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Start a Chat</span>
            <button onClick={() => setChatMenuOpen(false)}>✕</button>
          </div>

          {/* Mode toggles */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setGroupMode(false)}
              className={`flex-1 py-1 rounded ${!groupMode ? 'bg-[#FED22B] text-black' : 'bg-gray-200'}`}
            >
              Individual
            </button>
            <button
              onClick={() => setGroupMode(true)}
              className={`flex-1 py-1 rounded ${groupMode ? 'bg-[#FED22B] text-black' : 'bg-gray-200'}`}
            >
              Group
            </button>
          </div>

          {/* User search field */}
          <input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded px-2 py-1 mb-2"
          />

          {/* User list */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {allUsers.filter(u =>
              u.name.toLowerCase().includes(searchQuery.toLowerCase()) && u.id !== currentUser.id
            ).map(user => {
              const isSelected = selectedGroupUsers.some(u => u.id === user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => {
                    if (groupMode) {
                      setSelectedGroupUsers(prev =>
                        isSelected ? prev.filter(u => u.id !== user.id) : [...prev, user]
                      );
                    } else {
                      openChat(user);
                      setChatMenuOpen(false);
                      setSearchQuery('');
                    }
                  }}
                  className="flex items-center gap-2 p-2 bg-white rounded cursor-pointer hover:bg-gray-50"
                >
                  {groupMode && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="accent-[#FED22B]"
                    />
                  )}
                  <img src={user.avatar} className="w-8 h-8 rounded-full" />
                  <span>{user.name}</span>
                </div>
              );
            })}
          </div>

          {/* Confirm button for group chat */}
          {groupMode && selectedGroupUsers.length > 0 && (
            <button
              onClick={openGroupChat}
              className="mt-3 w-full bg-[#FED22B] text-black py-1 rounded"
            >
              Create Group Chat ({selectedGroupUsers.length})
            </button>
          )}
        </div>
      ) : (
        // Button to open chat menu
        <button
          onClick={() => setChatMenuOpen(true)}
          className="bg-[#FED22B] text-black px-6 py-3 text-lg rounded-full shadow-lg"
        >
          💬 Chat
        </button>
      )}

      {/* Render chat windows */}
      {openChats.map(chat => (
        <div
        key={chat.id}
        className={`bg-white border rounded-lg shadow-2xl w-80 overflow-hidden transition-all duration-300 ease-in-out ${
          chat.minimized ? 'h-10' : 'h-96'
        } flex flex-col`}>
      
          <div className="flex justify-between items-center bg-gray-200 px-3 py-2">
            <div className="flex items-center gap-2">
              {chat.avatar && <img src={chat.avatar} className="w-6 h-6 rounded-full" />}
              <span className="font-medium text-sm">{chat.name}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setOpenChats(prev =>
                    prev.map(c => c.id === chat.id ? { ...c, minimized: !c.minimized } : c)
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

          {/* Messages */}
          {!chat.minimized && (
            <div className="flex-1 overflow-y-auto px-2 space-y-1">
              {chat.messages.map((msg, i) => {
                const isSender = msg.senderId === currentUser.id;
                return (
                  <div key={i} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs text-left px-3 py-2 rounded-lg text-sm ${isSender ? 'bg-[#FED22B]' : 'bg-gray-200'} text-black`}>
                      <div className="text-xs text-gray-600 mb-1">{msg.senderName}</div>
                      <div className="flex items-center gap-2">
                        {!isSender && <img src={msg.senderAvatar} className="w-5 h-5 rounded-full" />}
                        <span>{msg.content}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Input field */}
          {!chat.minimized && (
            <div className="p-2 border-t flex gap-2">
              <input
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="Type a message..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(chat.id, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
