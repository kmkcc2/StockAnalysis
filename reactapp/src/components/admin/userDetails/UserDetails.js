import { useLocation, useNavigate, useParams } from 'react-router-dom'
import classes from './UserDetails.module.css'
import { useEffect, useState } from 'react'
import { DialogClass } from '../../global/InformationDialogs'
export default function UserDetails() {
  const token = sessionStorage.getItem('token')
  const navigate = useNavigate()
  const params = useParams()
  const [user, setUser] = useState({})
  const [accountType, setAccountType] = useState('default')
  const [selectedRadio, setSelectedRadio] = useState('')
  const [passwordType, setpasswordType] = useState('password')
  const { state } = useLocation()

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
    setUser(data[0])
    setSelectedRadio(!!data[0].isActive ? 'yes' : 'no')
    setAccountType(data[0].role)
  }
  function verifyEmail() {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const email = document.getElementById('emailChangeAdmin')
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
    const password = document.getElementById('pswdChangeAdmin')
    const confPassword = document.getElementById('cpswdChangeAdmin')
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
        navigate('/admin/users/' + id, {
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
        navigate('/admin/users/' + id, {
          state: {
            message: 'Nie znaleziono takiego użytkownika',
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
  async function sendRequestStatusRole() {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const response = await fetch('http://127.0.0.1:5000/api/users/' + user.id, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        isActive: selectedRadio === 'yes' ? true : false,
        role: accountType
      })
    })
    const data = await response.json()
    if (response.status !== 200) {
      errorLabels[3].innerHTML = 'Coś poszło nie tak ...'
    }
    if (response.status === 200) {
      redirect('Konto zostało zaktualizowane')
    }
  }

  function redirect(message) {
    document.getElementById('pswdChangeAdmin').value = ''
    document.getElementById('cpswdChangeAdmin').value = ''
    navigate('/admin/users/' + id, {
      state: { message, class: DialogClass.SUCCESS }
    })
  }
  function changeEmail(em) {
    setUser({ ...user, email: em })
  }
  function changeRole() {
    if (accountType === 'user') setAccountType('admin')
    else setAccountType('user')
  }
  function changeStatus(event) {
    setSelectedRadio(event.target.value)
  }
  function changeInputType() {
    if(passwordType === 'password')
      setpasswordType('text')
    else
      setpasswordType('password')
  }
  useEffect(() => {
    fetchUser()
  }, [])
  return (
    <div className={classes.container}>
      <h1>Profil użytkownika {id}</h1>
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
                id='emailChangeAdmin'
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
              <input type={passwordType} id='pswdChangeAdmin' placeholder='Podaj nowe hasło'/>
              <label name='errorLabel' className={classes.errorLabel}></label>
              <input type={passwordType} id='cpswdChangeAdmin' placeholder='Potwierdź hasło'/>
              <label style={{fontSize: 'large'}}><input type='checkbox' id='cpswdChangeAdminVisibility' onChange={changeInputType}/> Pokaż hasło</label>
              <button type='button' onClick={verifyPassword}>
                Zapisz
              </button>
            </div>
          </div>
        </div>
        <div className={classes.right}>
          <div className={classes.userInfo}>
            <p> Status konta: </p>
            <label name='errorLabel' className={classes.errorLabel}></label>
            <div className={classes.radioTimeline}>
              <div className={classes.radioOption}>
                <input
                  type='radio'
                  name='accountStatus'
                  value='yes'
                  checked={selectedRadio === 'yes'}
                  onChange={changeStatus}
                />
                <label>Aktywne</label>
              </div>
              <div className={classes.radioOption}>
                <input
                  type='radio'
                  name='accountStatus'
                  value='no'
                  checked={selectedRadio === 'no'}
                  onChange={changeStatus}
                />
                <label>Nieaktywne</label>
              </div>
            </div>
            <label name='errorLabel' className={classes.errorLabel}></label>
            <p>
              Typ konta: {accountType}{' '}
              <button type='button' onClick={changeRole}>
                Zmień rolę
              </button>
            </p>
            <button type='button' onClick={sendRequestStatusRole}>
              Zapisz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
