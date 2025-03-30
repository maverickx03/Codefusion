import React, { useEffect } from 'react'
import logo from '../images/logo.png'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from '../images/authPageSide.png'
import { api_base_url } from '../helper';

const SignUp = () => {
    const[Username, setUsername] = useState("");
    const[Email, setEmail] = useState("");
    const[Pwd, setPwd] = useState("");
    const navigate = useNavigate();

    const [error, seterror] = useState("")
    
    useEffect(() => {
        document.title = "CodeFusion - SignUp"; 
    }, []);

    const submitForm = (e) => {
        e.preventDefault();

        fetch(api_base_url + "/signUp",{
            mode: "cors",
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body : JSON.stringify({
                username: Username,
                email : Email,
                password: Pwd
            })
    }).then((res) => res.json()).then((data)=>{
        if(data.success === true){
            alert("Account created successfully");
            navigate("/login")
        }
        else{
            seterror(data.message);

        }
    })
    }

    
  return (
    <>
        <div className="container w-screen min-h-screen flex items-center justify-between pl-[100px]">
            <div className="left w-[35%]">
                <img className='w-[200 px]' src={logo} alt="" />
                <form onSubmit={submitForm} className='w-full mt-[60px]' action="">
                    <div className="inputBox">
                        <input required onChange={(e) => {setUsername(e.target.value)}} value={Username} type="text" placeholder='Username'/>
                    </div>
                    <div className="inputBox">
                        <input required onChange={(e) => {setEmail(e.target.value)}} value={Email} type="text" placeholder='Email'/>
                    </div>
                    <div className="inputBox">
                        <input required onChange={(e) => {setPwd(e.target.value)}} value={Pwd} type="text" placeholder='Password  '/>
                    </div>
                    <p className='text-gray-700'> Already have an account? <Link className='text-[#00AEEE]' to='/login'>Login</Link></p>
                    <p className='text-red-500 text-[14px] my-2'>{error}</p>

                    <button className="btnBlue w-full mt-[20px] ">Sign Up</button>
                </form>
            </div>
            <div className="right w-[55%]">
                <img className= 'h-[100vh] w-[100%] object-cover'src={image} alt="" />
            </div>
        </div>
    </>
  )
}

export default SignUp