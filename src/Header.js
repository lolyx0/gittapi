import { Button } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Theme } from "./color.js";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext.js";
import "./App.css";

const Header = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const handleOnSetTheme = () => {
    if (theme === Theme.LIGHT) {
      setTheme(Theme.DARK);
      return;
    }
    setTheme(Theme.LIGHT);
  };
  return (
    <div className="header">
      <h1 className="header__title">GitHub</h1>
      <Button
        endIcon={theme === Theme.LIGHT ? <LightModeIcon /> : <DarkModeIcon />}
        onClick={handleOnSetTheme}
        sx={{
          color: "var(--theme-text-primary)",
          "&:hover": {
            bgcolor: "var(--theme-secondary-background-color)",
          },
        }}
      >
        {theme}
      </Button>
    </div>
  );
};

export default Header;