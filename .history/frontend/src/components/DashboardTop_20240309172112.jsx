import React from 'react';
import { Outlet } from 'react-router-dom';
import './DashboardTop.css';

const DashboardTop = () => {
  return (
    <div className="dashboard-top">
      <div className="top-nav">
        TopNav
      
      </div>
      <div className="content-area">
        <div className="side-nav">SideNav</div>
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardTop;
