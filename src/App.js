import "./App.css";
import React from "react";
import Header from "./Header.js";
import ContentCard from "./ContentCard.js";
import RepositoriesPage from "./RepositoriesPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { Theme } from "./color.js";
import { ThemeContext } from "./context/ThemeContext";

function App() {
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
  return (
    <div className={`app ${currentTheme}`}>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<ContentCard />} />
          <Route path="/repositories" element={<RepositoriesPage />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
