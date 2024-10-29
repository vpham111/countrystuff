import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StackChart from "./StackChart";
import "./HomePage.css";

function HomePage() {
  const [countryObjs, setObjs] = useState([]);
  // name, capital, continent, timezone, population, flag
  const [mostCommonContinent, setMostCommonContinent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPopulation, setMaxPopulation] = useState(1000000000);
  const [selectedContinents, setSelectedContinents] = useState({
    Asia: true,
    Europe: true,
    Africa: true,
    Oceania: true,
    "North America": true,
    "South America": true,
    Antarctica: true,
  });
  const [mostPopulated, setMostPopulated] = useState([]);
  const [leastPopulated, setLeastPopulated] = useState([]);
  const [largestCountries, setLargestCountries] = useState([]);
  const [smallestCountries, setSmallestCountries] = useState([]);

  useEffect(() => {
    async function getCountries() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        console.log(data)

        const sortedCountries = data
          .map((country) => ({
            name: country.name["common"],
            capital: country.capital ? country.capital[0] : "N/A",
            continent: country.continents ? country.continents[0] : "N/A",
            area: country.area,
            population: country.population,
            flag: country.flags["png"],
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setObjs(sortedCountries);

        const continents = ["Asia", "Europe", "Africa", "Oceania", "North America", "South America", "Antarctica"];
        const mostPopulatedData = [];
        const leastPopulatedData = [];
        const largestCountriesData = [];
        const smallestCountriesData = [];

        continents.forEach((continent) => {
          const countriesInContinent = sortedCountries.filter(country => country.continent === continent);

          if (countriesInContinent.length) {
            // Most and Least Populated
            const mostPopulatedCountry = countriesInContinent.reduce((a, b) => (a.population > b.population ? a : b));
            const leastPopulatedCountry = countriesInContinent.reduce((a, b) => (a.population < b.population ? a : b));
            
            mostPopulatedData.push({ name: mostPopulatedCountry.name, pv: mostPopulatedCountry.population, uv: mostPopulatedCountry.area });
            leastPopulatedData.push({ name: leastPopulatedCountry.name, pv: leastPopulatedCountry.population, uv: leastPopulatedCountry.area });

            // Largest and Smallest by Area
            const largestCountry = countriesInContinent.reduce((a, b) => (a.area > b.area ? a : b));
            const smallestCountry = countriesInContinent.reduce((a, b) => (a.area < b.area ? a : b));

            largestCountriesData.push({ name: largestCountry.name, pv: largestCountry.population, uv: largestCountry.area });
            smallestCountriesData.push({ name: smallestCountry.name, pv: smallestCountry.population, uv: smallestCountry.area });
          }
        });

        console.log(mostPopulatedData)

        setMostPopulated(mostPopulatedData);
        setLeastPopulated(leastPopulatedData);
        setLargestCountries(largestCountriesData);
        setSmallestCountries(smallestCountriesData);

        const continentCounts = sortedCountries.reduce((acc, country) => {
          const continent = country.continent;
          acc[continent] = (acc[continent] || 0) + 1;
          return acc;
        }, {});

        const mostCommon = Object.keys(continentCounts).reduce((a, b) =>
          continentCounts[a] > continentCounts[b] ? a : b
        );

        setMostCommonContinent(mostCommon);
      } catch (err) {
        console.error(err);
      }
    }
    getCountries();
  }, []);

  const filteredCountries = countryObjs.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const populationFilteredCountries = filteredCountries.filter(
    (country) => country.population <= maxPopulation
  );

  const continentFilteredCountries = populationFilteredCountries.filter((country) =>
    selectedContinents[country.continent] 
  );

  const handleContinentChange = (continent) => {

    setSelectedContinents((prevSelected) => ({
      ...prevSelected,
      [continent]: !prevSelected[continent], 
    }));
  };


  return (
    <>
      <div className="stats">
        <div>
          <h2>Number of Countries: {countryObjs.length}</h2>
        </div>
        <div>
          <h2>
            Average Population: {' '}
            {countryObjs.reduce((sum, country) => sum + country.population, 0) /
              countryObjs.length}
            {' '}people
          </h2>
        </div>
        <div>
          <h2>Most Common Continent: {mostCommonContinent}</h2>
        </div>
      </div>

      <div className="charts-container">
  <div className="chart-wrapper">
    <h5>Most Populated Countries by Continent</h5>
    <StackChart data={mostPopulated} bar1Label="Population" bar2Label="Area (km²)" />
  </div>

  <div className="chart-wrapper">
    <h5>Least Populated Countries by Continent</h5>
    <StackChart data={leastPopulated} bar1Label="Population" bar2Label="Area (km²)" />
  </div>

  <div className="chart-wrapper">
    <h5>Largest Countries by Continent</h5>
    <StackChart data={largestCountries} bar1Label="Population" bar2Label="Area (km²)" />
  </div>

  <div className="chart-wrapper">
    <h5>Smallest Countries by Continent</h5>
    <StackChart data={smallestCountries} bar1Label="Population" bar2Label="Area (km²)" />
  </div>
</div>


      <div>
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

      <div>
        <label htmlFor="populationSlider">Max Population: {maxPopulation.toLocaleString()}</label>
        <input
          type="range"
          id="populationSlider"
          min="0"
          max="1500000000" 
          value={maxPopulation}
          onChange={(e) => setMaxPopulation(Number(e.target.value))} 
        />
      </div>

      <div>
        <h3>Select Continents:</h3>
        {Object.keys(selectedContinents).map((continent) => (
          <label key={continent}>
            <input
              type="checkbox"
              checked={selectedContinents[continent]}
              onChange={() => handleContinentChange(continent)}
            />
            {continent}
          </label>
        ))}
      </div>

      <div className="facts-container">
        <div className="headers-row">
          <div className="attr-col">
            <h3>Name</h3>
          </div>
          
          <div className="attr-col">
            <h3>Continent</h3>
          </div>
          <div className="attr-col">
            <h3>Area (km²)</h3>
          </div>
          <div className="attr-col">
            <h3>Population</h3>
          </div>
          <div className="attr-col">
            <h3>Details</h3>
          </div>
        </div>

        <div className="content-row">
          {continentFilteredCountries.map((country, index) => (
            <>
              <div className="attr-col">
                <p key={`name-${index}`}>{country.name}</p>
              </div>


              <div className="attr-col">
                <p key={`continent-${index}`}>{country.continent}</p>
              </div>

              <div className="attr-col">
                <p key={`area-${index}`}>{country.area}</p>
              </div>

              <div className="attr-col">
                <p key={`population-${index}`}>
                  {country.population.toLocaleString()}
                </p>
              </div>

              <div className="attr-col">
              <Link to={`/country/${country.name}`}>🔗</Link>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default HomePage;
