import { useNavigate } from 'react-router-dom'
import classes from './UserForm.module.css'
import { DialogClass } from '../../InformationDialogs'
import { useState } from 'react'
export default function Register() {
  const navigate = useNavigate()
  const [passwordType, setpasswordType] = useState('password')
  function changeInputType() {
    if(passwordType === 'password')
      setpasswordType('text')
    else
      setpasswordType('password')
  }
  function validatePayload() {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const email = document.getElementById('emailRegisterField')
    const password = document.getElementById('passwordRegisterField')
    password.value = password.value.trim()
    const confPassword = document.getElementById('confirmPasswordRegisterField')
    confPassword.value = confPassword.value.trim()
    let invalidPaylod = false

    if (email.value === '') {
      errorLabels[0].innerHTML = 'Proszę podać adres email'
      invalidPaylod = true
    } else {
      errorLabels[0].innerHTML = ''
      invalidPaylod = false
      if (!String(email.value).match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)) {
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

    if (!invalidPaylod) sendRequest(email.value, password.value)
  }
  async function sendRequest(email, password) {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const response = await fetch('http://127.0.0.1:5000/api/users/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if(response.status === 400){
      if( data.message === "Email already in use."){
        errorLabels[0].innerHTML = "Konto z podanym adresem email już istnieje."
      }
    }
    if(response.status === 201){
      fetchAddTransaction(data.id)
    }
  }
  async function fetchAddTransaction(user_id) {
    console.log(user_id)
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const date = new Date().getTime()
    const price = 39.99
    const response = await fetch('http://127.0.0.1:5000/api/transactions/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id, date, price })
    })
    const data = await response.json()
    if(response.status === 500){
      if( data.message ){
        errorLabels[0].innerHTML = data.error
      }
    }
    if(response.status === 201){
      redirect()
    }
  }
  function redirect() {
    navigate('/login', {
      state: {
        'message': 'Konto utworzone pomyślnie. Proszę zalogować się podanymi danymi.',
        'class': DialogClass.SUCCESS
      }
    })
  }

  return (
    <div className={classes.container}>
      <div className={`${classes.registration} ${classes.form}`}>
        <header>Zarejestruj się</header>
        <form action='#'>
          <label name='errorLabel' className={classes.errorLabel}></label>
          <input
            type='email'
            placeholder='Wprowadź email'
            id='emailRegisterField'
          />
          <label name='errorLabel' className={classes.errorLabel}></label>
          <input
            type={passwordType}
            placeholder='Stwórz hasło'
            id='passwordRegisterField'
          />
          <label name='errorLabel' className={classes.errorLabel}></label>
          <input
            type={passwordType}
            placeholder='Potwierdź hasło'
            id='confirmPasswordRegisterField'
          />
          <div style={{display: 'flex', alignItems: 'center', height: '2em'}}><input style={{width: '0.7em'}} type='checkbox' id='cpswdChangeAdminVisibility' onChange={changeInputType}/> <p>Pokaż hasło</p></div>
          <input
            type='button'
            className={classes.button}
            onClick={validatePayload}
            value='Zapłać*'
          />
        </form>
        <div className={classes.signup}>
          <span className={classes.signup}>
            <p>*Opłata jednorazowa w wysokości 39,99PLN</p> Masz już konto?
            <label onClick={() => navigate('/login')}>
              {' '}
              Zaloguj się
            </label>
          </span>
        </div>
      </div>
    </div>
  )
}
