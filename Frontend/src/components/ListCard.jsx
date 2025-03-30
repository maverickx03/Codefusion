import React from 'react'
import img from '../images/code.png'
import deleteImg from '../images/delete.png'
import { useState } from 'react'
import { api_base_url } from '../helper'
import { useNavigate } from 'react-router-dom'

const ListCard = ({item, title}) => {

  const navigate =useNavigate();

  const [isDeleteModelShow, setisDeleteModelShow] = useState(false)
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
    <div className='listCard mb-2 flex items-center justify-between w-full p-[10px] bg-[#141414] rounded-lg cursor-pointer hover:bg-[#202020]'>
        <div onClick={() => { navigate(`/CollaborativeEditor/${item._id}`)}} className='flex items-center gap-2'>
            <img className='w-[80px]' src={img} alt="" />
            <div>
                <h3 className='text-[20px]'>{item.title}</h3>
                <p className='text-[gray] text-[14px]'>Created on {new Date(item.date).toDateString()}</p>
            </div>
        </div>
        <div>
            <img onClick={() => {setisDeleteModelShow(true)}} className='w-[30px] cursor-pointer mr-4' src={deleteImg} alt="" />
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

export default ListCard