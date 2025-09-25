import React, { useState } from "react";
import Sidebar, { SidebarItem } from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { Outlet, useLocation } from "react-router-dom";

import { RiHome9Line } from "react-icons/ri";
import { BiCategory } from "react-icons/bi";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { TbRobot } from "react-icons/tb";
import { GrHelpBook } from "react-icons/gr";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";

export default function Layout({ auth, setAuth }) {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar>
        <SidebarItem
          icon={<RiHome9Line size={20} />}
          text="Home"
          to="/homepage"
          active={location.pathname === "/homepage"}
        />

        {auth.role === "admin" && (
          <SidebarItem
            icon={<BiCategory size={20} />}
            text="Dashboard"
            to="/dashboard"
            active={location.pathname === "/dashboard"}
          />
        )}

        <SidebarItem
          icon={<MdOutlineNotificationsActive size={20} />}
          text="Notification"
          to="/notifications"
          active={location.pathname === "/notifications"}
          alert
        />
        <SidebarItem
          icon={<TbRobot size={20} />}
          text="About"
          to="/about"
          active={location.pathname === "/about"}
        />
        <hr className="my-3 opacity-15" />
        <SidebarItem
          icon={<GrHelpBook size={20} />}
          text="Help"
          to="/help"
          active={location.pathname === "/help"}
        />
        <SidebarItem
          icon={<IoSettingsOutline size={20} />}
          text="Settings"
          to="/settings"
          active={location.pathname === "/settings"}
        />
        <SidebarItem
          icon={<IoLogOutOutline size={20} className="text-red-400" />}
          text="Logout"
          to="/logout"
        />
      </Sidebar>

      <div className="flex flex-col flex-1 overflow-auto">
        {/* Pass auth prop here */}
        <Header onLoginClick={() => setShowLogin(true)} auth={auth} />
        <main className="flex-1 bg-[#F2EFE7]">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Login popup */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <Login setAuth={setAuth} onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
