import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../App';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';
import axios from '../utils/axios';
import { IoSend } from "react-icons/io5";

const CommunityChat = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Connect to socket
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL);
    fetchMessages();

    // Listen for new messages
    socketRef.current.on('newMessage', (message) => {
      const formattedMessage = {
        ...message,
        isMyMessage: message.sender._id === user._id
      };
      setMessages(prev => [...prev, formattedMessage]);
      scrollToBottom();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/chat/messages');
      const formattedMessages = response.data.map(message => ({
        ...message,
        isMyMessage: message.sender._id === user._id
      }));
      setMessages(formattedMessages.reverse());
      scrollToBottom();
    } catch (error) {
      console.error('Fetch messages error:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post('/chat/messages', { content: newMessage });
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-sky-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[75vh] sticky top-16">
          {/* Header */}
          <div className="bg-blue-600 p-3 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Community Chat</h2>
            </div>
            <p className="text-blue-100 text-xs">Connect with other job seekers</p>
          </div>

          {/* Messages Area */}
          <div className="flex flex-col h-[calc(80vh-120px)]">
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            >
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="loader"></div>
                </div>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">No messages yet</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.isMyMessage ? 'justify-end' : 'justify-start'
                    } mb-2`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-2 ${
                        message.isMyMessage
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-gray-100 mr-auto'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-medium ${
                          message.isMyMessage ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                          {message.isMyMessage ? 'You' : message.sender.name}
                        </span>
                        <span className={`text-[10px] ${
                          message.isMyMessage ? 'text-blue-100' : 'text-gray-500'
                        } opacity-70`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm break-words">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-1 border-t sticky bottom-0 bg-white">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full pr-12 pl-4 py-2 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-sm"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors"
                >
                  <IoSend size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat; 