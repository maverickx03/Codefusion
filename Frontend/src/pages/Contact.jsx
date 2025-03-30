import React, { useEffect } from "react";
import Navbar from "../components/Navbar";

const Contact = () => {
    useEffect(() => {
         
            document.title = "CodeFusion - Contact"; 
          
        }, []);
  return (
    <>
    <Navbar/>
    <div className="text-white bg-[#1a1a1a] min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg">
         Feel free to reach out to us at:
      </p>
      <ul className="mt-4 space-y-2 text-lg">
        <li>Email: <a href="mailto:priyanshujha200@gmail.com" className="text-blue-400">priyanshujha200@gmail.com</a></li>
        <li>Phone: +91-62962-32864</li>
        <li>Address: Bengal College of Engineering and Technology, Durgapur, India</li>
      </ul>
    </div>
    </>
  );
};

export default Contact;
