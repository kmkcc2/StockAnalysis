import classes from './ContactForm.module.css'
import jwt from 'jwt-decode'
import emailjs from '@emailjs/browser'
import React, { useRef, useState } from 'react'
import { DialogClass } from '../../global/InformationDialogs'

export default function ContactForm(props) {
  const token = sessionStorage.getItem('token')
  const [info, setInfo] = useState('')
  const [infoClass, setInfoClass] = useState(DialogClass.SUCCESS)
  let jwtdecode = ''
  let email = '' // wziac z jwt
  let guest = true
  if (token) {
    guest = false
    jwtdecode = jwt(token)
    email = jwtdecode.email
  }
  const form = useRef()
  const verify = (e) => {
    e.preventDefault()
    const title = document.getElementById('title').value.trim()
    const body = document.getElementById('body').value.trim()
    if(title !== '' && body !== ''){
      sendEmail()
    }else{
      setInfo('Proszę uzupełnić formularz')
      setInfoClass(DialogClass.ERROR)
    }
  }
  const sendEmail = () => {
    emailjs
      .sendForm(
        'service_x0fgv3l',
        'template_2dx8ryv',
        form.current,
        'QmZM9cUMAZvKfkGYH'
      )
      .then(
        (result) => {
          console.log(result.text)
          if (result.text === 'OK') {
            document.getElementById('title').value = ''
            document.getElementById('body').value = ''
            setInfo('Email wysłany')
            setInfoClass(DialogClass.SUCCESS)
          }
        },
        (error) => {
          console.log(error.text)
          setInfo(error.text)
          setInfoClass(DialogClass.ERROR)
        }
      )
  }
  return (
    <div className={classes.container}>
      <h1>Formularz kontaktowy</h1>
      <label className={infoClass} name='infoLabelContact'>
        {info}
      </label>
      <form className={classes.form} ref={form} onSubmit={verify}>
        {guest && (
          <input
            type='email'
            placeholder='Email'
            id='email'
            className={classes.title}
            name='email'
            required
          />
        )}
        {!guest && (
          <>
            <input type='hidden' value={email} id='email' name='email' />
            <input type='hidden' id='user' value={!guest} required/>
          </>
        )}
        <input
          className={classes.title}
          type='text'
          id='title'
          placeholder='Tytuł wiadomości'
          required
          name='title'
        />
        <textarea
          className={classes.body}
          placeholder='Treść wiadomości'
          id='body'
          name='body'
          required
        />
        <button className={classes.subButton} type='submit'>
          Wyślij
        </button>
      </form>
    </div>
  )
}
