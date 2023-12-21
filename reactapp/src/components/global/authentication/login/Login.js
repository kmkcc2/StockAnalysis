import { useNavigate, useLocation } from 'react-router-dom'
import classes from './UserForm.module.css'
import jwtDecode from 'jwt-decode'
import emailjs from '@emailjs/browser'
import { DialogClass } from '../../InformationDialogs'
import { useRef, useState } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [passwordType, setpasswordType] = useState('password')

  function changeInputType() {
    if(passwordType === 'password')
      setpasswordType('text')
    else
      setpasswordType('password')
  }

  function validatePayload() {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const email = document.getElementById('emailLoginField')
    const password = document.getElementById('passwordLoginField')
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
    if (password.value === '') {
      errorLabels[1].innerHTML = 'Proszę podać hasło'
      invalidPaylod = true
    } else {
      errorLabels[1].innerHTML = ''
    }
    if (!invalidPaylod) {
      fetchLogin(email.value, password.value)
    }
  }
  async function fetchLogin(email, password) {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const response = await fetch('http://127.0.0.1:5000/api/users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (response.status === 401) {
      errorLabels[2].innerHTML = 'Nieprawidłowy email i/lub hasło'
    } else {
      errorLabels[2].innerHTML = ''
      if (response.status === 200) {
        saveToken(data.token)
      }
    }
  }
  function saveToken(token) {
    sessionStorage.setItem('token', 'Bearer ' + token)
    const decodedToken = jwtDecode(token)
    navigate('/' + decodedToken.role)
  }
  const form = useRef()
  async function sendPasswordReset() {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const email = document.getElementById('emailLoginField')
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

    if (!invalidPaylod) {
      const resetTokenAndId = await fetchResetToken(
        document.getElementById('emailLoginField').value
      )
      document.getElementById('userId').value = resetTokenAndId.id
      document.getElementById('resetLink').value =
        'http://localhost:3000/password-reset?token=' +
        resetTokenAndId.token +
        '&id=' +
        resetTokenAndId.id
      console.log(resetTokenAndId)
      console.log(form.current)
      emailjs
        .sendForm(
          'service_x0fgv3l',
          'template_ita12cu',
          form.current,
          'QmZM9cUMAZvKfkGYH'
        )
        .then(
          (result) => {
            console.log(result.text)
            if (result.text === 'OK') {
              navigate('/login', {
                state: {
                  message:
                    'W celu zresetowania hasła postępuj zgodnie z wiadomością email dostarczoną pod podany adres.',
                  class: DialogClass.SUCCESS
                }
              })
            }
          },
          (error) => {
            console.log(error.text)
            navigate('/login', {
              state: {
                message:
                  'Wystąpił nieoczekiwany problem z wysłaniem wiadomości email. Spróbuj ponownie.',
                class: DialogClass.WARNING
              }
            })
          }
        )
      navigate('/login', {
        state: {
          message:
            'W celu zresetowania hasła postępuj zgodnie z wiadomością email dostarczoną pod podany adres.',
          class: DialogClass.SUCCESS
        }
      })
    }
  }
  async function fetchResetToken(email) {
    const response = await fetch(
      'http://127.0.0.1:5000/api/users/generatePasswordResetToken',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      }
    )
    return (await response).json()

    // Post do api generuj token i go zwroc
    // w mail wyslij sciezke np. localhost:3000/login/password-reset?token=token&id=id
    // uzytkownik podaje nowe haslo -> sprawdzenie tokenu -> aktualizacja bazy -> przekierowanie do /login
  }
  return (
    <div className={classes.container}>
      <div className={`${classes.login} ${classes.form}`}>
        <header>Zaloguj się</header>
        {state && state.message && (
          <h2 className={state.class}>{state.message}</h2>
        )}
        <form ref={form}>
          <label name='errorLabel' className={classes.errorLabel}></label>
          <input type='hidden' name='userId' id='userId' />
          <input type='hidden' name='resetLink' id='resetLink' />
          <input
            type='text'
            placeholder='Wprowadź email'
            id='emailLoginField'
            name='email'
          />
          <label name='errorLabel' className={classes.errorLabel}></label>
          <input
            type={passwordType}
            placeholder='Wprowadź hasło'
            id='passwordLoginField'
          />
          <div style={{display: 'flex', alignItems: 'center', height: '2em'}}><input style={{width: '0.7em'}} type='checkbox' id='cpswdChangeAdminVisibility' onChange={changeInputType}/> <p>Pokaż hasło</p></div>

          <label name='errorLabel' className={classes.errorLabel}></label>
          <br />
          <span className={classes.passReset} onClick={sendPasswordReset}>
            Przypomij hasło
          </span>
          <input
            type='button'
            className={classes.button}
            value='Zaloguj'
            onClick={validatePayload}
          />
        </form>
        <div className={classes.signup}>
          <span className={classes.signup}>
            Nie masz jeszcze konta?
            <label onClick={() => navigate('/register')}>
              {' '}
              Zarejestruj się
            </label>
          </span>
        </div>
      </div>
    </div>
  )
}
