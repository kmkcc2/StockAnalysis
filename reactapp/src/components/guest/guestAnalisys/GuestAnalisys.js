import classes from './GuestAnalisys.module.css'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
export default function GuestAnalisys(prop) {
  const navigate = useNavigate()
  const location = useLocation()
  const [minDate, setMinDate] = useState("2020-05-27")
  const [maxDate, setMaxDate] = useState(new Date().toJSON().slice(0, 10).toString())
  const [dateStartValue, setDateStartValue] = useState('')
  const [dateEndValue, setDateEndValue] = useState('')
  let title = ''
  let symbol = ''
  if (location.state !== null) {
    title = location.state.title
    symbol = location.state.symbol
  }
  async function fetchCompanyAvailableDates() {
    const response = await fetch(
      'http://127.0.0.1:5000/api/companies/dates/' + symbol,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
    )
    const data = await response.json()
    const minConvertedDate = new Date(data[0].min_date.slice(5, 16))
    .toISOString()
    .split('T')[0]
  const maxConvertedDate = new Date(data[1].max_date.slice(5, 16))
    .toISOString()
    .split('T')[0]
  setMaxDate(maxConvertedDate)
  setMinDate(minConvertedDate)
  }
  function verifyData() {
    const startDate = new Date(
      document.getElementById('startDate').value
      ).getTime()
      const endDate = new Date(document.getElementById('endDate').value).getTime()
      const radioButtons = document.querySelectorAll('input[name="graphType"]')
      const errorLabels = document.querySelectorAll('label[name="errorLabel"')
      let selectedGraph = ''
      let verify = true
      if (isNaN(startDate)) {
      errorLabels[0].innerHTML = 'Proszę podać datę początkową'
      verify = false
    } else {
      errorLabels[0].innerHTML = ''
    }
    if (isNaN(endDate)) {
      errorLabels[1].innerHTML = 'Proszę podać datę końcową'
      verify = false
    } else {
      errorLabels[1].innerHTML = ''
    }
    if (startDate >= endDate) {
      errorLabels[0].innerHTML =
        'Data początkowa musi być wcześniejszą od daty końcowej'
    } else {
      if (errorLabels[0].innerHTML !== 'Proszę podać datę początkową')
        errorLabels[0].innerHTML = ''
    }
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        selectedGraph = radioButton.value
        break
      }
    }
    if (selectedGraph === '') {
      errorLabels[2].innerHTML = 'Proszę wybrać rodzaj wykresu'
      verify = false
    } else {
      errorLabels[2].innerHTML = ''
    }
    if (verify) {
      if (selectedGraph === 'value/date') {
        sessionStorage.setItem('history', JSON.stringify({
          startDate,
          endDate
        }))
          navigate('/graph', {
            state: {
              symbol,
              type: selectedGraph.toString().toLowerCase(),
              secondType: 'close',
              element: 'LineElement',
              startDate,
              endDate,
            }
          })
      }
       else {
        if( selectedGraph === 'lost/gain'){
          sessionStorage.setItem('history', JSON.stringify({
            startDate,
            endDate
          }))
          navigate('/graph', {
            state: {
              symbol,
              type: selectedGraph.toString().toLowerCase(),
              element: 'BarElement',
              startDate,
              endDate
            }
          })
        }else{
          sessionStorage.setItem('history', JSON.stringify({
            startDate,
            endDate
          }))
          navigate('/graph', {
            state: {
              symbol,
              type: selectedGraph.toString().toLowerCase(),
              element: 'LineElement',
              startDate,
              endDate
            }
          })
        }

      }
    }
  }
  useEffect(() => {
    fetchCompanyAvailableDates()
    try {
      const date = new Date(JSON.parse(sessionStorage.getItem('history')).startDate)
      let year = date.getFullYear();
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let day = ("0" + date.getDate()).slice(-2);
      setDateStartValue(year+"-"+month+"-"+day)
      const dateEnd = new Date(JSON.parse(sessionStorage.getItem('history')).endDate)
      let year1 = dateEnd.getFullYear();
      let month1 = ("0" + (dateEnd.getMonth() + 1)).slice(-2);
      let day1 = ("0" + dateEnd.getDate()).slice(-2);
      setDateEndValue(year1+"-"+month1+"-"+day1)
    }catch(e){
      setDateEndValue('')
      setDateStartValue('')
    }
  }, [])
  return (
    <div className={classes.container}>
        <h1>
          {' '}
          Analiza spółki <i>{title}</i>
        </h1>
      <form className={classes.form}>
          <div className={`${classes.chooseChart} ${classes.datePickContainer}`}>
          <label className={classes.errorLabel} name='errorLabel'></label>
          <label>Wybierz datę początkową</label>
          <input type='date' id='startDate' value={dateStartValue} min={minDate} max={maxDate} onChange={(e) => setDateStartValue(e.target.value)}/>
          <label className={classes.errorLabel} name='errorLabel'></label>
          <label>Wybierz datę końcową</label>
          <input type='date' id='endDate' value ={dateEndValue} min={minDate} max={maxDate} onChange={(e) => setDateEndValue(e.target.value)}/>
        </div>
        <div className={classes.chooseChart}>
          <label className={classes.errorLabel} name='errorLabel'></label>
          <label>Wybierz rodzaj wykresu</label>
          <label>
            <input type='radio' name='graphType' value='value/date' className={classes.radio1}  id='radio1'/>
            Zmiany notowań w czasie
          </label>
          <label>
            <input type='radio' name='graphType' value='close/open' className={classes.radio2} />
            Zmiany różnic notowań zamknięcie/otwarcie
          </label>
          <label>
            <input type='radio' name='graphType' value='high/low' className={classes.radio3} />
            Zmiany różnic notowań high/low
          </label>
          <label>
            <input type='radio' name='graphType' value='lost/gain' className={classes.radio4} />
            Wykres słupkowy ilości dni spadku/wzrostu/braku zmian
          </label>
        </div>
      </form>
        <button type='button' onClick={verifyData}>
          Analizuj
        </button>
      <div id='graphDiv' className={classes.graph}>
      </div>
    </div>
  )
}
