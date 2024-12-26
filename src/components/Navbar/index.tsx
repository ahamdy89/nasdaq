import { useRef, useState } from "react";
import classes from "./index.module.css";
import nasdaq_logo from "../../assets/NASDAQ_Logo.svg";


const Navbar = ({
  onSearch,
}: {
  onSearch: (term: string | undefined) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Use ReturnType<typeof setTimeout>

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(value || undefined);
    }, 500);
  };

  return (
    <nav className={classes.navbar}>
      <img src={nasdaq_logo}/>
      <input
        type="text"
        placeholder="Search tickers..."
        value={searchTerm}
        onChange={handleSearchChange}
        className={classes.searchInput}
      />
    </nav>
  );
};

export default Navbar;
