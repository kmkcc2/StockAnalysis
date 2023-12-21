import { Link } from 'react-router-dom'

export function Logout(prop) {
  function deleteToken(){
    sessionStorage.removeItem('token')

    prop.hideSideBar()
  }
  return (
    <Link to='/' onClick={deleteToken}>
      <div className='SideBarOption logout'>
        <div>Wyloguj</div>
      </div>
    </Link>
  )
}
