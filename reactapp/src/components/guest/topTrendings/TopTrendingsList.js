import classes from "./TopTrendingsList.module.css";
import { useState, useEffect } from "react";
import TopTrendingsTbody from "./topTrendingsTbody/TopTrendingsTbody";
import { ThreeDots } from "react-loader-spinner";
import { Outlet } from "react-router-dom";
export default function TopTrendingsList() {
  const [trendings, setTrendings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);
  async function fetchDataHandler() {
    setIsLoading(true);
    const response = await fetch("http://127.0.0.1:5000/api/trendings/").catch((e) => setInternetConnection(false));
    const data = await response.json();
    let data_array = [];
    for (let i in data.results) data_array.push([i, data.results[i]]);
    sessionStorage.setItem('trendings', JSON.stringify(data_array))
    setTrendings(data_array)
    setIsLoading(false);
  }
  function loadDataFromSession(){
    setTrendings(JSON.parse(sessionStorage.getItem('trendings')))
  }
  useEffect(() => {
    if(sessionStorage.getItem('trendings') !== null){
        loadDataFromSession()
    }else{
        fetchDataHandler()
    }

  }, []);
  return (

    <div className={classes.mainContainer}>
      {!! internetConnection && <h1 className={classes.header}>Popularne w tym momencie</h1>}
      {!internetConnection && <h1 className={`${classes.header}, ${'error'}`}>Brak połączenia z internetem</h1> }
      <table className={classes.tableTrendings}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Nazwa</th>
            <th>Ostatnia cena</th>
            <th>Zmiana ceny</th>
          </tr>
        </thead>

        {!isLoading && <TopTrendingsTbody companies={trendings} />}
      </table>
      {isLoading && (
        <div className="loading-dots">
          <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="white"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName="loading-spinner"
          visible={true}
        /></div>
      )}
      <Outlet />
    </div>
  );
}
