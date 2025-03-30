import React, { useEffect } from "react";
import Navbar from "../components/Navbar";

const Services = () => {
    useEffect(() => {
         
            document.title = "CodeFusion - Services"; 
          
        }, []);
  return (
    <>
    <Navbar/>
    <div className="text-white bg-[#1a1a1a] min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Our Services</h1>

      <ul className="list-disc list-inside space-y-4 text-lg">
        <li>
          <strong>Collaborative Coding:</strong> Join live coding sessions with teammates or peers and edit the same codebase in real-time.
        </li>
        <li>
          <strong>Multi-language Execution:</strong> Write and run code in popular languages like C, C++, Python, and JavaScript using integrated Judge0 API.
        </li>
        <li>
          <strong>Code Saving & Project Management:</strong> Create and manage your coding projects with persistent storage using MongoDB.
        </li>
        <li>
          <strong>Live Chat & Communication:</strong> Talk with collaborators inside the room to boost productivity and brainstorming.
        </li>
        <li>
          <strong>Secure Room Sharing:</strong> Create unique room links to work privately or share with your team securely.
        </li>
      </ul>
    </div>
    </>
  );
};

export default Services;
