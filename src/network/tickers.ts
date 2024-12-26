import { Ticker } from "../domain-models";
import getInstance from "./axiosInstance";

interface RequestFetchAllTickersArgs {
  search?: string;
  limit?: number;
  cursor?: string;
  options?: {
    signal?: AbortSignal;
  };
}

interface RequestFetchAllTickersResponse {
  count: number;
  next_url: string;
  request_id: string;
  results: Ticker[];
  status: string;
}

const requestFetchAllTickers = async ({
  options,
  ...args
}: RequestFetchAllTickersArgs) => {
  const instance = await getInstance();

  const {
    data: { results, count, next_url },
  } = await instance.get<RequestFetchAllTickersResponse>(
    "/v3/reference/tickers",
    {
      params: args,
      signal: options?.signal,
    }
  );

  return {
    results,
    count,
    next_url,
  };
};

export { requestFetchAllTickers };
