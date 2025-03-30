import React, { useEffect } from 'react'
import logo from '../images/logo.png'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from '../images/authPageSide.png'
import { api_base_url } from '../helper';



const Login = () => {
    const[Email, setEmail] = useState("");
    const[Pwd, setPwd] = useState("");

    const navigate = useNavigate();
    const [error, seterror] = useState("")

    useEffect(() => {
     
        document.title = "CodeFusion - Login"; 
      
    }, []);

    

    

    const submitForm = (e) => {
        e.preventDefault();
        fetch( api_base_url + "/login",{
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email:Email,
                password:Pwd
            })
        }).then(res => res.json()).then(data =>{
            if(data.success === true){
                localStorage.setItem("token", data.token);
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("userId", data.userId );
                setTimeout(() => {
                    window.location.href = "/"
                },200)

            }else{
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
                        <input required onChange={(e) => {setEmail(e.target.value)}} value={Email} type="text" placeholder='Email'/>
                    </div>
                    <div className="inputBox">
                        <input required onChange={(e) => {setPwd(e.target.value)}} value={Pwd} type="text" placeholder='Password  '/>
                    </div>
                    <p className='text-gray-700'> Don't have an account? <Link className='text-[#00AEEE]' to='/SignUp'>SIgn Up</Link></p>
                    <p className='text-red-500 text-[14px] my-2'>{error}</p>

                    <button className="btnBlue w-full [mt-20px] ">Log In</button>
                </form>
            </div>
            <div className="right w-[55%]">
                <img className= 'h-[100vh] w-[100%] object-cover'src={image} alt="" />
            </div>
        </div>
    </>
  )
}

export default Login
