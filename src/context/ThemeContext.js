import { createContext, useState } from "react";
import { Theme } from "../color.js";

export const ThemeContext = createContext({
  theme: Theme.LIGHT,
  setTheme: () => {},
});
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Theme.LIGHT);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};