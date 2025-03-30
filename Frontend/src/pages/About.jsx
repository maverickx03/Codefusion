import React, { useEffect } from "react";
import Navbar from "../components/Navbar";

const About = () => {
    useEffect(() => {
         
            document.title = "CodeFusion - About"; 
          
        }, []);
  return (
    <>
    <Navbar/>
    <div className="text-white bg-[#1a1a1a] min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">About CodeFusion</h1>
      <p className="text-lg mb-6">
        CodeFusion is a powerful real-time collaborative coding platform designed to bring developers together from anywhere in the world. Whether you're working on projects, conducting interviews, or learning with peers, CodeFusion makes collaboration seamless and productive.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Key Features:</h2>
      <ul className="list-disc list-inside space-y-2 text-lg">
        <li>Live code collaboration using Liveblocks</li>
        <li>Multi-language support (C, C++, Python, JavaScript)</li>
        <li>Real-time input/output syncing with Judge0 API integration</li>
        <li>Persistent project saving with MongoDB backend</li>
        <li>Effortless room creation and secure access</li>
        <li>Integrated chat system for team communication</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Our Mission</h2>
      <p className="text-lg">
        Our goal is to empower teams, educators, and developers by providing a smooth, real-time, and intuitive platform to write, test, and build code collaboratively.
      </p>
    </div>
    </>
  );
};

export default About;
