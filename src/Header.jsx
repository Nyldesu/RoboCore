import React from 'react';
import { TbHome } from "react-icons/tb";
import { BiCategory } from "react-icons/bi";
import { TbRobot } from "react-icons/tb";
import './styles/Header.css';

const Header = () => {
  return (
    <nav className="headerContainer">
      <div className='logoContainer'>
        <img src='./LOGO DARK.png'/>
        <h1>RoboCore</h1>
      </div>

      <div className='rightSection'>
        <a href='#Hero' className='icon-link' aria-label='Home'>
          <TbHome className='icon'/>
        </a>
        <a href='#Explore' className='icon-link'>
          <BiCategory className='icon'/>
        </a>
        <a href='#Hero' className='icon-link'>
          <TbRobot className='icon'/>
        </a>
        <button className='loginButton'>Login</button>
      </div>

    </nav>
  );
};

export default Header;
