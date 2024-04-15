import React, { useState, useEffect } from 'react';

const Messages = () => {
  const [ws, setWs] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [content, setContent] = useState('');
  const [receiverID, setReceiverID] = useState('');
  const [shouldReconnect, setShouldReconnect] = useState(true); // 控制是否在WebSocket断开后尝试重连

  const [notifications, setNotifications] = useState([]); // 用于存储通知
  const [messages, setMessages] = useState([]); // 用于存储消息

    useEffect(() => {
        let websocket;
        function connect() {
            const token = localStorage.getItem('token');
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
            
                    if (Array.isArray(data)) {
                      // 分类并排序消息
                      const newNotifications = data.filter(msg => msg.type === 'notification').sort((a, b) => new Date(b.SentAt) - new Date(a.SentAt));
                      const newMessages = data.filter(msg => msg.type === 'message').sort((a, b) => new Date(b.SentAt) - new Date(a.SentAt));
                      setNotifications(newNotifications); // 设置通知
                      setMessages(newMessages); // 设置消息
                    } else {
                      // 根据类型更新单条消息或通知，并排序
                      if (data.type === 'message') {
                        setMessages(prevMessages => [data, ...prevMessages].sort((a, b) => new Date(b.SentAt) - new Date(a.SentAt)));
                      } else if (data.type === 'notification') {
                        setNotifications(prevNotifications => [data, ...prevNotifications].sort((a, b) => new Date(b.SentAt) - new Date(a.SentAt)));
                      }
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


    // 发送消息的函数
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
        } else {
            console.error('WebSocket is not open.', ws);
            // 可以在此处处理重新连接逻辑或通知用户
        }
    };


    return (
        <div className='DashboardMessages'>
            <h2>Notifications</h2>
            <div id="notifications">
                {notifications.map((notification, index) => (
                <div key={index} className='received-notification'>
                    <p>{notification.content.Content}</p>
                    <p><small>Received at: {new Date(notification.content.SentAt).toLocaleString()}</small></p>
                </div>
                ))}
            </div>
            <h2>Messages</h2>
            <div id="messages">
                {messages.map((message, index) => (
                <div key={index} className='received-message'>
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
}

export default Messages;