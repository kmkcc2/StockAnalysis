import { useState, useEffect } from 'react'
import Record from './Record'
import classes from './Backup.module.css'
import { ThreeDots } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'

export default function Backup() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBackup, setIsLoadingBackup] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalProgress, setTotalProgress] = useState(100)

  const token = sessionStorage.getItem('token')
  async function fetchCompanies() {
    setIsLoading(true)

    const response = await fetch('http://127.0.0.1:5000/api/companies/')
    const data = await response.json()
    setCompanies(data)
    setIsLoading(false)
    setTotalProgress(data.length)
  }

  useEffect(() => {
    fetchCompanies()
  }, [])
  async function fetchAddRecord(symbol_, name_) {
    const response = await fetch('http://127.0.0.1:5000/api/companies/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ symbol: symbol_, name: name_ })
    })
    const data = await response.json()
    return data.id
  }
  async function addRecord() {
    console.log(companies)
    let symbol_ = document.getElementById('symbolInput').value
    let name_ = document.getElementById('nameInput').value
    if (symbol_ && name_) {
      let id_ = -1
      try {
        id_ = await fetchAddRecord(symbol_, name_)
        console.log(id_)
      } catch {
        alert('Error when trying to add new record')
      }
      setCompanies([...companies, { symbol: symbol_, name: name_, id: id_ }])
      setTotalProgress(totalProgress + 1)

      document.getElementById('symbolInput').value = ''
      document.getElementById('nameInput').value = ''
    }
  }
  let temp = 50
  function checkProgresStatus() {
    setTimeout(async () => {
      const response = await fetch('http://127.0.0.1:5000/api/backup/status', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
      const data = await response.json()
      const percentage = Number(
        (100 * Number(data.status)) / Number(totalProgress)
      ).toFixed(0)
      setProgress(percentage)
      console.log(percentage)
      if (percentage < 100) checkProgresStatus()
    }, '1000')
  }
  async function fetchDataBackup() {
    try {
      let period = document.querySelector('input[name="time"]:checked').value
      if (period) {
        setIsLoadingBackup(true)
        checkProgresStatus()
        const response = await fetch(
          'http://127.0.0.1:5000/api/backup/' + period,
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + token,
              Accept: 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
        await response.json()
        setIsLoadingBackup(false)
        if (response.status === 403) {
          navigate('/login')
          sessionStorage.removeItem('token')
        }
        const backupInfo = document.getElementById('backupInfoh2')
        if (response.status !== 200) {
          backupInfo.innerHTML =
            'Błąd podczas aktualizowania spółek. Spróbuj ponownie.'
          backupInfo.style.color = 'red'
        } else {
          document.getElementById('backupInfoh2').innerHTML =
            'Spółki zaktualizowane pomyślnie'
          backupInfo.style.color = 'green'
        }
      }
    } catch {
      const errorLabels = document.querySelectorAll('label[name="errorLabel"')
      errorLabels[0].innerHTML = 'Proszę wybrać okres'
    }
  }
  return (
    <div>
      <h1>Zarządzaj danymi spółek giełdowych</h1>
      <h2 id='backupInfoh2'></h2>
      {!isLoadingBackup && (
        <div className={classes.row}>
          <div className={classes.col1}>
            <div></div>
            <div className={classes.tableScrollable}>
              <table id='backupTable'>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Nazwa</th>
                    <th>Akcja</th>
                  </tr>
                </thead>
                <tbody id='backupTableBody'>
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
                  {companies.map((record) => {
                    return (
                      <Record
                        symbol={record.symbol}
                        name={record.name}
                        id={record.id}
                      ></Record>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className={classes.col2}>
            <div>
              <h2>Wybierz okres</h2>
              <label className={classes.errorLabel} name='errorLabel'></label>
            </div>
            <div className={classes.radioTimeline}>
              <div className={classes.radioOption}>
                <input type='radio' name='time' value='1y' required />
                <label>1 rok</label>
              </div>
              <div className={classes.radioOption}>
                <input type='radio' name='time' value='6mo' />
                <label>6 miesięcy</label>
              </div>
              <div className={classes.radioOption}>
                <input type='radio' name='time' value='1mo' />
                <label>1 miesiąc</label>
              </div>
              <div className={classes.radioOption}>
                <input type='radio' name='time' value='5d' />
                <label>1 tydzień</label>
              </div>
              <div className={classes.radioOption}>
                <input type='radio' name='time' value='1d' />
                <label>1 dzień</label>
              </div>
            </div>
            <div className={classes.addCompany}>
              <div className={classes.addCompanyInputs}>
                <input
                  type='text'
                  placeholder='Symbol'
                  id='symbolInput'
                ></input>
                <input type='text' placeholder='Nazwa' id='nameInput'></input>
              </div>
              <div className={classes.addCompanyButtons}>
                <button onClick={addRecord}>Dodaj spółkę</button>
                <button onClick={fetchDataBackup}>Stwórz kopie zapasową</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoadingBackup && (
        <>
          <label for='file'>Tworzenie kopii zapasowej: {progress + '%'}</label>
          <progress
            id='file'
            value={progress}
            max='100'
            style={{ width: '100%', height: '4em' }}
          >
            {' '}
          </progress>
        </>
      )}
    </div>
  )
}
