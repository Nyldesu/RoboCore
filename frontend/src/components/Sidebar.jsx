import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import robocoreLogo from "../assets/robocoreLogo.png";
import { createContext, useContext, useState } from "react";
import { Link } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <aside className="h-screen z-99">
      <nav className="h-full flex flex-col bg-white shadow-sm">
        <div className="p-5 pb-2 flex justify-between items-center">
          <img
            src={robocoreLogo}
            className={`overflow-hidden transition-all ${expanded ? "w-30" : "w-0"}`}
            alt=""
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

  const ItemContent = (
    <div
      onClick={onClick}
      className={`group relative flex items-center py-2 px-4 my-1 font-medium rounded-md transition-colors cursor-pointer
        ${active ? "bg-[#9ACBD0] text-[#006A71]" : "hover:bg-sky-50 text-gray-600"}`}
    >
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-[#48A6A7] ${
            expanded ? "" : "top-2"
          }`}
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

  return to ? <Link to={to}>{ItemContent}</Link> : ItemContent;
}
