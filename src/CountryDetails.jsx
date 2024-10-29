import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default function CountryDetails() {
    const {countryName} = useParams();
    const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const data = await response.json();
        setCountryData(data[0]); 
      } catch (err) {
        console.error(err);
      }
    };

    fetchCountryData();
  }, [countryName]); 

  if (!countryData) return <p>Loading...</p>;

  return (
    <div>
      <h2>{countryData.name.common} Details</h2>
      <p>Capital: {countryData.capital[0]}</p>
      <p>Area: {countryData.area} km²</p>
      <p>Population: {countryData.population.toLocaleString()} people</p>
      <img src={countryData.flags.png} />
    </div>
  );
};