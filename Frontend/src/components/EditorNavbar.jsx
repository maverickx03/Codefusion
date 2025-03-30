import React, { useState, useEffect } from "react";
import logo from "../images/logo.png";
import { LuShare, LuChevronDown } from "react-icons/lu";
import { useOthers, useUpdateMyPresence } from "@liveblocks/react";
import { api_base_url } from "../helper";
import ChatBox from "./ChatBox";

const EditorNavbar = ({ projectName = "My First Project" }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();
  console.log("others:", others);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(api_base_url + "/getUserDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const username = data.user.username;
            updateMyPresence({ name: username }); // Set name in presence
          }
        })
        .catch((err) => {
          console.error("Failed to fetch username:", err);
        });
    }
  }, [updateMyPresence]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
    setShowDropdown(false);
  };

  return (
    <div className="navbar flex items-center justify-between px-10 h-[80px] bg-[#141414] text-white relative">
      {/* Left - Logo */}
      <div className="logo">
        <img className="w-[150px] cursor-pointer" src={logo} alt="Logo" />
      </div>

      {/* Center - Project Name */}
      <div className="text-lg font-medium">
        File / <span className="text-gray-400">{projectName}</span>
      </div>

      {/* Right - Share Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1f1f1f] rounded-md hover:bg-[#2a2a2a]"
        >
          <LuShare className="text-xl" />
          Collaborate
          <LuChevronDown className="text-sm" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-60 bg-[#1f1f1f] text-sm text-white rounded-md shadow-lg z-50">
            <button
              onClick={handleCopyLink}
              className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a]"
            >
              Share Project Link
            </button>

            <div className="border-t border-gray-700 my-1"></div>

            <div className="px-4 py-2">
              <div className="font-semibold mb-1">Joined Members:</div>
              {others.length === 0 ? (
                <div className="text-gray-400">No one else yet</div>
              ) : (
                <ul className="space-y-1">
                  {others.map(({ connectionId, presence }) => (
                    <li
                      key={connectionId}
                      className="text-gray-300 bg-[#2a2a2a] px-2 py-1 rounded"
                    >
                      {presence?.name || "Anonymous"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={() => setShowChat((prev) => !prev)}
              className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a]"
            >
              {showChat ? "Close Chat" : "Open Chat"}
            </button>
          </div>
        )}
      </div>
      <ChatBox isOpen={showChat} onClose={() => setShowChat(false)} />

    </div>
    
  );
  
};

export default EditorNavbar;
