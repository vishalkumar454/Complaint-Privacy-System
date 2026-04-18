import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User as UserIcon, Search } from 'lucide-react';
import { LegalKnowledge } from '../utils/LegalKnowledgeBase.js';
import './ChatInterface.css';

const LegalBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello. I am the PrivacyShield Legal Assistant. I can provide preliminary guidance on Indian legal procedures, rights, and relevant sections for filing complaints regarding harassment, fraud, and cybercrimes. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findCategoryMatch = (text) => {
    const lowerText = text.toLowerCase();
    for (const [key, data] of Object.entries(LegalKnowledge)) {
      if (data.keywords.some(kw => lowerText.includes(kw))) {
        return data; // returns the full object (title, laws, punishment, etc.)
      }
    }
    return null;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const userMsg = { id: Date.now(), sender: 'user', text: userText, isRich: false };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponseText = "I'm sorry, I couldn't clearly map your situation to a specific legal category. Could you please provide more keywords (e.g. cybercrime, fraud, domestic violence)?";
      let richData = null;
      let generateSearch = false;

      // Detect google/search intent
      const searchKeywords = ['google', 'search', 'online', 'details', 'fetch', 'more info'];
      if (searchKeywords.some(sw => userText.toLowerCase().includes(sw))) {
         generateSearch = true;
      }

      const match = findCategoryMatch(userText);

      // If matched, format response using the Legal Knowledge Base rules
      if (match) {
        botResponseText = `Based on your description, this issue primarily falls under **${match.title}**. Below is the specific legal guidance for understanding and proceeding with this category:\n`;
        richData = match;
      } else if (generateSearch && userText.trim().length > 5) {
        botResponseText = `I couldn't map this to a predefined rule. However, since you requested online details, you can manually survey the broader web for guidance on this specific query.`;
      }

      const aiMsg = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: botResponseText, 
        isRich: !!richData,
        data: richData,
        searchQuery: generateSearch ? userText.replace(/google|search|online|details|fetch/gi, '').trim() : null
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="chat-interface-container animate-fade-in" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="chat-wrapper card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
        
        {/* Header */}
        <div className="chat-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--background)' }}>
          <div className="avatar bg-primary" style={{ width: '40px', height: '40px' }}>
            <Bot size={24} color="white" />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>AI Legal Assistant</h3>
            <span className="text-sm text-success flex items-center gap-1">
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }}></span> Online
            </span>
          </div>
        </div>

        {/* Message Area */}
        <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => (
            <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'message-right' : 'message-left'}`} style={{ display: 'flex', gap: '0.75rem', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              {msg.sender === 'bot' && (
                <div className="avatar bg-primary-light" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <Bot size={16} className="text-primary" />
                </div>
              )}
              
              <div className={`message-bubble ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-background text-primary'}`} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ whiteSpace: 'pre-wrap', marginBottom: msg.isRich ? '1rem' : 0 }}>
                   {msg.sender === 'bot' && msg.text.includes('**') ? 
                      <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      : msg.text
                   }
                </p>
                
                {msg.isRich && msg.data && (
                  <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="bg-primary-light" style={{ padding: '0.5rem', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--primary)' }}>
                      <strong>Relevant Laws:</strong>
                      <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.25rem' }}>
                        {msg.data.laws.map((l, i) => <li key={i}>{l}</li>)}
                      </ul>
                    </div>
                    <div>
                      <strong>Punishment:</strong> <span className="text-secondary">{msg.data.punishment}</span>
                    </div>
                    <div>
                      <strong>Required FIR Documents:</strong>
                      <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', marginTop: '0.25rem' }}>
                        {msg.data.documents.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                    <div>
                      <strong>Legal Procedure:</strong>
                      <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', marginTop: '0.25rem' }}>
                        {msg.data.procedures.map((p, i) => <li key={i}>{p}</li>)}
                      </ol>
                    </div>
                  </div>
                )}

                {msg.searchQuery && (
                  <div className="mt-3 flex items-center gap-2">
                    <Search size={16} className="text-secondary" />
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(msg.searchQuery || msg.data?.title || 'legal procedures India')}&hl=en`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                      style={{ fontSize: '0.9rem' }}
                    >
                      Fetch external details for this case online
                    </a>
                  </div>
                )}
              </div>
              
              {msg.sender === 'user' && (
                <div className="avatar bg-secondary" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <UserIcon size={16} color="white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
             <div className="message-row message-left animate-fade-in" style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
                 <div className="avatar bg-primary-light" style={{ width: '32px', height: '32px' }}>
                  <Bot size={16} className="text-primary" />
                </div>
                <div className="message-bubble bg-background text-muted" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', fontStyle: 'italic' }}>
                  AI is analyzing logical categories and compiling rule-based constraints...
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="chat-input-area" style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', backgroundColor: 'var(--background)' }}>
          <input 
            type="text" 
            className="form-input" 
            style={{ flex: 1, borderRadius: '9999px', paddingLeft: '1.5rem' }}
            placeholder="Describe your legal situation..."
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

export default LegalBot;
