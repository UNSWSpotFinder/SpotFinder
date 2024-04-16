import React, { useState, useEffect } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md'; 
import './Messages.css';

const Messages = () => {
  const [ws, setWs] = useState(null);
  const [content, setContent] = useState('');
  const [receiverID, setReceiverID] = useState('');
  const [, setShouldReconnect] = useState(true); // 控制是否在WebSocket断开后尝试重连

  const [notifications, setNotifications] = useState([]); // 用于存储通知
  const [messages, setMessages] = useState([]); // 用于存储消息

  const [showNotifications, setShowNotifications] = useState(true); // 控制显示或隐藏通知
  const [showMessages, setShowMessages] = useState(true); // 控制显示或隐藏消息

  const [userID, setUserID] = useState(localStorage.getItem('userID') || '');

  // 对话映射，键是参与者对组合，值是消息数组
  const [conversations, setConversations] = useState({});
  const [conversationVisibility, setConversationVisibility] = useState({});

    useEffect(() => {
        let websocket;
        function connect() {
            const token = localStorage.getItem('token');
            const jwtParts = token.split(".");
            const payload = JSON.parse(atob(jwtParts[1]));
            console.log("userID",payload.userID);
            setUserID(payload.userID);
            websocket = new WebSocket(`ws://localhost:8080/ws`); // 实例化WebSocket对象
            websocket.onopen = () => {
                // 当WebSocket连接打开时的回调函数
                console.log('WebSocket Connected');
                websocket.send(JSON.stringify({ type: 'authenticate', token: token })); // 发送认证信息
            };

            websocket.onmessage = (event) => {
                // 当WebSocket接收到消息时的回调函数
                try {
                    const data = JSON.parse(event.data);
                    console.log("Parsed data:", data);
                    if (data.type === 'message') {
                      setConversations(prevConversations => {
                        const participants = [data.content.SenderID, data.content.ReceiverID].sort().join('-');
                        setConversationVisibility(prev => ({
                          ...prev,
                          [participants]: (prev[participants] !== undefined) ? prev[participants] : true // 默认为true
                        }));
                        const updatedConversations = {...prevConversations};
                        const messagesForParticipants = updatedConversations[participants] || [];
                        messagesForParticipants.push(data);
                    
                        updatedConversations[participants] = messagesForParticipants.sort((a, b) => new Date(a.content.SentAt) - new Date(b.content.SentAt));
                    
                        // 同时初始化对话可见性状态
                        // setConversationVisibility(prevVisibility => ({
                        //   ...prevVisibility,
                        //   [participants]: (prevVisibility[participants] !== undefined) ? prevVisibility[participants] : true
                        // }));
                    
                        return updatedConversations;
                      });           
                      } else if (data.type === 'notification') {
                        setNotifications(prevNotifications => [data, ...prevNotifications].sort((a, b) => new Date(b.content.SentAt) - new Date(a.content.SentAt))); // 将最新的通知放在顶部
                      }
                  } catch (err) {
                    console.error('Failed to parse message from server:', err);
                  }
                };

            websocket.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };
            setWs(websocket);
        }

        connect(); // 调用connect函数以连接WebSocket

        return () => {
            setShouldReconnect(false); // 更新状态为不再尝试重连
            if (websocket) {
                websocket.close();
            }
        };
    }, []);


    // 发送消息
    const handleSendMessage = () => {
        // 检查WebSocket连接状态是否为OPEN
        if (ws && ws.readyState === WebSocket.OPEN && receiverID) {
            const message = {
                Type: 'message',
                receiverId: parseInt(receiverID, 10), // 将receiverID转换为十进制
                content: content,
            };
            ws.send(JSON.stringify(message));
            setContent(''); // 清空输入框
            // TODO: 更新对话框
        } else {
            console.error('WebSocket is not open.', ws);
            // 可以在此处处理重新连接逻辑或通知用户
        }
    };

  // 切换显示/隐藏通知
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    };

  // 切换对话框显示的函数
  const toggleConversationVisibility = (participantsKey) => {
    setConversationVisibility(prevVisibility => ({
      ...prevVisibility,
      [participantsKey]: !prevVisibility[participantsKey],
    }));
  };

  // 生成对话框的唯一键
  const getParticipantsKey = (message) => {
    return [message.content.SenderID, message.content.ReceiverID].sort().join('-');
  };


  // 渲染每个对话
  const renderConversations = () => {
    return Object.entries(conversations).map(([participantsKey, conversation], index) => {
      const isConversationVisible = conversationVisibility[participantsKey] !== false;
  
      return (
        <div key={index} className='conversation'>
          <div className='conversation-title'>
            <span>Conversation between {participantsKey.replace('-', ' and ')}</span>
            <button onClick={() => toggleConversationVisibility(participantsKey)} className="toggle-button">
              {isConversationVisible ? <MdExpandLess /> : <MdExpandMore />}
            </button>
          </div>
          <div className='conversation-messages' style={{ display: isConversationVisible ? 'block' : 'none' }}>
            {conversation.map((message, msgIndex) => (
              <div key={msgIndex} className='message'>
                <p><strong>From:</strong> {message.content.SenderID} <strong>To:</strong> {message.content.ReceiverID}</p>
                <p>{message.content.Content}</p>
                <p><small>Sent at: {new Date(message.content.SentAt).toLocaleString()}</small></p>
              </div>
            ))}
          </div>
          <div>
                <input
                    type="text"
                    value={receiverID}
                    placeholder="Receiver ID"
                    onChange={e => setReceiverID(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    value={content}
                    placeholder="Enter message"
                    onChange={e => setContent(e.target.value)}
                />
            </div>
            <button onClick={handleSendMessage}>Send</button> 
        </div>
      );
    });
  };
  


    return (
        <div className='DashboardMessages'>
          <p>Your ID: {userID}</p>
            <div className='msg-title'>
                Notifications
                <button onClick={toggleNotifications} className="toggle-button">
                {showNotifications ? <MdExpandLess /> : <MdExpandMore />} {/* 根据状态选择图标 */}
                </button>
            </div>
            <div id="notifications" style={{ display: showNotifications ? 'block' : 'none' }}>
                {notifications.map((notification, index) => (
                <div key={index} className='received-notification'>
                    <div className='notification-container'>
                        <div>{notification.content.Content}</div>
                        <div>{new Date(notification.content.SentAt).toLocaleString()}</div>
                    </div>
                </div>
                ))}
            </div>
            <div className='msg-title'>Conversations
            </div>
            <div id="conversations">
                {renderConversations()}
            </div>
            <div id="messages" style={{ display: showMessages ? 'block' : 'none' }}>
                {messages.map((message, index) => (
                <div key={index} className='received-message'>
                    <p><strong>From:</strong> {message.content.SenderID} <strong>To:</strong> {message.content.ReceiverID}</p>
                    <p>{message.content.Content}</p>
                    <p><small>Sent at: {new Date(message.content.SentAt).toLocaleString()}</small></p>
                </div>
                ))}
            </div>


 

        </div>
    );
}

export default Messages;