import SideBar from '../components/global/SideBar'
import Card from '../components/global/Card'
import { Outlet } from 'react-router-dom'
import './MainCard.css'
import MainCard from './MainCard'

export default function Guest(props) {

  return (
    <Card>
      <SideBar sidebar='guest'></SideBar>
      <MainCard>
        <Outlet />
      </MainCard>
    </Card>
  )
}
