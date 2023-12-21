import SideBar from '../components/global/SideBar'
import Card from '../components/global/Card'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './MainCard.css'
import { useEffect, useState } from 'react'
import AccessValidator from '../components/global/authentication/validators/AccessValidator'
import { access } from '../components/global/authentication/validators/Access'
import MainCard from './MainCard'
export default function User(props) {
  const navigate = useNavigate()
  const location = useLocation()
  const [authorized, setAuthorized] = useState(false)
  useEffect(() => {
    const userAccess = AccessValidator('user')
    if (userAccess === access.USER || userAccess === access.ADMIN) {
      setAuthorized(true)
      if (location.pathname === '/user'){
        navigate('/user/trendings')
      }
    }
    if (userAccess === access.NONE) {
      setAuthorized(false)
      navigate('/login')
    }
    if (userAccess === access.UNPAID) {
      navigate('/payment')
    }
  }, [navigate])
  return (
    <Card>
      {authorized && (
        <>
          <SideBar sidebar='user'></SideBar>
          <MainCard>
            <Outlet />
          </MainCard>
        </>
      )}
    </Card>
  )
}
