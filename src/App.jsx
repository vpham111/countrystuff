import { useState, useEffect } from "react";
import "./App.css";

function App() {
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
    Americas: true,
    Antarctica: true,
  });

  useEffect(() => {
    async function getCountries() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        const sortedCountries = data
          .map((country) => ({
            name: country.name["common"],
            capital: country.capital ? country.capital[0] : "N/A",
            continent: country.continents ? country.continents[0] : "N/A",
            timezone: country.timezones ? country.timezones[0] : "N/A",
            population: country.population,
            flag: country.flags["png"],
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setObjs(sortedCountries);

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
            <h3>Capital</h3>
          </div>
          <div className="attr-col">
            <h3>Continent</h3>
          </div>
          <div className="attr-col">
            <h3>Timezone</h3>
          </div>
          <div className="attr-col">
            <h3>Population</h3>
          </div>
          <div className="attr-col">
            <h3>Flag</h3>
          </div>
        </div>

        <div className="content-row">
          {continentFilteredCountries.map((country, index) => (
            <>
              <div className="attr-col">
                <p key={`name-${index}`}>{country.name}</p>
              </div>

              <div className="attr-col">
                <p key={`capital-${index}`}>{country.capital}</p>
              </div>

              <div className="attr-col">
                <p key={`continent-${index}`}>{country.continent}</p>
              </div>

              <div className="attr-col">
                <p key={`timezone-${index}`}>{country.timezone}</p>
              </div>

              <div className="attr-col">
                <p key={`population-${index}`}>
                  {country.population.toLocaleString()}
                </p>
              </div>

              <div className="attr-col">
                <img
                  key={`flag-${index}`}
                  src={country.flag}
                  alt={`${country.name} flag`}
                  style={{ width: "50px", marginBottom: "10px" }}
                />
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
