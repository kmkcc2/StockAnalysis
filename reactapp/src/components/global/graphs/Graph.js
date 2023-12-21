import { useLocation } from 'react-router-dom'
import { ThreeDots } from 'react-loader-spinner'
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { Options } from './GraphOptions'
import { CloseOpen, HighLow, LostGain, ValueDate } from './DataSets'
import labels from './Labels'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Analysis from './analysis/Analysis'
import jwtDecode from 'jwt-decode'
import classes from './Graph.module.css'
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function Graph() {
  const [empty, setEmpty] = useState(false)
  const [data, setData] = useState([])
  const [data2, setData2] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()
  const token = sessionStorage.getItem('token')
  let logged = true
  let pickOptions = {}
  let pickDataset = []
  let startDate = ''
  let endDate = ''
  let symbol = ''
  let type = ''
  let secondType = ''
  let element = ''
  let analize = ''
  let compareMode = false
  if (location.state !== null) {
    startDate = location.state.startDate
    endDate = location.state.endDate
    symbol = location.state.symbol
    type = location.state.type
    element = location.state.element
    secondType = location.state.secondType
    analize = location.state.analize | false
    compareMode = location.state.compareMode | false
  }
  try{
    const decodedToken = jwtDecode(token)

  }catch(e){
    logged = false
  }
  function custom_sort(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  }
  useEffect(() => {
    async function fetchDataHandler() {
      setIsLoading(true)
      let response = ''
      let response1 = ''
      if (compareMode) {
        response = await fetch('http://127.0.0.1:5000/api/ticker/' + symbol[0], {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        })
        response1 = await fetch('http://127.0.0.1:5000/api/ticker/' + symbol[1], {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        let data_array = []
        for (let i in data) {
          let day = data[i]
          let date = new Date(day.date).getTime()

          if (date >= startDate && date <= endDate) {
            data_array.push(day)
          }
        }
        if (data_array.length === 0) {
          setEmpty(true)
        }
        data_array.sort(custom_sort)
        const data2 = await response1.json()
        let data_array2 = []
        for (let i in data2) {
          let day = data2[i]
          let date = new Date(day.date).getTime()

          if (date >= startDate && date <= endDate) {
            data_array2.push(day)
          }
        }
        if (data_array2.length === 0) {
          setEmpty(true)
        }
        data_array2.sort(custom_sort)
        setData(data_array)
        setData2(data_array2)
        sessionStorage.setItem(
          'stockData' + symbol[0] + startDate + endDate,
          JSON.stringify(
            data_array.map((day) => {
              if (type === 'close/open')
                return {
                  data: day.close - day.open,
                  date: day.date
                }
              if (type === 'high/low')
                return {
                  data: day.high - day.low,
                  date: day.date
                }
              if (type === 'value/date')
                return {
                  data: day[secondType],
                  date: day.date
                }
              if (type === 'lost/gain')
                return {
                  data: day.close - day.open,
                  date: day.date
                }
            })
          )
        )
        sessionStorage.setItem(
          'stockData' + symbol[1] + startDate + endDate,
          JSON.stringify(
            data_array2.map((day) => {
              if (type === 'close/open')
                return {
                  data: day.close - day.open,
                  date: day.date
                }
              if (type === 'high/low')
                return {
                  data: day.high - day.low,
                  date: day.date
                }
              if (type === 'value/date')
                return {
                  data: day[secondType],
                  date: day.date
                }
              if (type === 'lost/gain')
                return {
                  data: day.close - day.open,
                  date: day.date
                }
            })
          )
        )
      } else {
        response = await fetch('http://127.0.0.1:5000/api/ticker/' + symbol, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        let data_array = []
        for (let i in data) {
          let day = data[i]
          let date = new Date(day.date).getTime()

          if (date >= startDate && date <= endDate) {
            data_array.push(day)
          }
        }
        if (data_array.length === 0) {
          setEmpty(true)
        }
        data_array.sort(custom_sort)
        setData(data_array)
        sessionStorage.setItem(
          'stockData' + symbol + startDate + endDate,
          JSON.stringify(
            data_array.map((day) => {
              if (type === 'close/open')
                return {
                  data: day.close - day.open,
                  date: day.date
                }
              if (type === 'high/low')
                return {
                  data: day.high - day.low,
                  date: day.date
                }
              if (type === 'value/date')
                return {
                  data: day[secondType],
                  date: day.date
                }
              if (type === 'lost/gain')
                return {
                  data: day.close - day.open,
                  date: day.date
                }
            })
          )
        )
      }
      setIsLoading(false)
    }
    fetchDataHandler()
  }, [])
  if (element === 'LineElement') {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    )
  } else if (element === 'BarElement') {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      BarElement,
      Title,
      Tooltip,
      Legend
    )
  }

  if (type === 'close/open') {
    pickOptions = Options.CloseOpen
    if (compareMode) {
      pickDataset = [
        CloseOpen(data, false, symbol[0]),
        CloseOpen(data2, true, symbol[1])
      ]
    } else {
      pickDataset.push(CloseOpen(data, false, symbol))
    }
  }
  if (type === 'high/low') {
    pickOptions = Options.HighLow
    if (compareMode) {
      pickDataset = [
        HighLow(data, false, symbol[0]),
        HighLow(data2, true, symbol[1])
      ]
    } else {
      pickDataset.push(HighLow(data, false, symbol))
    }
  }
  if (type === 'lost/gain') {
    pickOptions = Options.LostGain
    pickOptions.plugins.datalabels.formatter = (value, ctx) => ctx.dataset.label+'\nWartość: '+ value
    if (compareMode) {
      pickDataset = [
        LostGain(data, false, symbol[0]),
        LostGain(data2, true, symbol[1])
      ]
    } else {
      pickDataset.push(LostGain(data, false, symbol))
    }
  }
  if (type === 'value/date') {
    pickOptions = Options.ValueDate
    pickOptions.plugins.title.text =
      'Zmiana notowań spółki, kwota ' + secondType
    if (compareMode) {
      pickDataset = [
        ValueDate(data, secondType, false, symbol[0]),
        ValueDate(data2, secondType, true, symbol[1])
      ]
    } else {
      pickDataset.push(ValueDate(data, secondType, false, symbol))
    }
  }

  const options = pickOptions

  const dataTransformed = {
    labels: labels(data, element === 'LineElement' ? 'Line' : 'Bar'),
    datasets: pickDataset
  }
  async function getCanvas(element){
    const canvas = await html2canvas(element)
    return canvas.toDataURL('image/png')
  }
  async function getPdf() {
    const input = document.getElementsByClassName('MainCard')[0]
    const input2 = document
      .getElementsByClassName('blurBackground')[0]
    const pdfDivs = document
      .getElementsByClassName('pdf')
      console.log(pdfDivs)
    input2.style.overflowY = 'visible'
    input2.style.height = '100%'
    input.style.overflowY = 'visible'
    input.style.height = '100%'
    const pdf = new jsPDF('l', 'mm', 'a4')
    for (let i=0; i < pdfDivs.length; i++){
      pdfDivs[i].style.padding = '5em'
    }
    for (let i=0; i < pdfDivs.length; i++){
      const imgData = await getCanvas(pdfDivs[i])
      const width = pdf.internal.pageSize.getWidth()
      const height = pdf.internal.pageSize.getHeight()
      pdf.addImage(imgData, 'png', 0, 0, width, height)
      if (i + 1 < pdfDivs.length) pdf.addPage()
      else pdf.save('raport_'+symbol+'.pdf')
    }
    input2.style.overflowY = 'auto'
    input2.style.height = '100vh'
    for (let i=0; i < pdfDivs.length; i++){
      pdfDivs[i].style.padding = '0em'
    }
    input.style.overflowY = 'auto'
    input.style.height = '100vh'
  }
  return (
    <>
      <button type='button' onClick={getPdf}>
        Zapisz jako pdf
      </button>
      <div className={classes.container}>
        {element === 'BarElement' && !compareMode && <h2 style={{margin: 0 + ' auto', textAlign: 'center'}}>Spółka {symbol}</h2>}
        {element === 'BarElement' && !!compareMode && <h2 style={{margin: 0 + ' auto', textAlign: 'center'}}>Spółki {symbol[0]+' & '+ symbol[1]}</h2>}
        {isLoading && (
          <div className='loading-dots'>
            <ThreeDots
              height='80'
              width='80'
              radius='9'
              color='white'
              ariaLabel='three-dots-loading'
              wrapperStyle={{}}
              wrapperClassName='loading-spinner'
              visible={true}
            />
          </div>
        )}
        {empty && (
          <>
            <h1>
              Przykro nam, ale w tym okresie nie posiadamy danych dla tej
              spółki.
            </h1>
            <h2>Proszę wybrać inny okres.</h2>
          </>
        )}

        {!isLoading && !empty && (
          <>
            {element === 'LineElement' && (
              <Line options={options} data={dataTransformed} className='pdf'/>
            )}
            {element === 'BarElement' &&(
              <Bar options={options} data={dataTransformed} className='pdf' plugins={[ChartDataLabels]}/>
            )}
            {data && !compareMode && logged && element !== 'BarElement' && (
              <Analysis
                symbol={symbol}
                name={'stockData' + symbol + startDate + endDate}
                compareMode={false}
                data={data}
              />
            )}
            {data && !!compareMode && logged && element !== 'BarElement' &&(
              <Analysis
                symbol={symbol}
                name={[
                  'stockData' + symbol[0] + startDate + endDate,
                  'stockData' + symbol[1] + startDate + endDate
                ]}
                compareMode={true}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}
