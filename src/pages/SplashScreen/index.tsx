import { useEffect, useState } from "react";
import nasdaq_logo from "../../assets/NASDAQ_Logo.svg"; // Adjust path to logo
import classes from "./index.module.css"; // You can customize styles

const SplashScreen = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={classes.splashScreen}>
      <div className={classes.logoContainer}>
        <img src={nasdaq_logo} className={classes.logo} />
      </div>
      <div className={classes.developerName}>
        <p>Developed by Ahmed Hamdy</p>
      </div>
    </div>
  );
};

export default SplashScreen;