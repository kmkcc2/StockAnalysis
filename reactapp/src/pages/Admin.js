import SideBar from '../components/global/SideBar'
import Card from '../components/global/Card'
import { Outlet, useNavigate } from 'react-router-dom'
import './MainCard.css'
import { useEffect, useState } from 'react'
import AccessValidator from '../components/global/authentication/validators/AccessValidator'
import { access } from '../components/global/authentication/validators/Access'
import MainCard from './MainCard'

export default function Admin() {
  const navigate = useNavigate()
  const [authorized, setAuthorized] = useState(false)
  useEffect(() => {
    const userAccess = AccessValidator('admin')
    if (userAccess === access.ADMIN) {
      setAuthorized(true)
    } else {
      navigate('/login')
    }
  }, [navigate])
  return (
    <Card>
      {authorized && (
        <>
          <SideBar sidebar='admin'></SideBar>
          <MainCard>
            <Outlet />
          </MainCard>
        </>
      )}{' '}
    </Card>
  )
}
