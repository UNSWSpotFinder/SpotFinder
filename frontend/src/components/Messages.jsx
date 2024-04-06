import React, { useState, useEffect } from 'react';

const Messages = () => {
  const [ws, setWs] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [content, setContent] = useState('');
  const [receiverID, setReceiverID] = useState(''); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    // 初始化WebSocket连接
    const websocket = new WebSocket('ws://localhost:8080/ws');
    websocket.onopen = () => {
      console.log('WebSocket Connected');
      // 发送认证信息（如token）
      websocket.send(JSON.stringify({ action: 'authenticate', token: token }));
    };
    websocket.onmessage = (event) => {
      // 处理接收到的消息
      const message = JSON.parse(event.data);
      setReceivedMessages((prevMessages) => [...prevMessages, message]);
    };
    setWs(websocket);

    // 清理函数
    return () => {
      websocket.close();
    };
  }, []);

  const handleSendMessage = () => {
    // 发送消息
    if (ws && receiverID) {
      const message = {
        action: 'send_message',
        receiverID: receiverID, // 包括receiverID
        content: content,
      };
      ws.send(JSON.stringify(message));
      setContent(''); // 清空输入框
    }
  };

  return (
    <div className='DashboardMessages'>
      <h1>WebSocket Test Client</h1>
      <h2>Messages Area</h2>
      <div id="messages">
        {receivedMessages.map((msg, index) => (
          <div key={index} className='received-msg'>{msg.content}</div>
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

      <input 
        type="text" 
        value={content} 
        placeholder="Enter message" 
        onChange={e => setContent(e.target.value)} 
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default Messages;
