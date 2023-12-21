export function CloseOpen(data, secondOne = false, symbol) {
  const opt = {
    label: 'Spółka ' + symbol,
    data: data.map((day) => day.close - day.open),
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
    color: 'rgb(0,0,0)'
  }
  if (secondOne) {
    opt.backgroundColor = 'rgba(173, 66, 245, 0.5)'
    opt.borderColor = 'rgba(173, 66, 245, 0.5)'
  }
  return opt
}
export function HighLow(data, secondOne = false, symbol) {
  const opt = {
    label: 'Spółka ' + symbol,
    data: data.map((day) => day.high - day.low),
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
    color: 'rgb(0,0,0)'
  }
  if (secondOne) {
    opt.backgroundColor = 'rgba(173, 66, 245, 0.5)'
    opt.borderColor = 'rgba(173, 66, 245, 0.5)'
  }
  return opt
}
export function LostGain(data, secondOne = false, symbol) {
  let lost = 0
  let gain = 0
  let remain = 0
  data.forEach((day) => {
    if (day.close - day.open < 0) lost++
    if (day.close - day.open > 0) gain++
    if (day.close - day.open === 0) remain++
  })
  let backgroundColor = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(0, 255, 132, 0.5)',
    'rgba(255, 255, 255, 0.5)'
  ]

  return {
    label: 'Spółka ' + symbol,
    data: [lost, gain, remain],
    backgroundColor: backgroundColor,
    color: 'rgb(0,0,0)'
  }
}
export function ValueDate(data, type, secondOne = false, symbol) {
  const opt = {
    label: 'Spółka ' + symbol,
    data: data.map((day) => day[type]),
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
    color: 'rgb(0,0,0)'
  }
  if (secondOne) {
    opt.backgroundColor = 'rgba(173, 66, 245, 0.5)'
    opt.borderColor = 'rgba(173, 66, 245, 0.5)'
  }
  return opt
}
