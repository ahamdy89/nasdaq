import { Ticker } from "../../domain-models";
import classes from "./index.module.css";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
  isLoading: boolean;
  tickers: Ticker[];
  nextUrl: string | undefined;
  changePage: (nextPageKey: string) => void;
}

const Tickers = ({ isLoading, tickers, nextUrl, changePage }: Props) => {
  return (
    <InfiniteScroll
      dataLength={tickers.length}
      next={() => nextUrl && changePage(nextUrl)}
      hasMore={!!nextUrl}
      loader={null}
      className={classes["infinite-scroll-container"]}
    >
      <div className={classes["page-container"]}>
        {tickers.map((ticker) => (
          <div className={classes["card-container"]} key={ticker.ticker}>
            <p>{ticker.ticker}</p>
            <p>{ticker.name}</p>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default Tickers;
