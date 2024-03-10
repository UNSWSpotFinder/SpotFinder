import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardTop = () => {
  // ...顶部和侧边导航的布局

  return (
    <div>
      {/* 顶部导航 */}
      TopNav
      {/* 侧边导航 */}
      <main>
        {/* 子路由的组件会在这里渲染 */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardTop;
