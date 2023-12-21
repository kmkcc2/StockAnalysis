// import DatePicker from "react-datepicker";
import { useEffect, useState } from 'react'
import classes from './CompanyInfo.module.css'
import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import React from 'react'
export default function CompanyInfo(props) {
  const [additionalRadio1, setadditionalRadio1] = useState(false)
  const [minDate, setMinDate] = useState('2020-05-27')
  const [maxDate, setMaxDate] = useState(
    new Date().toJSON().slice(0, 10).toString()
  )
  const [dateStartValue, setDateStartValue] = useState('')
  const [dateEndValue, setDateEndValue] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const compareMode = props.compare | false
  let title = ''
  let symbol = ''
  let names = ''
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
    const errorLabelsNested = document.querySelectorAll(
      'label[name="errorLabelNested"'
    )
    let verify = true
    if (compareMode) {
      const inputs = document.querySelectorAll('input')
      const search1 = inputs[0].getAttribute('symbol')
      const search2 = inputs[1].getAttribute('symbol')
      const h2 = document.querySelectorAll('h2')
      if (search1 === '' || !search1 || search1 === null) {
        h2[0].innerHTML = 'Proszę wybrać spółkę numer 1'
        h2[0].style.color = 'red'
        inputs[0].focus = true
        verify = false
      } else {
        h2[0].innerHTML = 'Proszę wybrać spółkę numer 1'
        h2[0].style.color = 'black'
        verify = true
      }
      if (search2 === '' || !search2 || search2 === null) {
        h2[1].innerHTML = 'Proszę wybrać spółkę numer 2'
        h2[1].style.color = 'red'
        inputs[0].focus = true
        verify = false
      } else {
        h2[1].innerHTML = 'Proszę wybrać spółkę numer 2'
        h2[1].style.color = 'black'
        verify = true
      }
      symbol = [search1, search2]
      names = [inputs[0].value, inputs[1].value]
    }
    let selectedGraph = ''
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
        const radioButtonsValueDate = document.querySelectorAll(
          'input[name="graphType1"]'
        )
        let selectedGraphValueDate = ''
        for (const radioButtonValueDate of radioButtonsValueDate) {
          if (radioButtonValueDate.checked) {
            selectedGraphValueDate = radioButtonValueDate.value
            break
          }
        }
        if (selectedGraphValueDate === '') {
          errorLabelsNested[0].innerHTML = 'Proszę wybrać rodzaj wykresu'
        } else {
          sessionStorage.setItem('history', JSON.stringify({
            startDate,
            endDate
          }))
          if (compareMode)
            sessionStorage.setItem('historyCompare', JSON.stringify({
              symbols: symbol,
              names
            }))
          navigate('/user/graph', {
            state: {
              symbol,
              type: selectedGraph.toString().toLowerCase(),
              element: 'LineElement',
              secondType: selectedGraphValueDate.toString().toLowerCase(),
              startDate,
              endDate,
              compareMode
            }
          })
        }
      } else {
        if (selectedGraph === 'lost/gain') {
          sessionStorage.setItem('history', JSON.stringify({
            startDate,
            endDate
          }))
          if (compareMode)
            sessionStorage.setItem('historyCompare', JSON.stringify({
              symbols: symbol,
              names
            }))
          navigate('/user/graph', {
            state: {
              symbol,
              type: selectedGraph.toString().toLowerCase(),
              element: 'BarElement',
              startDate,
              endDate,
              compareMode
            }
          })
        } else {
          sessionStorage.setItem('history', JSON.stringify({
            startDate,
            endDate
          }))
          if (compareMode)
            sessionStorage.setItem('historyCompare', JSON.stringify({
              symbols: symbol,
              names
            }))
          navigate('/user/graph', {
            state: {
              symbol,
              type: selectedGraph.toString().toLowerCase(),
              element: 'LineElement',
              startDate,
              endDate,
              compareMode
            }
          })
        }
      }
    }
  }
  function toggleDetailsChoose(chartType) {
    switch (chartType) {
      case 'radio1':
        setadditionalRadio1(true)
        break
      case 'radio2':
        setadditionalRadio1(false)
        break
      case 'radio3':
        setadditionalRadio1(false)
        break
      case 'radio4':
        setadditionalRadio1(false)
        break
      default:
        setadditionalRadio1(false)
        break
    }
  }
  useEffect(() => {
    fetchCompanyAvailableDates()
    try{
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
      setDateStartValue('')
      setDateEndValue('')
    }
    if(compareMode){
      try {
        const historyCompare = JSON.parse(sessionStorage.getItem('historyCompare'))
        const inputs = document.querySelectorAll('input')
        inputs[0].value = historyCompare.names[0]
        inputs[0].setAttribute('symbol', historyCompare.symbols[0])
        inputs[1].value = historyCompare.names[1]
        inputs[1].setAttribute('symbol', historyCompare.symbols[1])
      }catch(e){
        const inputs = document.querySelectorAll('input')
        inputs[0].value = ''
        inputs[0].setAttribute('symbol', '')
        inputs[1].value = ''
        inputs[1].setAttribute('symbol', '')
    }

    }
  }, [])
  return (
    <div className={classes.container}>
      {symbol !== '' && (
        <h1 onClick={() => {console.log(location.state)}}>
          Analiza spółki <i>{symbol}</i>
        </h1>
      )}
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
            <input
              type='radio'
              name='graphType'
              value='value/date'
              className={classes.radio1}
              onChange={() => toggleDetailsChoose('radio1')}
              id='radio1'
            />
            Zmiany notowań w czasie
          </label>
          {additionalRadio1 && (
            <div className={classes.radio1hidden} id='radio1hidden'>
              <label
                className={classes.errorLabel}
                name='errorLabelNested'
              ></label>
              <label>
                <input
                  type='radio'
                  name='graphType1'
                  value='open'
                  className={classes.radio1}
                />
                Otwarcie
              </label>
              <label>
                <input
                  type='radio'
                  name='graphType1'
                  value='close'
                  className={classes.radio1}
                />
                Zamknięcie
              </label>
              <label>
                <input
                  type='radio'
                  name='graphType1'
                  value='high'
                  className={classes.radio1}
                />
                High
              </label>
              <label>
                <input
                  type='radio'
                  name='graphType1'
                  value='low'
                  className={classes.radio1}
                />
                Low
              </label>
            </div>
          )}
          <label>
            <input
              type='radio'
              name='graphType'
              value='close/open'
              className={classes.radio2}
              onChange={() => toggleDetailsChoose('radio2')}
            />
            Zmiany różnic notowań zamknięcie/otwarcie
          </label>
          <label>
            <input
              type='radio'
              name='graphType'
              value='high/low'
              className={classes.radio3}
              onChange={() => toggleDetailsChoose('radio3')}
            />
            Zmiany różnic notowań high/low
          </label>
          <label>
            <input
              type='radio'
              name='graphType'
              value='lost/gain'
              className={classes.radio4}
              onChange={() => toggleDetailsChoose('radio4')}
            />
            Wykres słupkowy spadek/wzrost/brak zmian
          </label>
        </div>
      </form>
      <button type='button' onClick={verifyData}>
        Analizuj
      </button>
      <div id='graphDiv' className={classes.graph}>
        {' '}
        <Outlet />
      </div>
    </div>
  )
}
