import { RiHome9Line } from "react-icons/ri";
import { BiCategory } from "react-icons/bi";
import { TbRobot } from "react-icons/tb";
import LOGODARK from "../assets/LOGODARK.png";

const Header = ({ onLoginClick, auth }) => {
  return (
    <nav className="sticky w-full flex items-center justify-between px-6 py-3 bg-[#48A6A7] shadow-md z-4">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        <img src={LOGODARK} alt="RoboCore Logo" className="w-15 object-contain" />
        <h1 className="text-white  font-[700] text-2zxl">ROBOCORE</h1>
      </div>

      {/* Navigation Section */}
      <div className="flex items-center space-x-10">
        <a
          href="#HERO"
          className="text-white hover:text-[#006A71] hover:scale-115 transition-all duration-400"
          aria-label="Home"
        >
          <RiHome9Line size={24} />
        </a>
        <a
          href="#Explore"
          className="text-white hover:text-[#006A71] hover:scale-115 transition-all duration-400"
          aria-label="Explore"
        >
          <BiCategory size={24} />
        </a>
        <a
          href="#Hero"
          className="text-white hover:text-[#006A71] hover:scale-115 transition-all duration-400"
          aria-label="Robot"
        >
          <TbRobot size={24} />
        </a>

        {/* Show Login button only if not logged in as admin */}
        {(!auth?.isAuthenticated || auth.role === "guest") && (
          <button
            onClick={onLoginClick}
            className="ml-3 px-10 py-4 bg-[#9ACBD0] text-white font-medium rounded-full hover:bg-[#006A71] transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
