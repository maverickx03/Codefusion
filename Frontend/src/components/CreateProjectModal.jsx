import React from "react";

const CreateProjectModal = ({ onClose, projectTitle, setProjectTitle, createProj }) => {
  return (
    <div className="model fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.4)] flex justify-center items-center flex-col">
      <div className="mainModel w-[25vw] h-[25vh] bg-[#141414] rounded-lg p-[20px]">
        <h2 className="text-3xl pb-5">Create New Project</h2>
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          placeholder="Enter Project Title"
          className="w-full p-2 border rounded mb-4 text-black"
        />
        <div className="flex w-full items-center mt-3 gap-[10px]">
          <button onClick={onClose} className="p-[10px] rounded-lg bg-[#ff4343] text-white cursor-pointer min-w-[49%]">Cancel</button>
          <button onClick={createProj} className="p-[10px] rounded-lg bg-blue-400 text-white cursor-pointer min-w-[49%]">Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
