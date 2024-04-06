import React from 'react';

const Messages = () => {
  // 组件的状态和逻辑

  return (
    <div className='DashboardMessages'>
      {/* 组件的JSX结构 */}
      <h1>WebSocket Test Client</h1>
        <div>
          <button onclick="connect();">Connect</button>
          <button onclick="disconnect();">Disconnect</button>
        </div>
        <input type="text" id="messageInput" placeholder="Enter message" />
        <button onclick="sendMessage();">Send Message</button>
        <h2>Messages</h2>
        <div id="messages">
          message area
        </div>
    </div>
  );
}

export default Messages;