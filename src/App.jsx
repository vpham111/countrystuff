import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./HomePage";
import CountryDetails from "./CountryDetails";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/country/:countryName" element={<CountryDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
