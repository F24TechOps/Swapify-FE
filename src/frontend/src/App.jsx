import React, { useState, useEffect } from "react";
import "./css/App.css";
import Header from "./components/Header.jsx";
import Editor from "./components/Editor.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createMappingData, deleteCompany, getCompanies } from "./services/api";

function App() {
  const [company, setCompany] = useState(
    localStorage.getItem("selectedCompany") || "Force24"
  );
  const [companies, setCompanies] = useState(['Force24']);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      const savedCompanies = await getCompanies().then((res) => res.data);
      setCompanies(savedCompanies);
      localStorage.setItem("companies", JSON.stringify(savedCompanies));
    };
    fetchCompanies();
  }, []);

  const handleCompanyChange = (e) => {
    const selectedCompany = e.target.value;
    setCompany(selectedCompany);
    localStorage.setItem("selectedCompany", selectedCompany);
  };

  const toggleCreateNewCompany = () => {
    setIsCreatingCompany(!isCreatingCompany);
    setNewCompanyName("");
  };

  const saveCompany = async () => {
    let normalizedCompanyName = newCompanyName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    window.location.reload();
    if (normalizedCompanyName && !companies.includes(normalizedCompanyName)) {
      localStorage.setItem("companies", JSON.stringify(companies));
      localStorage.setItem("selectedCompany", normalizedCompanyName);
      setIsCreatingCompany(false);

      await createMappingData("email", normalizedCompanyName);
      await createMappingData("microsite", normalizedCompanyName);
      await createMappingData("templates", normalizedCompanyName);

      window.location.reload();
    }
  };

  const handleDeleteCompany = (comp) => {
    if (comp !== "Force24") {
      deleteCompany(comp);
      const filteredCompanies = companies.filter((c) => c !== comp);
      setCompanies(filteredCompanies);
      localStorage.setItem("companies", JSON.stringify(filteredCompanies));

      if (company === comp) {
        const newSelectedCompany =
          filteredCompanies.length > 0 ? filteredCompanies[0] : "Force24";
        setCompany(newSelectedCompany);
        localStorage.setItem("selectedCompany", newSelectedCompany);
      }
    }
  };

  return (
    <Router>
      <Header />
      <div className="company-input">
        <div className="create-company-input">
          <button onClick={toggleCreateNewCompany}>
            {isCreatingCompany ? "Cancel" : "Create New Company"}
          </button>
          {isCreatingCompany && (
            <>
              <input
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
              <button onClick={saveCompany}>Save</button>
            </>
          )}
          {!isCreatingCompany && (
            <div className="custom-select">
              <select onChange={handleCompanyChange} value={company}>
                {companies.map((comp, index) => (
                  <option key={index} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {company !== 'Force24' && <button onClick={() => handleDeleteCompany(company)}>
          Delete Company
        </button>}
      </div>
      <div className="description">
        <ol>
          <li>
            Enter the attribute you would like to replace the current attributes
            with into the input box.
          </li>
          <li>Click Submit to see the changes</li>
          <li>Once you are happy with the template, select download.</li>
        </ol>
      </div>
      <Routes>
        <Route
          path="/microsite"
          element={<Editor type="microsite" company={company} />}
        />
        <Route
          path="/email"
          element={<Editor type="email" company={company} />}
        />
        <Route
          path="/templates"
          element={<Editor type="templates" company={company} />}
        />
        <Route path="/" element={<Editor type="email" company={company} />} />
      </Routes>
    </Router>
  );
}

export default App;
