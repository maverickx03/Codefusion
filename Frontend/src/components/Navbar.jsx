import React, { useEffect } from "react";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { IoGrid } from "react-icons/io5";
import { api_base_url, toggleClass } from "../helper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({isGridLayout, setIsGridLayout}) => {
  const [data, setdata] = useState(null);
  const [error, seterror] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn",false);
    setTimeout(() => {
      window.location.href = "/login"
  },200)
  }

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
          setdata(data.user);
        } else {
          seterror(data.message);
        }
      });
  }, []);

  return (
    <>
      <div className="navbar flex items-center justify-between px-[100px] h-[80px] bg-[#141414] ">
        <div className="logo">
          <Link to="/"><img className="w-[150px] cursor-pointer" src={logo} alt="" /></Link>
        </div>
        <div className="links flex items-center gap-10">
          <Link to ="/" >Home</Link>
          <Link to ="/About"> About</Link>
          <Link to ="/Contact">Contact</Link>
          <Link to ="/Services">Services</Link>
          <button onClick = {logout} className="btnBlue !bg-red-500 min-w-[120px] ml-2 hover:!bg-red-6000">Log Out</button>
          <Avatar
            onClick={() => {
              toggleClass(".dropDownNavbar", "hidden");
            }}
            name={data ? data.username : ""}
            size="40"
            round="50%"
            className="cursor-pointer ml-2"
          />
        </div>
        <div className="dropDownNavbar hidden absolute right-[60px] shadow-lg shadow-black/50 top-[80px] bg-[#1A1919] p-[10px] rounded-lg w-[150px] h-[135px]">
          <div className="py-[10px] border-b-[1px] border-b-[#fff]">
            <h3 className="text-[17px] " style={{ lineHeight: 1 }}>
              {data ? data.name : ""}
            </h3>
          </div>
          <i
            onClick = {() => {setIsGridLayout(!isGridLayout)}} className="flex items-center gap-2 mt-3 mb-2 cursor-pointer"
            style={{ fontStyle: "normal" }}
          >
            <IoGrid className="text-[20px]" />
            {isGridLayout ? "List" : "Grid"} Layout
          </i>
        </div>
      </div>
    </>
  );
};

export default Navbar;
