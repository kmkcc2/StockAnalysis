import { useLocation, useNavigate } from 'react-router-dom'

export default function MainCard(props) {
  const location = useLocation()
  const navigate = useNavigate()
  function back() {
    navigate(-1)
  }
  return (
    <div className='MainCard'>
      {(location.pathname === '/' || location.pathname === '/admin') && (
        <div className='noBlurBackground'>
          <div className='back' onClick={back}></div>
          {props.children}
        </div>
      )}
      {(location.pathname !== '/' || location.pathname !== '/admin') && (
        <div className='blurBackground'>
          <div className='back' onClick={back}></div>
          {props.children}
        </div>
      )}
    </div>
  )
}
