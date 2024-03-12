import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Listings.css';

const Listings = () => {


  return (
    <div className='dashboard-listings'>    
      <div className="button-part">
        <button className='listing-title'>Current Listings: 1</button>
        <button className='add-a-spot-btn'>Add a new spot</button>
      </div>     
      <div className="list-part">
        <h3>Listings</h3>
        <div className='listing-info'>
          <div className='Picture'>Thumbnail</div>
          <div className='space-information'>
            <div className='spot-title'>Good spot in North</div>
            <div className='location'>2 Fig Tree La, North Sydney NSW 2060 Australia</div>
            <div className='spot-type'>Outdoor lot</div>
            <div className='way-to-access'>Keys</div>
          </div>
          <div className='manipulation-link'>
            <div className='first-line-link'>
              <Link to="/home" className='edit-link'>Edit</Link><span>      </span>
              <Link to="/home" className='delete-link'>Delete</Link>
            </div>
            <div className='second-line-link'>
              <Link to="/home" className='check-orders-link'>Check Orders</Link>
            </div>     
          </div>
          <div className='price'>
            <div className='price-item'>$240 /WEEK</div>
            <div className='price-item'>$40  /DAY</div>
            <div className='price-item'>$7   /Hour</div>

          </div>
        </div>


        {/* link to add */}
        <div className='hint-msg'>
          {/* TODO:这里需要之后修改链接路由*/}
          <div className='link-to-add'>
            <Link to="/home">Add a spot</Link>
          </div>  
        </div>
      </div>
    </div>
  );
}

export default Listings;