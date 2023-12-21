import { useNavigate, useSearchParams } from "react-router-dom";
import classes from './UserForm.module.css'
import { DialogClass } from "../../InformationDialogs";
import { useState } from "react";
export default function PasswordReset() {
  const [queryParameters] = useSearchParams()
  const resetToken = queryParameters.get('token')
  const userId = queryParameters.get('id')
  const navigate = useNavigate()
  const [passwordType, setpasswordType] = useState('password')
  function validatePayload() {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const password = document.getElementById('passwordRegisterField')
    const confPassword = document.getElementById('confirmPasswordRegisterField')

    let invalidPaylod = false
    if(!resetToken){
      errorLabels[0].innerHTML = 'Nie można uwierzytelnić użytkownika.'
      invalidPaylod = true
    }else{
      errorLabels[0].innerHTML = ''
      invalidPaylod = false
    }
    if (password.value === '') {
      errorLabels[0].innerHTML = 'Proszę podać hasło'
      invalidPaylod = true
    } else {
      errorLabels[0].innerHTML = ''
      if (password.value !== confPassword.value) {
        errorLabels[1].innerHTML = 'Podane hasła muszą być identyczne'
        invalidPaylod = true
      } else {
        errorLabels[1].innerHTML = ''
        if (password.value.length < 8) {
          errorLabels[1].innerHTML = 'Hasło musi posiadać conajmniej 8 znaków'
          invalidPaylod = true
        } else {
          errorLabels[1].innerHTML = ''
          invalidPaylod = false
        }
      }
    }

    if (!invalidPaylod) sendRequest(password.value, resetToken, userId)
  }
  async function sendRequest(password, token, id) {
    const errorLabels = document.querySelectorAll('label[name="errorLabel"')
    const response = await fetch('http://127.0.0.1:5000/api/users/passwordReset', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, password, id })
    })
    const data = await response.json()
    if(response.status === 404){
      if( data.message === "Invalid token"){
        errorLabels[0].innerHTML = "Niepoprawny token. Nie można uwierzytelnić użytkownika. Proszę spróbować ponownie."
      }
    }
    if(response.status === 200){
      redirect()
    }

  }
  function changeInputType() {
    if(passwordType === 'password')
      setpasswordType('text')
    else
      setpasswordType('password')
  }
  function redirect() {
    // paypal
    navigate('/login', {
      state: {
        'message': 'Hasło zresetowane pomyślnie. Proszę zalogować się nowymi danymi.',
        'class': DialogClass.SUCCESS
      }
    })
  }
  return (
    <div className={classes.container}>
      <div className={`${classes.registration} ${classes.form}`}>
        <header>Zmień hasło</header>
        <form action='#'>
          <label name='errorLabel' className={classes.errorLabel}></label>
          <input
            type={passwordType}
            placeholder='Nowe hasło'
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
            value='Zmień hasło'
          />
        </form>
      </div>
    </div>
  )

}