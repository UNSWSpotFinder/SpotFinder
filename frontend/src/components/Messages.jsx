import React, { useState, useEffect } from 'react';

const Messages = () => {
  const [ws, setWs] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [content, setContent] = useState('');
  const [receiverID, setReceiverID] = useState('');
  const [shouldReconnect, setShouldReconnect] = useState(true); // 控制是否在WebSocket断开后尝试重连

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
                        //假设收到的是一个消息数组，则将它设置为接收到的消息
                        setReceivedMessages(data);
                    } else {
                        // 否则，将单条消息添加到消息数组中
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