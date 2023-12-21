import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import './SearchForCompanyMain.css'
export default function SearchForCompanyMain() {
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

  function clearSearchBar(name) {
    document.getElementById('search-bar-input').value = name
    setShowTips(false)
  }

  return (
    <>
      <div className='search-bar-container relative'>
        <input
          className='search-bar-input'
          placeholder='Wyszukaj spółkę...'
          id='search-bar-input'
          onChange={filterCompanies}
          autoComplete="off"
        />
        {showTips && (
          <div className='search-bar-dropdown absolute' id='dropdown'>
            <ul>
              {searchTip.map((tip) => {
                return (
                  <Link to={'/user/search/' + tip.symbol} state={ {title: tip.name, symbol: tip.symbol}}>
                    <li
                      onClick={() => clearSearchBar(tip.name)}
                      key={tip.symbol}
                      symbol={tip.symbol}
                    >
                      {tip.name}
                    </li>
                  </Link>
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
