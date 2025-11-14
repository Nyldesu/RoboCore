import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import robocoreLogo from "../assets/robocoreLogo.png";
import { createContext, useContext, useState } from "react";
import { Link } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <aside className="h-screen z-50 relative">
      <nav className="h-full flex flex-col bg-white shadow-sm">
        <div className="p-5 pb-2 flex justify-between items-center">
          <img
            src={robocoreLogo}
            className={`overflow-hidden transition-all ${expanded ? "w-30" : "w-0"}`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <LuPanelLeftClose /> : <LuPanelLeftOpen />}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-5">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, to, onClick }) {
  const { expanded } = useContext(SidebarContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const auth = JSON.parse(localStorage.getItem("auth"));
  const isAuthenticated = auth?.isAuthenticated;

  if (text === "Logout" && !isAuthenticated) return null;

  const handleClick = () => {
    if (text === "Logout") setShowConfirm(true);
    else if (onClick) onClick();
  };

  const confirmLogout = () => {
    setShowConfirm(false);
    if (onClick) onClick();
  };

  const cancelLogout = () => setShowConfirm(false);

  const ItemContent = (
    <div
      onClick={handleClick}
      className={`group relative flex items-center py-2 px-4 my-1 font-medium rounded-md transition-colors cursor-pointer
        ${active ? "bg-[#9ACBD0] text-[#006A71]" : "hover:bg-sky-50 text-gray-600"}`}
    >
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-[#48A6A7] ${expanded ? "" : "top-2"}`}
        />
      )}
      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-4 py-1 ml-6
            bg-indigo-100 text-[#006A71] text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </div>
  );

  return (
    <>
      {to ? <Link to={to}>{ItemContent}</Link> : ItemContent}
      {showConfirm && text === "Logout" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-lg font-semibold mb-3">Confirm Logout</h2>
            <p className="text-gray-600 mb-5">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
