import { Link } from "react-router-dom"
import classes from './Payment.module.css';
export default function Payment() {
  return <div className={ classes.container }>
    <h1 className="error"> Twoje konto jest nie aktywne.</h1>
    <h2> W celu uzyskania informacji skontaktuj się z nami <Link className={ classes.link } to='/contact'>tutaj</Link></h2>
    <h3> Jeżeli jeszcze nie dokonałeś płatności możesz to zrobić tutaj: <button type="button" >Zapłać</button></h3>

  </div>
}