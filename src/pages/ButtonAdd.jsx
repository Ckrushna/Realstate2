import React from 'react'
import { useNavigate } from "react-router-dom";
const ButtonAdd = () => {
const navigate = useNavigate();

const handleClick = async() => {
 navigate('/AddProject')
}


  return (
    <div className='home'>
        <h2>Homepage</h2>
        <button onClick={handleClick}>Click me</button>
    </div>
  )
};

export default ButtonAdd
