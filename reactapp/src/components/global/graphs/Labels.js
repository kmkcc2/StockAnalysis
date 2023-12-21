export default function labels(data, chartType){
  if (chartType === 'Line'){
    return data.map((day) => {
      const date = new Date(day.date)
      return (
        date.toLocaleString('default', { day: '2-digit' }) +
        '.' +
        date.toLocaleString('default', { month: '2-digit' }) +
        '.' +
        date.toLocaleString('default', { year: '2-digit' })
      )
    })
  }
  if (chartType === 'Bar'){
    return ['Spadek', 'Wzrost', 'Brak zmian']
  }
}