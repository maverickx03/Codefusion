import React, { useEffect } from 'react'

const NoPage = () => {
  useEffect(() => {
    document.title = "CodeFusion - NoPage"; 
}, []);
  return (
    <div>NoPage</div>
  )
}

export default NoPage