import './UserListComponent.css'
import React from 'react'
import { Link } from 'react-router-dom'
export default function UserListComponent(props) {
  return (
    <div>
      <Link to={'/admin/users/' + props.id}>
        <div className='userRecord userRecordHover'>
          <div className='userProperty idProperty'>{props.id}</div>
          <div className='userProperty emailProperty'>{props.email}</div>
          <div className='userProperty activeProperty'>{props.isActive.toString()}</div>
          <div className='userProperty roleProperty'>{props.role}</div>
        </div>
      </Link>
    </div>
  )
}
