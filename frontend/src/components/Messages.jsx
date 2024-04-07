import React, { useState, useEffect } from 'react';

const Messages = () => {
  const [ws, setWs] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [content, setContent] = useState('');
  const [receiverID, setReceiverID] = useState('');

    useEffect(() => {
        let websocket;
        function connect() {
            const token = localStorage.getItem('token');
            websocket = new WebSocket(`ws://localhost:8080/ws`);
            websocket.onopen = () => {
                console.log('WebSocket Connected');
                websocket.send(JSON.stringify({ type: 'authenticate', token: token }));
            };
            websocket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setReceivedMessages(prevMessages => [...prevMessages, message]);
            };
            // websocket.onclose = () => {
            //     console.log('WebSocket Disconnected');
            //     if (shouldReconnect) {
            //         setTimeout(() => {
            //             connect();
            //         }, 1000); // 1秒后重连
            //     }
            // };
            websocket.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };
            setWs(websocket);
        }

        connect();

        return () => {
            setShouldReconnect(false); // 阻止重连
            websocket.close();
        };
    }, []);


    const handleSendMessage = () => {
        // 检查WebSocket连接状态是否为OPEN
        if (ws && receiverID) {
            const message = {
                receiverId: parseInt(receiverID, 10),
                content: content,
            };
            ws.send(JSON.stringify(message));
            setContent(''); // 清空输入框
        } else {
            console.error('WebSocket is not open.', ws, );
            // 可以在此处处理重新连接逻辑或通知用户
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
