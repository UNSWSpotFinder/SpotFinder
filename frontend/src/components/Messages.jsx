import React, { useState, useEffect } from 'react';

const Messages = () => {
  const [ws, setWs] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [content, setContent] = useState('');
  const [receiverID, setReceiverID] = useState('');
  const [shouldReconnect, setShouldReconnect] = useState(true);

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
                console.log("Raw message data:", event.data);
                try {
                    const data = JSON.parse(event.data);
                    console.log("Parsed data:", data);
                    if (Array.isArray(data)) {
                        // Assuming that an array of messages means these are historical messages
                        setReceivedMessages(data);
                    } else {
                        // Adding a single message to the list
                        setReceivedMessages(prevMessages => [...prevMessages, data]);
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

        connect();

        return () => {
            setShouldReconnect(false); // 阻止重连
            if (websocket) {
                websocket.close();
            }
        };
    }, []);


    const handleSendMessage = () => {
        // 检查WebSocket连接状态是否为OPEN
        if (ws && ws.readyState === WebSocket.OPEN && receiverID) {
            const message = {
                receiverId: parseInt(receiverID, 10),
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
            <h1>WebSocket Test Client</h1>
            <h2>Messages Area</h2>
            <div id="messages">
                {receivedMessages.map((msg, index) => (
                    <div key={index} className='received-msg'>
                        <p><strong>From:</strong> {msg.SenderID} <strong>To:</strong> {msg.ReceiverID}</p>
                        <p>{msg.Content}</p>
                        <p><small>Sent at: {new Date(msg.SentAt).toLocaleString()}</small></p>
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