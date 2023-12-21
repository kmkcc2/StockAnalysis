import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useEffect, useState } from 'react'
export default function PredictionGraph({ preds, expected, symbol}) {
  const [predictions, setPredictions] = useState('')
  const [expectations, setexpectations] = useState('')
  const [labels_, setlabels_] = useState('')
  const configChart = () => {
    let size = 0
    if (preds) size = preds.length
    let testLabelsArray = []
    for (let i = 0; i < size; i++) {
      testLabelsArray.push(i)
    }
    setlabels_(testLabelsArray)
    setexpectations(expected)
    setPredictions(preds)
  }
  useEffect(() => {
    configChart()
  }, [])
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )
  const options = {
    responsive: true,
    fill: false,
    interaction: {
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#2a254bcc',
          font: {
            size: 16
          }
        }
      },
      title: {
        display: true,
        text: 'Predykcja wartości spółki '+ symbol,
        color: '#2a254bcc',
        font: {
          size: 16
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: '#2a254bcc',
          font: {
            size: 14
          }
        },
        stack: true,
        title: {
          display: true,
          text: 'Data',
          color: '#2a254bcc',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        type: 'linear',
        ticks: {
          color: '#2a254bcc',
          font: {
            size: 14
          }
        },
        title: {
          display: true,
          text: 'Wartość USD',
          color: '#2a254bcc',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  }
  let dataTransformed = {}
  if (predictions !== '' && expectations !== '') {
    dataTransformed = {
      labels: labels_,
      datasets: [
        {
          label: 'Wartości przewidywane',
          data: predictions,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          color: 'rgb(0,0,0)',
        },
        {
          label: 'Wartości rzeczywiste',
          data: expectations,
          borderColor: 'rgba(173, 66, 245, 0.5)',
          backgroundColor: 'rgba(173, 66, 245, 0.5)',
          color: 'rgb(0,0,0)'
        }
      ]
    }
  }

  return (
    predictions !== '' &&
    expectations !== '' &&
    labels_ !== '' && <Line options={options} data={dataTransformed} />
  )
}
