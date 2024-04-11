import React, { useState, useEffect } from 'react';
import './Messages.css';

const Messages = () => {
  const [ws, setWs] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
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

  return (
    <div className='DashboardMessages'>
      <div id="messages">
        {receivedMessages.map((msg, index) => (
          <div key={index} className='received-msg'>
            <div className='msg-header'>
              <div><strong>You've got a message from: {msg.SenderID}</strong> </div>
              <div>{new Date(msg.SentAt).toLocaleString()}</div>
            </div>
            <div className='msg-content'>{msg.Content}</div>
        </div>
        ))}
      </div>
    </div>
    );
}

export default Messages;