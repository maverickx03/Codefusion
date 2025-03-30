import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ListCard from "../components/ListCard";
import GridCard from "../components/GridCard";
import { api_base_url } from "../helper";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "../components/CreateProjectModal";

const Home = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [isRoomModelShow, setIsRoomModelShow] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setuserData] = useState(null);
  const [userError, setuserError] = useState("");
  const [isGridLayout, setIsGridLayout] = useState(false);

  useEffect(() => {
    document.title = "CodeFusion - Home"; // Or whatever suffix you want
  }, []);

  const navigate = useNavigate();

  // Create a new project
  const createProj = () => {
    if (projectTitle === "") {
      alert("Please Enter Project Title");
    } else {
      fetch(api_base_url + "/createProject", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: projectTitle,
          userId: localStorage.getItem("userId"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIsCreateModelShow(false);
            setProjectTitle("");
            alert("Project created Successfully");
            navigate(`/CollaborativeEditor/${data.projectId}`, {
              state: { title: projectTitle },
            });
          } else {
            alert("Something went wrong");
          }
        });
    }
  };

  // Create a new room

  // Fetch all projects
  const getProjects = () => {
    fetch(api_base_url + "/getProjects", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setData(data.projects);
        } else {
          setError(data.message);
        }
      });
  };

  useEffect(() => {
    getProjects();
  }, []);

  // Fetch user details
  useEffect(() => {
    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setuserData(data.user);
        } else {
          setuserError(data.message);
        }
      });
  }, []);

  return (
    <>
      <Navbar isGridLayout={isGridLayout} setIsGridLayout={setIsGridLayout} />
      <div className="flex items-center justify-between px-[100px] my-[40px]">
        <h2 className="text-2xl">Hi, {userData ? userData.username : ""} 👋</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Project..."
            className="p-2 rounded border"
          />
          <button
            onClick={() => setIsCreateModelShow(true)}
            className="btnBlue mb-4 text-[20px] px-[10px]"
          >
            +
          </button>
        </div>
      </div>

      <div className="cards">
        {isGridLayout ? (
          <div className="grid px-[100px]">
            {data.length > 0 ? (
              data.map((item, index) => (
                <GridCard key={index} item={item} title={item.title} />
              ))
            ) : (
              <p>No projects found.</p>
            )}
          </div>
        ) : (
          <div className="list px-[100px]">
            {data.length > 0 ? (
              data.map((item, index) => (
                <ListCard key={index} item={item} title={item.title} />
              ))
            ) : (
              <p>No projects found.</p>
            )}
          </div>
        )}
      </div>
      {isCreateModelShow && (
        <CreateProjectModal
          onClose={() => setIsCreateModelShow(false)}
          projectTitle={projectTitle}
          setProjectTitle={setProjectTitle}
          createProj={createProj}
        />
      )}
    </>
  );
};

export default Home;
