import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axios'; 
import './GroupMessages.css';
import AttachmentIcon from '../../images/icons8-paperclip-100.png';
import CameraIcon from '../../images/icons8-camera-96.png';
import LocationIcon from '../../images/icons8-location-96.png';
import FileUploadIcon from '../../images/icons8-upload-100.png';
import SendIcon from '../../images/icons8-send-100.png';

export default function GroupMessage({ group, onBack }) {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [groupData, setGroupData] = useState(group || null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [groupStatus, setGroupStatus] = useState(group?.status || 'open');
  const [message, setMessage] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const attachmentOptions = [
    { icon: CameraIcon, label: 'Camera' },
    { icon: LocationIcon, label: 'Location' },
    { icon: FileUploadIcon, label: 'File Upload' },
  ];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchUserGroup = async () => {
      try {
        setLoading(true);

        if (group) {
          setGroupData(group);
          setGroupStatus(group.status || 'open');
          if (group.members) setMembers(group.members);
          await fetchMessages(group.id);
          await fetchCurrentUser();
          return;
        }

        const res = await axiosInstance.get('/api/user-groups');
        const groups = res.data?.groups || [];
        if (!groups.length) return;

        const userGroup = groups[0];
        setGroupData(userGroup);
        setGroupStatus(userGroup.status || 'open');

        if (userGroup.members) {
          setMembers(userGroup.members);
        } else {
          await fetchMembers(userGroup.id);
        }

        await fetchMessages(userGroup.id);
        await fetchCurrentUser();
      } catch (err) {
        console.error("Failed to fetch user's group:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchMembers = async (groupId) => {
      try {
        const res = await axiosInstance.get(`/api/groups/${groupId}/members`);
        setMembers(res.data || []);
      } catch (err) {
        console.error('Failed to fetch members:', err);
      }
    };

    const fetchMessages = async (groupId) => {
      if (!groupId) return;
      try {
        const res = await axiosInstance.get(`/api/groups/${groupId}/get-messages`);
        setMessages(res.data || []);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const res = await axiosInstance.get(`/api/user`);
        setCurrentUser(res.data);
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };

    fetchUserGroup();
  }, [group]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || groupStatus === 'closed' || !groupData) return;

    const payload = { grp_message: message.trim() };

    try {
      const res = await axiosInstance.post(`/api/groups/${groupData.id}/send-message`, payload);
      setMessages(prev => [...prev, res.data.data]);
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachmentClick = (option) => {
    setShowAttachmentMenu(false);
    switch(option.label) {
      case 'Camera':
        document.getElementById('mediaUpload')?.click();
        break;
      case 'File Upload':
        document.getElementById('docUpload')?.click();
        break;
      case 'Location':
        console.log('Sharing location...');
        break;
      default:
        break;
    }
  };

  if (loading) return <p>Loading group...</p>;
  if (!groupData) return <p>No group assigned. Contact admin.</p>;

  return (
    <div className="message-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <h2 className="header-content">{groupData.grp_name}</h2>
          <span className="member-count">{members.length} members</span>
        </div>
        <div className="header-actions">
          <div>
            <button className="info-button" title="Group Info" onClick={() => alert('Show group info modal')}>i</button>
          </div>
          <button className="back-button" onClick={onBack || (() => navigate(-1))}>Back</button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length > 0 ? messages.map(msg => (
          <div 
            key={msg.id} 
            className={`message ${msg.user?.id === currentUser?.id ? 'sent' : 'received'}`}
          >
            {msg.user?.id !== currentUser?.id && (
              <div className="avatar">{msg.user?.username?.charAt(0).toUpperCase()}</div>
            )}
            <div className="message-content">
              <div className="message-bubble"><p>{msg.grp_message}</p></div>
              <small className="message-time">{new Date(msg.created_at).toLocaleTimeString()}</small>
            </div>
          </div>
        )) : (
          <div className="no-messages"><p>No messages yet. Start the conversation!</p></div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <>
          <div className="attachment-overlay" onClick={() => setShowAttachmentMenu(false)} />
          <div className="attachment-menu">
            {attachmentOptions.map((option, index) => (
              <div key={option.label} className="attachment-option" onClick={() => handleAttachmentClick(option)} style={{ animationDelay: `${index * 100}ms` }}>
                <img src={option.icon} alt={option.label} className="attachment-icon" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Input */}
      <div className="chat-input-container">
        <button className={`attachment-toggle-btn ${showAttachmentMenu ? 'active' : ''}`} onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} title="Attachments">
          <img src={AttachmentIcon} alt="Attachment" className={`attachment-toggle-icon ${showAttachmentMenu ? 'rotated' : ''}`} />
        </button>
        <input type="file" id="mediaUpload" accept="image/*" hidden />
        <input type="file" id="docUpload" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" hidden />
        <div className="message-input-wrapper">
          <input type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleKeyPress} />
        </div>
        <div className="send-button-wrapper">
          <button className="send-button" title="Send" onClick={handleSendMessage} disabled={!message.trim()}>
            <img src={SendIcon} alt="Send" className="send-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
