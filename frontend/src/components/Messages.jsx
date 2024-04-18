import React, { useState, useEffect } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md'; 
import { getUserSimpleInfo } from './API'
import './Messages.css';

const Messages = () => {
  const [ws, setWs] = useState(null);
  // const [receiverID, setReceiverID] = useState('');
  const [, setShouldReconnect] = useState(true); // 控制是否在WebSocket断开后尝试重连

  const [notifications, setNotifications] = useState([]); // 用于存储通知
  const [messages, setMessages] = useState([]); // 用于存储消息

  const [showNotifications, setShowNotifications] = useState(true); // 控制显示或隐藏通知
  const [showMessages, setShowMessages] = useState(true); // 控制显示或隐藏消息

  const [userID, setUserID] = useState(localStorage.getItem('userID') || 0);
  const [userAvatar, setUserAvatar] = useState('');

  // 对话映射，键是参与者对组合，值是消息数组
  const [conversations, setConversations] = useState({});
  const [conversationVisibility, setConversationVisibility] = useState({});

    useEffect(() => {
        let websocket;
        function connect() {
            const token = localStorage.getItem('token');
            const jwtParts = token.split(".");
            const payload = JSON.parse(atob(jwtParts[1]));
            // console.log("userID",payload.userID);
            setUserID(Number(payload.userID));
             // 获取用户自己的头像信息
            getUserSimpleInfo(Number(payload.userID)).then(info => {
              setUserAvatar(info.message.avatar);
            }).catch(error => console.error('Failed to fetch user info:', error));
            
            websocket = new WebSocket(`ws://api/ws`); // 实例化WebSocket对象
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
                        const receiverId = [data.content.SenderID, data.content.ReceiverID].find(id => id !== userID);
                    
                        setConversationVisibility(prev => ({
                          ...prev,
                          [participants]: (prev[participants] !== undefined) ? prev[participants] : false
                        }));
                        
                        const updatedConversations = {...prevConversations};
                        const conversation = updatedConversations[participants] || { messages: [], content: '', userInfo: {} };
                        conversation.messages.push(data);
                        conversation.messages = conversation.messages.sort((a, b) => new Date(a.content.SentAt) - new Date(b.content.SentAt));
                        
                        if (!conversation.userInfo[receiverId]) {
                          getUserSimpleInfo(receiverId).then(info => {
                            // console.log('Fetched user info:', info);
                            setConversations(prev => ({
                              ...prev,
                              [participants]: {
                                ...prev[participants],
                                userInfo: {
                                  ...prev[participants].userInfo,
                                  [receiverId]: info.message  // 存储用户信息
                                }
                              }
                            }));
                          }).catch(error => console.error('Failed to fetch user info:', error));
                        }
                    
                        updatedConversations[participants] = conversation;
                        
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
  const handleSendMessage = (participantsKey) => {
    const receiverId = participantsKey.split('-').map(Number).find(id => id !== userID);
    if (ws && ws.readyState === WebSocket.OPEN) {
        const newMessage = {
            content: {
                SenderID: userID, // 发送者ID
                ReceiverID: receiverId, // 接收者ID
                Content: conversations[participantsKey].content, // 消息内容
                SentAt: new Date().toISOString() // 发送时间
            },
            type: 'message' // 消息类型
        };

        ws.send(JSON.stringify({
            Type: 'message',
            receiverId: receiverId,
            content: conversations[participantsKey].content,
        }));

        // 更新对话以包括新消息
        setConversations(prevConversations => {
            const updatedConversations = { ...prevConversations };
            const conversation = updatedConversations[participantsKey] || { messages: [], content: '' };
            conversation.messages.push(newMessage);
            conversation.messages = conversation.messages.sort((a, b) => new Date(a.content.SentAt) - new Date(b.content.SentAt));
            conversation.content = ''; // 清空输入框内容
            updatedConversations[participantsKey] = conversation;
            return updatedConversations;
        });
    } else {
        console.error('WebSocket is not open.', ws);
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



  const renderConversations = () => {
    return Object.entries(conversations).map(([participantsKey, { messages, content, userInfo }], index) => {
      const isConversationVisible = conversationVisibility[participantsKey] !== false;
      const participantIDs = participantsKey.split('-').map(Number);
      const receiverId = participantIDs.find(id => id !== userID);
  
      const otherUserInfo = userInfo[receiverId] || {};  // 默认空对象防止未定义错误
  
      return (
        <div key={index} className='conversation'>
          <div className='conversation-title'>
            <div>{otherUserInfo.name || 'Loading...'}</div>
            <button onClick={() => toggleConversationVisibility(participantsKey)} className="toggle-button">
              {isConversationVisible ? <MdExpandLess /> : <MdExpandMore />}
            </button>
          </div>
          <div className='conversation-messages' style={{ display: isConversationVisible ? 'block' : 'none' }}>
            {messages.map((message, msgIndex) => {
              const messageClass = message.content.SenderID === userID ? 'message-sent' : 'message-received';
  
              return (
                <div className='receiver-info'>                
                  <div key={msgIndex} className={`message-row ${messageClass}`}>
                    {message.content.SenderID !== userID && otherUserInfo.avatar && (
                      <img src={otherUserInfo.avatar} alt="Avatar" className="avatar" />
                      
                    )}
                    {/* <div>{otherUserInfo.name}</div> */}
                    <div className='message-container'>
                      <div>{message.content.Content}</div>
                      <div>{new Date(message.content.SentAt).toLocaleString()}</div>
                    </div>
                    {message.content.SenderID === userID && userAvatar && (
                     <img src={userAvatar} alt="Avatar" className="avatar" />
                      )}                    
                  </div>
              </div>

              );
            })}
            <div className='input-and-send-btn'>
              <input
                  type="text"
                  value={content}
                  placeholder="Enter message"
                  onChange={e => setConversations(prevConversations => ({
                      ...prevConversations,
                      [participantsKey]: { ...prevConversations[participantsKey], content: e.target.value }
                  }))}
              />
              <button onClick={() => handleSendMessage(participantsKey)}>Send</button>
            </div>
          </div>
        </div>
      );
    });
  };
  
  



    return (
        <div className='DashboardMessages'>
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
                        <div className='notification-content'>{notification.content.Content}</div>
                        <div className='notification-time'>{new Date(notification.content.SentAt).toLocaleString()}</div>
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
                  <div>
                    <div key={index} className='received-message'>
                      <p><strong>From:</strong> {message.content.SenderID} <strong>To:</strong> {message.content.ReceiverID}</p>
                      <p>{message.content.Content}</p>
                      <p><small>Sent at: {new Date(message.content.SentAt).toLocaleString()}</small></p>
                    </div>
                  </div>              
                ))}
            </div>
        </div>
    );
}

export default Messages;