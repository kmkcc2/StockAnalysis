import { useNavigate } from 'react-router-dom';
import './TopTrendingsTbody.css'
import { useState } from 'react';
export default function TopTrendingsTbody(props) {
    const [previousTarget, setPreviousTarget] = useState(null)
    const [previousStyle, setPreviousStyle] = useState(null)
    const navigate = useNavigate()
    function redirect(event, symbol, title) {
        if (event.detail === 2){
            if (window.location.pathname.includes('/user/'))
            navigate('/user/search/'+symbol, { state: { title, symbol}})
            else
            navigate('/'+symbol, { state: { title, symbol}})
        }
        if(event.detail === 1){
            if (previousTarget !== null){

                previousTarget.style = previousStyle
            }
            event.currentTarget.style.backgroundColor = '#ffd803'
            event.currentTarget.style.color = 'black'
            setPreviousTarget(event.currentTarget)
            setPreviousStyle(event.currentTarget.style)
        }

    }
    return(<tbody>
            {
                props.companies.map((company) => {
                    let change = company[1].change
                    change = change.slice(0, -1)
                        return(
                        <tr className="company-tr" onClick={(e) => redirect(e, company[1].symbol, company[1].name)} key={company[1].symbol}>
                            <td className="symbol-td">{company[1].symbol}</td>
                            <td className='name-td'>{company[1].name}</td>
                            <td className='price-td'>{company[1].price}</td>

                            {change > 0 && <td className='change-grater-0 change-td'>{company[1].change}</td>}
                            {change < 0 && <td className='change-lower-0 change-td'>{company[1].change}</td>}
                            {change === '0.00' && <td className='change-0 change-td'>{company[1].change}</td>}
                        </tr>)
                })
            }
        </tbody>);
}