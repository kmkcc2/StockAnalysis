import { useEffect, useState } from 'react'
import classes from './Payments.module.css'
export default function Payments() {
  const [payments, setPayments] = useState([])
  async function fetchPayments() {
    const response = await fetch('http://127.0.0.1:5000/api/transactions/', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    const data = await response.json()
    setPayments(data)
  }
  useEffect(() => {
    fetchPayments()
  }, [])
  return (
    <div className={classes.container}>
      <h1>Historia tranzakcji</h1>
      <table className={classes.tablePayments}>
        <thead>
          <tr className={classes.tablePaymentsTr}>
            <th className={classes.tablePaymentsTh}>Id tranzakcji</th>
            <th className={classes.tablePaymentsTh}>Data</th>
            <th className={classes.tablePaymentsTh}>Użytkownik</th>
            <th className={classes.tablePaymentsTh}>Kwota</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((transactions) => {
            return (
              <tr className={classes.tablePaymentsTr}>
                <td className={classes.tablePaymentsTd}>{transactions.id}</td>
                <td className={classes.tablePaymentsTd}>{new Date(transactions.date).toLocaleString("pl-PL")}</td>
                <td className={classes.tablePaymentsTd}>
                  {transactions.email}{' '}
                </td>
                <td className={classes.tablePaymentsTd}>
                  {transactions.price}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
