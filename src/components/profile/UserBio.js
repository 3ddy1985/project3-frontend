import React, { useState, useEffect } from "react";
import profilePic from '../../assets/profilePic.jpg'
import EditIcon from '../../assets/pencil_icon.png'
import { editUserDetails } from "../users/api";


const UserBio = (props) => {

  const [editMode, setEditMode] = useState(false);
  const [updatedUserDetails, updateDetails] = useState(props.currentUser);

  const handleEditClick = () => {
    setEditMode(true)
  };

  const handleSaveClick =(e) => { 
    editUserDetails(props.currentUser.id, updatedUserDetails)
    //  
    // Need to update the user details
    .then(() => {
      console.log("Post saved successfully");
      setEditMode(false);
      props.updateCurrentUserFromDatabase(props.currentUser.id)
    })
    .catch((error) => {
      console.error("Error editing post:", error);
    });
  }

  const handleDetailsChange = (e) => {
    const fieldName = e.target.id
    updateDetails(existingValues => ({...existingValues, [fieldName]: e.target.value}));
  }

  return (
      <>
      {editMode ? ( 
        <div>
          <img src={profilePic}/>
          <img className='pencil-icon' src={EditIcon} onClick={handleEditClick} width={50}/>
          <p>FirstName:</p><textarea id='firstName' value={updatedUserDetails.firstName} onChange={handleDetailsChange}/>          
          <p>LastName:</p><textarea id='lastName' value={updatedUserDetails.lastName} onChange={handleDetailsChange}/>
          <p>UserName:</p><textarea id='userName' value={updatedUserDetails.userName} onChange={handleDetailsChange}/>
          <p>Email:</p><textarea id='email' value={updatedUserDetails.email} onChange={handleDetailsChange}/>
          <p>Location:</p><textarea id='location' value={updatedUserDetails.location} onChange={handleDetailsChange}/>
          <button onClick={handleSaveClick}>Save</button>
      </div>     
      ) : (
        <div>
        <img src={profilePic}/>
        <img className='pencil-icon' src={EditIcon} onClick={handleEditClick} width={50}/>
        <p>FirstName: {props.currentUser.firstName}</p>
        <p>LastName: {props.currentUser.lastName}</p>
        <p>UserName: {props.currentUser.userName}</p>
        <p>Email: {props.currentUser.email}</p>
        <p>Location: {props.currentUser.location}</p>
      </div>
      )}
    </>
  )
}

export default UserBio