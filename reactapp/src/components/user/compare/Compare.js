import CompanyInfo from '../company/CompanyInfo'
import SearchForCompany from '../searchBar/SearchForCompany'
import classes from './Compare.module.css'

export default function Compare() {
  return (
    <div className={classes.container}>
      <h1>Porównanie spółek</h1>
      <div className={classes.parameters}>
        <div className={classes.leftCompany}>
          <h2>Wybierz spółkę numer 1 </h2>
          <SearchForCompany id='search1' />
          <p className='companyDates1'>Dostępne daty: </p>
        </div>
        <div className={classes.rightCompany}>
          <h2>Wybierz spółkę numer 2 </h2>
          <SearchForCompany id='search2' />
          <p className='companyDates2'>Dostępne daty: </p>
        </div>
      </div>
      <CompanyInfo compare={true}/>

    </div>
  )
}
