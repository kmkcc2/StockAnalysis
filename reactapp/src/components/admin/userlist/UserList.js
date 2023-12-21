import UserListComponent from './UserListComponent'
import UserListComponentHeader from './UserListComponentHeader'
import { useState, useEffect } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import classes from './UserList.module.css'
import SearchForUser from './SearchForUser'
export default function UserList(props) {
  const token = sessionStorage.getItem('token')

  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState([])

  async function fetchUsers() {
    setIsLoading(true)
    const response = await fetch('http://127.0.0.1:5000/api/users', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    const data = await response.json()
    setUsers(data)
    setIsLoading(false)
  }
  useEffect(() => {
    fetchUsers()
  }, [])
  return (
    <div className={ classes.container }>
      <SearchForUser changeUserList={setUsers}/>
      <UserListComponentHeader></UserListComponentHeader>
      {users &&
        users.map((user) => {
          return (
            <UserListComponent
              id={user.id}
              email={user.email}
              isActive={user.isActive}
              role={user.role}
            ></UserListComponent>
          )
        })}
      {isLoading && (
        <div className='loading-dots'>
          <ThreeDots
            height='80'
            width='80'
            radius='9'
            color='white'
            ariaLabel='three-dots-loading'
            wrapperStyle={{}}
            wrapperClassName='loading-spinner'
            visible={true}
          />
        </div>
      )}
    </div>
  )
}
