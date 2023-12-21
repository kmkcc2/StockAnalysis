import { Outlet } from 'react-router-dom'
import classes from './SearchForUser.module.css'
export default function SearchForUser(props) {
  async function filterUsers(event) {
    const token = sessionStorage.getItem('token')

    let pattern = event.target.value
    if (pattern.length >= 3) {
      const response = await fetch(
        'http://127.0.0.1:5000/api/users/tips/' + pattern,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      const data = await response.json()
      if (response.status !== 404) {
        props.changeUserList(data)
      }
    }else{
      const response = await fetch(
        'http://127.0.0.1:5000/api/users',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      const data = await response.json()
      props.changeUserList(data)
    }
  }

  return (
    <>
      <div className={`${classes.searchBarContainer} ${classes.relative}`}>
        <input
          className={classes.searchBarInput}
          id={props.id}
          placeholder='Wyszukaj użytkownika...'
          onChange={filterUsers}
          autoComplete='off'
        />
      </div>
      <Outlet />
    </>
  )
}
