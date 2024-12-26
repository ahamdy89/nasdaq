import { useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import SplashScreen from "./pages/SplashScreen";
import Tickers from "./pages/Tickers";
import { useGetTickers } from "./pages/Tickers/useGetTickers";
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";

function App() {
  const { isLoading, tickers, error, changePage, nextUrl, changeFilters } =
    useGetTickers();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.response.data.error as string, {variant:"error"});
    }
  }, [error]);

  const handleSearch = (term: string | undefined) => {
    changeFilters({ search: term });
  };

  return (
    <>
      <SplashScreen />
      <Navbar onSearch={handleSearch} />
      <Tickers
        isLoading={isLoading}
        tickers={tickers}
        changePage={(nextPageKey) => changePage(nextPageKey)}
        nextUrl={nextUrl}
      />
    </>
  );
}

export default App;
