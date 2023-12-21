import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import classes from './SearchForCompany.module.css'
export default function SearchForCompany(props) {
  const [searchTip, setSearchTip] = useState([])
  const [showTips, setShowTips] = useState(false)

  async function filterCompanies(event) {
    const token = sessionStorage.getItem('token')

    let pattern = event.target.value
    if (pattern.length >= 3) {
      const response = await fetch(
        'http://127.0.0.1:5000/api/companies/' + pattern, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
      const data = await response.json()

      setSearchTip(data)
      setShowTips(true)
    } else {
      setSearchTip([])
      setShowTips(false)
    }
  }
  function clearSearchBar(name, symbol, max, min) {
    sessionStorage.setItem('datesFor'+symbol, JSON.stringify([min, max]))
    if(props.id === 'search1'){
      document.getElementsByClassName('companyDates1')[0].innerHTML = 'Dostępne daty: od '+min+' do '+max
    }
    if(props.id === 'search2'){
      document.getElementsByClassName('companyDates2')[0].innerHTML = 'Dostępne daty: od '+min+' do '+max
    }
    document.getElementById(props.id).value = name
    document.getElementById(props.id).setAttribute('symbol', symbol)
    setShowTips(false)
  }
  useEffect(() => {
    try{
      const symbols = JSON.parse(sessionStorage.getItem('historyCompare')).symbols
      const [min1, max1] = JSON.parse(sessionStorage.getItem('datesFor'+symbols[0]))
      const [min2, max2] = JSON.parse(sessionStorage.getItem('datesFor'+symbols[1]))
      document.getElementsByClassName('companyDates1')[0].innerHTML = 'Dostępne daty: od '+min1+' do '+max1
      document.getElementsByClassName('companyDates2')[0].innerHTML = 'Dostępne daty: od '+min2+' do '+max2

    }catch(e){console.log(e)}
  }, [])
  return (
    <>
      <div className={`${classes.searchBarContainer} ${classes.relative}`}>
        <input
          className={classes.searchBarInput}
          id={props.id}
          placeholder='Wyszukaj spółkę...'
          onChange={filterCompanies}
          autoComplete="off"
        />
        {showTips && (
          <div className={`${classes.searchBarDropdown} ${classes.absolute}`} id='dropdown'>
            <ul>
              {searchTip.map((tip) => {
                return (
                    <li
                      key={tip.symbol}
                      symbol={tip.symbol}
                      onClick={() => clearSearchBar(tip.name, tip.symbol, tip.max_date, tip.min_date)}
                    >
                      {tip.name}
                    </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
      <Outlet />
    </>
  )
}
