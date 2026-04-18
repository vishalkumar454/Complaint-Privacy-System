import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { axiosClient } from '../api/axios.client';
import { Send, User as UserIcon, Shield, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { io } from 'socket.io-client';
import { CONSTANTS } from '../utils/constants';

const ChatInterface = () => {
  const { id: complaintId } = useParams();
  const { user, userType } = useAuth();
  
  const [ComplaintDetails, setComplaintDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize Socket.io connection (Assuming backend socket.io is on same server)
  useEffect(() => {
    // In a real production app, CONSTANTS.API_URL usually needs parsing to get the root domain for Socket.io
    const socketUrl = CONSTANTS.API_URL.replace('/api/v1', '');
    socketRef.current = io(socketUrl, {
      auth: { token: localStorage.getItem(CONSTANTS.TOKEN_KEY) }
    });

    socketRef.current.on('connect', () => {
      // Join specific complaint room
      socketRef.current.emit('join_room', complaintId);
    });

    socketRef.current.on('receive_message', (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => socketRef.current.disconnect();
  }, [complaintId]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintRes, messagesRes] = await Promise.all([
          axiosClient.get(`/complaints/${complaintId}`),
          axiosClient.get(`/chat/${complaintId}`)
        ]);
        setComplaintDetails(complaintRes.data.complaint);
        setMessages(messagesRes.data.messages);
      } catch (err) {
        setError('Unauthorized access or complaint not found.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [complaintId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const response = await axiosClient.post(`/chat/${complaintId}`, { content: input });
      const newMsg = response.data.message;
      
      // Emit via socket for real-time update to the other party
      socketRef.current.emit('send_message', newMsg);
      
      setMessages(prev => [...prev, newMsg]);
      setInput('');
    } catch (err) {
      alert('Failed to send message');
    }
  };

  if (isLoading) return <div className="p-8">Loading secure chat...</div>;
  
  if (error) return (
    <div className="empty-state animate-fade-in mt-8">
      <AlertCircle size={48} className="text-danger mb-4 mx-auto" style={{ display: 'block' }}/>
      <h2>Access Denied</h2>
      <p className="text-muted">{error}</p>
    </div>
  );

  return (
    <div className="chat-interface-container animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
      
      {/* Sidebar Info Panel */}
      <div className="chat-info-panel card" style={{ height: '100%', overflowY: 'auto' }}>
        <h3 className="mb-4">Case Overview</h3>
        <div className="info-block mb-4">
          <span className="text-xs text-muted font-bold tracking-wider uppercase">Reference ID</span>
          <p className="font-mono mt-1 text-sm">{ComplaintDetails?.complaintId}</p>
        </div>
        <div className="info-block mb-4">
          <span className="text-xs text-muted font-bold tracking-wider uppercase">Category</span>
          <p className="mt-1"><span className="badge">{ComplaintDetails?.category}</span></p>
        </div>
        <div className="info-block mb-4">
          <span className="text-xs text-muted font-bold tracking-wider uppercase">Status</span>
          <p className="mt-1 font-medium text-primary">{ComplaintDetails?.status}</p>
        </div>
        
        <hr className="my-4" style={{ borderColor: 'var(--border)' }} />
        
        <h4 className="mb-2 text-sm text-secondary uppercase tracking-wider font-bold">Participants</h4>
        <div className="flex flex-col gap-3 mt-3">
          <div className="flex items-center gap-3">
            <div className="avatar bg-primary-light text-primary"><Shield size={16} /></div>
            <div>
              <p className="text-sm font-medium">Adv. {ComplaintDetails?.assignedAdvocate?.name || 'Pending Assignment'}</p>
              <p className="text-xs text-muted">Legal Representative</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="avatar bg-secondary"><UserIcon size={16} className="text-white" /></div>
            <div>
              <p className="text-sm font-medium">
                {ComplaintDetails?.isAnonymous ? 'Anonymous User' : ComplaintDetails?.userId?.name}
              </p>
              <p className="text-xs text-muted">Complainant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-wrapper card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
        <div className="chat-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
          <h3 style={{ margin: 0 }}>Secure Messaging: {ComplaintDetails?.title}</h3>
          <p className="text-xs text-muted mt-1">End-to-end encrypted communication channel.</p>
        </div>

        <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.length === 0 ? (
             <div className="text-center text-muted my-auto">
               No messages yet. Start the conversation to provide updates or ask for details.
             </div>
          ) : (
            messages.map(msg => {
              const isMine = msg.senderId === user._id;
              return (
                <div key={msg._id} className={`message-row ${isMine ? 'message-right' : 'message-left'}`} style={{ display: 'flex', gap: '0.75rem', alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '80%', flexDirection: isMine ? 'row-reverse' : 'row' }}>
                  
                  <div className={`avatar ${isMine ? 'bg-primary' : 'bg-secondary'}`} style={{ width: '28px', height: '28px', flexShrink: 0 }}>
                    {msg.senderModel === 'Advocate' ? <Shield size={14} color="white" /> : <UserIcon size={14} color="white" />}
                  </div>
                  
                  <div className="message-content" style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                    <div className={`message-bubble ${isMine ? 'bg-primary text-white' : 'bg-background text-primary'}`} style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                      {msg.content}
                    </div>
                    <span className="text-xs text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                      {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="chat-input-area" style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', backgroundColor: 'var(--background)' }}>
          <input 
            type="text" 
            className="form-input" 
            style={{ flex: 1, borderRadius: '9999px', paddingLeft: '1.5rem' }}
            placeholder="Type a secure message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
