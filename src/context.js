
import React, { useState, useContext, useEffect } from 'react';
import { useCallback } from 'react';

const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("a");
  const [cocktails, setCocktails] = useState([]);

  const fetchDrinks = useCallback (async () => {
    setLoading(true);
    try {
// the URL finishes with an "=", so right at the end we put the "id" to complete the URL
      const response = await fetch(`${url}${searchTerm}`);
      const data = await response.json(); 
// "data" is an object, and inside there is an array of "drinks"
      const {drinks} = data;
      if (drinks) {
        const newCocktails = drinks.map((item) => {
          const {
            idDrink, 
            strDrink, 
            strDrinkThumb, 
            strAlcoholic, 
            strGlass
          } = item;
          return {
            id:idDrink, 
            name:strDrink, 
            image:strDrinkThumb, 
            info:strAlcoholic, 
            glass:strGlass 
          };
        });
        setCocktails(newCocktails);
      } else { 
        setCocktails([]);
      };
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    };
// dependecy array for the useCallback
  }, [searchTerm]); 

  useEffect(() => {
    fetchDrinks();
  }, [searchTerm,fetchDrinks]);

  return (
    <AppContext.Provider value={{
      loading,
      searchTerm,
      cocktails,
      setSearchTerm
    }}>
      {children}
    </AppContext.Provider>
  )
};

// Custom Hook
export const useGlobalContext = () => {
  return useContext(AppContext)
};

export { AppContext, AppProvider };
 