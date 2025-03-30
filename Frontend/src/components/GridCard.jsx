import React from 'react'
import codeImg from "../images/code.png"
import deleteImg from "../images/delete.png"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GridCard = ({item}) => {

  

  const [isDeleteModelShow, setisDeleteModelShow] = useState(false)
  const navigate = useNavigate();

  const deleteProj = (id) => {
    fetch(api_base_url + "/deleteProjects", {
      mode: "cors",
      method: "POST",
      headers : {
        "Content-Type" : "application/json",
      },
      body : JSON.stringify({
        projId : id,
        userId: localStorage.getItem("userId")
        
      })
    }).then(res=> res.json()).then(data => {
      if(data.success){
        setisDeleteModelShow(false)
        window.location.reload()
      }
      else{
        alert(data.message)
        setisDeleteModelShow(false)
        
      }
    })
  }
  return (
    <>
    <div className="gridCard bg-[#141414] w-[270px] h-[180px] cursor-pointer hover:bg-[#202020] p-[10px] rounded-lg shadow-lg shadoow-black/50">
    <div onClick={() => { navigate(`/editor/${item._id}`)}}   >
    <img className= 'w-[90px]' src={codeImg} alt="" />
    <h3 className='text-[20px] w-[90%] line-clamp-1'>{item.title}</h3>
    </div>
    <div className="flex items-center justify-between">
    <p className='text-[gray] text-[14px]'>Created on {new Date(item.date).toDateString()}</p>
    <img onClick={() => {setisDeleteModelShow(true)}} src={deleteImg} className='w-[30px] cursor-pointer' alt="" />
    </div>
    
    </div>
    {
      isDeleteModelShow ? <div className="model fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.4)] flex justify-center items-center flex-col">
      <div className="mainModel w-[25vw] h-[25vh] bg-[#141414] rounded-lg p-[20px]">
        <h3 className='text-3xl pb-5'>Do you want to delete <br />
        this project?</h3>
        <div className='flex w-full items-center mt-3 gap-[10px]'>
          <button onClick={() => {deleteProj(item._id)}} className='p-[10px] rounded-lg bg-[#ff4343] text-white cursor-pointer min-w-[49%]' >Delete</button>
          <button onClick={() => {setisDeleteModelShow(false)}} className='p-[10px] rounded-lg bg-[#1A1919] text-white cursor-pointer min-w-[49%]' >Cancel</button>
        </div>
      </div>
    </div> : ""
    }
    </>
  )
}

export default GridCard