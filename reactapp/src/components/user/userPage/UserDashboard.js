import { useNavigate, useParams, useLocation } from 'react-router-dom'
import classes from './UserDashboard.module.css'
import { useEffect, useState } from 'react'
import { DialogClass } from '../../global/InformationDialogs'
export default function UserDashboard(props) {
  const { state } = useLocation()
  const token = sessionStorage.getItem('token')
  const navigate = useNavigate()
  const params = useParams()
  const [user, setUser] = useState({})
  const [passwordType, setpasswordType] = useState('password')

  function changeInputType() {
    if (passwordType === 'password') setpasswordType('text')
    else setpasswordType('password')
  }
  let id = params.id
  async function fetchUser() {
    const response = await fetch('http://127.0.0.1:5000/api/users/' + id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
    const data = await response.json()
    if (response.status === 403 || response.status === 401) {
      navigate('/login')
    }
    setUser(data[0])
  }
  useEffect(() => {
    fetchUser()
  }, [])
  function verifyEmail() {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const email = document.getElementById('emailChangeUser')
    let invalidPaylod = false
    if (email.value === '') {
      errorLabels[0].innerHTML = 'Proszę podać adres email'
      invalidPaylod = true
    } else {
      errorLabels[0].innerHTML = ''
      invalidPaylod = false
      if (
        !String(email.value).match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)
      ) {
        errorLabels[0].innerHTML = 'Proszę podać prawidłowy adres email'
        invalidPaylod = true
      } else {
        errorLabels[0].innerHTML = ''
        invalidPaylod = false
      }
    }
    if (!invalidPaylod) sendRequestEmail(email.value)
  }
  function verifyPassword() {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const password = document.getElementById('pswdChangeUser')
    password.value = password.value.trim()
    const confPassword = document.getElementById('cpswdChangeUser')
    confPassword.value = confPassword.value.trim()
    let invalidPaylod = false
    if (password.value === '') {
      errorLabels[1].innerHTML = 'Proszę podać hasło'
      invalidPaylod = true
    } else {
      errorLabels[1].innerHTML = ''
      if (password.value !== confPassword.value) {
        errorLabels[2].innerHTML = 'Podane hasła muszą być identyczne'
        invalidPaylod = true
      } else {
        errorLabels[2].innerHTML = ''
        if (password.value.length < 8) {
          errorLabels[1].innerHTML = 'Hasło musi posiadać conajmniej 8 znaków'
          invalidPaylod = true
        } else {
          errorLabels[1].innerHTML = ''
          invalidPaylod = false
        }
      }
    }

    if (!invalidPaylod) sendRequestPassword(password.value)
  }
  async function sendRequestEmail(email) {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const response = await fetch('http://127.0.0.1:5000/api/users/' + user.id, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ email })
    })
    const data = await response.json()
    if (response.status !== 200) {
      if (data.message === 'Email already in use.') {
        errorLabels[0].innerHTML = 'Konto z podanym adresem email już istnieje.'
      }
      if (data.message === 'user not found') {
        navigate('/login', {
          state: {
            message: 'Coś poszło nie tak... Proszę zaloguj się ponownie',
            class: DialogClass.ERROR
          }
        })
      }
      if (data.message === 'Invalid credentials') {
        errorLabels[0].innerHTML = 'Email niepoprawny'
      }
    }
    if (response.status === 200) {
      redirect('Email zmieniony pomyślnie')
    }
  }
  async function sendRequestPassword(password) {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const response = await fetch('http://127.0.0.1:5000/api/users/' + user.id, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ password })
    })
    const data = await response.json()
    if (response.status !== 200) {
      if (data.message === 'Email already in use.') {
        errorLabels[0].innerHTML = 'Konto z podanym adresem email już istnieje.'
      }
      if (data.message === 'user not found') {
        navigate('/login', {
          state: {
            message: 'Coś poszło nie tak... Proszę zaloguj się ponownie',
            class: DialogClass.ERROR
          }
        })
      }
      if (data.message === 'Invalid credentials') {
        errorLabels[0].innerHTML = 'Email niepoprawny'
      }
    }
    if (response.status === 200) {
      redirect('Hasło zmienione pomyślnie')
    }
  }
  function redirect(message) {
    document.getElementById('pswdChangeUser').value = ''
    document.getElementById('cpswdChangeUser').value = ''
    navigate('/user/' + user.id, {
      state: { message, class: DialogClass.SUCCESS }
    })
  }
  function changeEmail(em) {
    setUser({ ...user, email: em })
  }
  async function deleteAccount() {
    if (
      window.confirm(
        'Jesteś pewny, że chcesz usunąć konto?\nTej decyzji nie da się cofnąć.'
      )
    ) {
      const response = await fetch('http://127.0.0.1:5000/api/users/' + user.id, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          Authorization: token
        }
      })
      if(response.status === 204){
        sessionStorage.removeItem('token')
        navigate('/login', {state: {
          message: 'Konto zostało usunięte',
          class: DialogClass.SUCCESS
        }})
      }else{
        navigate('/user/'+user.id, {state: {
          message: 'Wystąpił nieoczekiwany błąd.',
          class: DialogClass.ERROR
        }})
      }
    }
  }
  return (
    <div className={classes.container}>
      <h1> Mój profil </h1>
      {state && state.message && (
        <h2 className={state.class}>{state.message}</h2>
      )}
      <div className={classes.flex}>
        <div className={classes.left}>
          <div className={classes.leftTop}>
            <div className={classes.credentials}>
              <label>Adres email</label>
              <label name='errorLabel' className={classes.errorLabel}></label>
              <input
                type='email'
                value={user.email}
                id='emailChangeUser'
                onChange={(e) => changeEmail(e.target.value)}
              />
              <button type='button' onClick={verifyEmail}>
                Zapisz
              </button>
            </div>
          </div>
          <div className={classes.leftBottom}>
            <div className={classes.credentials}>
              <label name='errorLabel' className={classes.errorLabel}></label>
              <input
                type={passwordType}
                id='pswdChangeUser'
                placeholder='Podaj nowe hasło'
              />
              <label name='errorLabel' className={classes.errorLabel}></label>
              <input
                type={passwordType}
                id='cpswdChangeUser'
                placeholder='Potwierdź hasło'
              />
              <div
                style={{ display: 'flex', alignItems: 'center', height: '2em' }}
              >
                <input
                  style={{ width: '0.7em' }}
                  type='checkbox'
                  id='cpswdChangeAdminVisibility'
                  onChange={changeInputType}
                />{' '}
                <p>Pokaż hasło</p>
              </div>
              <button type='button' onClick={verifyPassword}>
                Zapisz
              </button>
            </div>
          </div>
        </div>
        <div className={classes.right}>
          <div className={classes.pay}>
            <p> Status konta: </p>
            {user.isActive && <p className={classes.payed}>Opłacone</p>}
            {!user.isActive && (
              <>
                <p className={classes.unpayed}>Nieopłacone</p>
              </>
            )}
          </div>
          {!user.isActive && <button type='button'>Zapłać</button>}
          <hr />
          <div className={classes.pay}>
            <p> Typ konta: </p>
            <p> {user.role} </p>
          </div>
          <hr />
          <div className={classes.deleteAccount}>
            <button type='button' onClick={deleteAccount}>
              Usuń konto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
