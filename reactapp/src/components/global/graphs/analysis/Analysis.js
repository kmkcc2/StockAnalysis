import { useState, useEffect } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import classes from './Analysis.module.css'
import PredictionGraph from './PredictionGraph'
export default function Analysis(props) {
  const [info, setInfo] = useState('Analiza KPSS nieudana')
  const [moreInfo, setMoreInfo] = useState('')
  const [arimaParams, setArimaParams] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const token = sessionStorage.getItem('token')
  async function fetchData() {
    setIsLoading(true)
    if (props.compareMode === true) {
      const payload1 = sessionStorage.getItem(props.name[0])
      const payload2 = sessionStorage.getItem(props.name[1])
      const response1 = await fetch(
        'http://127.0.0.1:5000/api/ticker/' + props.symbol[0] + '/analyze',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ data: payload1 })
        }
      )
      const data1 = await response1.json()
      const response2 = await fetch(
        'http://127.0.0.1:5000/api/ticker/' + props.symbol[1] + '/analyze',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ data: payload2 })
        }
      )
      const data2 = await response2.json()
      setMoreInfo([data1.more, data2.more])
      setArimaParams([data1.arima, data2.arima])
      setInfo([data1, data2])

      setIsLoading(false)
    } else {
      const payload = sessionStorage.getItem(props.name)
      const response = await fetch(
        'http://127.0.0.1:5000/api/ticker/' + props.symbol + '/analyze',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ data: payload })
        }
      )
      const data = await response.json()
      setMoreInfo(data.more)
      setArimaParams(data.arima)
      setInfo(data)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <div>
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
      {!isLoading && props.compareMode === false && (
        <div className={classes.container}>
          <p>
            {info.conclusion +
              ' dla wartości p = ' +
              Number(info.p_value).toFixed(2)}
          </p>
          <div className={`${classes.row} ${'pdf'} `}>
            <div className={classes.left}>
              <p>Parametry dodatkowe:</p>
              <table className={classes.table2}>
                <thead>
                  <tr className={classes.table2tr}>
                    <th className={classes.table2th}>Parametr</th>
                    <th className={classes.table2th}>Wartość</th>
                  </tr>
                </thead>
                <tbody>
                  {moreInfo &&
                    Object.keys(moreInfo).map(function (key, value) {
                      return (
                        <tr className={classes.table2tr}>
                          <td className={classes.table2td}>{key}</td>
                          <td className={classes.table2td}>{!isNaN(Number(moreInfo[key])) ? Number(moreInfo[key]).toFixed(2) : moreInfo[key]}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            {Number(info.p_value) > 0.05 && <div className={classes.right}>
              <p>Parametry modelu ARiMA:</p>
              <table className={classes.table2}>
                <thead>
                  <tr className={classes.table2tr}>
                    <th className={classes.table2th}>Parametr</th>
                    <th className={classes.table2th}>Wartość</th>
                  </tr>
                </thead>
                <tbody>
                  {arimaParams &&
                    Object.keys(arimaParams).map(function (key, value) {
                      return (
                        <tr className={classes.table2tr}>
                          <td className={classes.table2td}>{key}</td>
                          <td className={classes.table2td}>{Number(arimaParams[key]).toFixed(2)}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>}
          </div>
          <div className={`${classes.row} ${'pdf'} `}>
            <PredictionGraph
              preds={info.predictions}
              expected={info.expected}
              data={props.data}
              symbol={props.symbol}
            />
          </div>
        </div>
      )}
      {!isLoading && props.compareMode === true && (
        <div className={classes.container}>
          <h2>{'Analiza spółki ' + props.symbol[0]}</h2>
          <div className={`${classes.row} ${'pdf'} `}>
            <div className={classes.left}>
              <p>
                <b>{info[0].conclusion}</b>
              </p>
              <p>{'Wartość p = ' + Number(info[0].p_value).toFixed(2)}</p>
              <p>Parametry dodatkowe:</p>
              <table className={classes.table2}>
                <thead>
                  <tr className={classes.table2tr}>
                    <th className={classes.table2th}>Parametr</th>
                    <th className={classes.table2th}>Wartość</th>
                  </tr>
                </thead>
                <tbody>
                  {moreInfo[0] &&
                    Object.keys(moreInfo[0]).map(function (key, value) {
                      return (
                        <tr className={classes.table2tr}>
                          <td className={classes.table2td}>{key}</td>
                          <td className={classes.table2td}>{!isNaN(Number(moreInfo[0][key])) ? Number(moreInfo[0][key]).toFixed(2) : moreInfo[0][key]}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
              {Number(info[0].p_value) > 0.05 && <>
              <p>Parametry modelu ARiMA:</p>
              <table className={classes.table2}>
                <thead>
                  <tr className={classes.table2tr}>
                    <th className={classes.table2th}>Parametr</th>
                    <th className={classes.table2th}>Wartość</th>
                  </tr>
                </thead>
                <tbody>
                  {arimaParams[0] &&
                    Object.keys(arimaParams[0]).map(function (key, value) {
                      return (
                        <tr className={classes.table2tr}>
                          <td className={classes.table2td}>{key}</td>
                          <td className={classes.table2td}>{Number(arimaParams[0][key]).toFixed(2)}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table></>}
            </div>
            <div className={classes.right}>
              <PredictionGraph
                preds={info[0].predictions}
                expected={info[0].expected}
                symbol={props.symbol[0]}
              />
            </div>
          </div>
          <h2>{'Analiza spółki ' + props.symbol[1]}</h2>
          <div className={`${classes.row} ${'pdf'} `}>
            <div className={classes.left}>
              <p>
                <b>{info[1].conclusion}</b>
              </p>
              <p>{'Wartość p = ' + Number(info[1].p_value).toFixed(2)}</p>
              <p>Parametry dodatkowe:</p>
              <table className={classes.table2}>
                <thead>
                  <tr className={classes.table2tr}>
                    <th className={classes.table2th}>Parametr</th>
                    <th className={classes.table2th}>Wartość</th>
                  </tr>
                </thead>
                <tbody>
                  {moreInfo[1] &&
                    Object.keys(moreInfo[1]).map(function (key, value) {
                      return (
                        <tr className={classes.table2tr}>
                          <td className={classes.table2td}>{key}</td>
                          <td className={classes.table2td}>{!isNaN(Number(moreInfo[1][key])) ? Number(moreInfo[1][key]).toFixed(2) : moreInfo[1][key]}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
              {Number(info[1].p_value) > 0.05 && <>
              <p>Parametry modelu ARiMA:</p>
              <table className={classes.table2}>
                <thead>
                  <tr className={classes.table2tr}>
                    <th className={classes.table2th}>Parametr</th>
                    <th className={classes.table2th}>Wartość</th>
                  </tr>
                </thead>
                <tbody>
                  {arimaParams[1] &&
                    Object.keys(arimaParams[1]).map(function (key, value) {
                      return (
                        <tr className={classes.table2tr}>
                          <td className={classes.table2td}>{key}</td>
                          <td className={classes.table2td}>{Number(arimaParams[1][key]).toFixed(2)}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table></>}
            </div>
            <div className={classes.right}>
              <PredictionGraph
                preds={info[1].predictions}
                expected={info[1].expected}
                symbol={props.symbol[1]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
