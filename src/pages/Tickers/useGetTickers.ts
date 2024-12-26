import { useEffect, useReducer } from "react";
import { Ticker } from "../../domain-models";
import { requestFetchAllTickers } from "../../network";

interface State {
  isLoading: boolean;
  pageSize: number;
  tickers: Ticker[];
  filters?: {
    search?: string | undefined;
  };
  nextUrl: string | undefined;
  cursor: string | undefined;
  totalCount: number;
  error: unknown;
}

type Action =
  | {
      type: "FETCH_ALL_START";
    }
  | {
      type: "FETCH_ALL_SUCCESS";
      tickers: Ticker[];
      nextUrl: string | undefined;
      count: number;
    }
  | {
      type: "FETCH_ALL_ERROR";
      error: unknown;
    }
  | {
      type: "CHANGE_FILTERS";
      filters: State["filters"];
    }
  | {
      type: "CHANGE_PAGE";
      cursor: string | undefined;
    };

type ActionHandlers = {
  [key in Action["type"]]: (
    state: State,
    action: Extract<Action, { type: key }>
  ) => State;
};

const initialState: State = {
  isLoading: false,
  pageSize: 20,
  totalCount: 0,
  nextUrl: undefined,
  cursor: undefined,
  tickers: [],
  error: null,
  filters: {},
};

const actionHandlers: ActionHandlers = {
  FETCH_ALL_START: (state, _action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  FETCH_ALL_SUCCESS: (state, { tickers, count, nextUrl }) => ({
    ...state,
    isLoading: false,
    tickers: state.filters?.search ? tickers : [...state.tickers, ...tickers],
    totalCount: count,
    nextUrl,
  }),
  FETCH_ALL_ERROR: (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }),
  CHANGE_FILTERS: (state, { filters }) => ({
    ...state,
    isLoading: true,
    filters,
  }),
  CHANGE_PAGE: (state, { cursor }) => ({
    ...state,
    isLoading: true,
    cursor,
  }),
};

function reducer(state: State = initialState, action: Action): State {
  return actionHandlers[action.type]?.(state, action as any) || state;
}

const useGetTickers = () => {
  const [
    {
      isLoading,
      pageSize,
      tickers,
      totalCount,
      error,
      nextUrl,
      cursor,
      filters,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({ type: "FETCH_ALL_START" });
    const controller = new AbortController();
    const signal = controller.signal;

    requestFetchAllTickers({
      limit: pageSize,
      cursor: cursor ? nextUrl : undefined,
      ...filters,
      options: { signal },
    })
      .then(({ count, results, next_url }) => {
        dispatch({
          type: "FETCH_ALL_SUCCESS",
          tickers: results,
          count,
          nextUrl: next_url ? next_url.split("=")[1] : undefined,
        });
      })
      .catch((error) => {
        dispatch({ type: "FETCH_ALL_ERROR", error });
      });

    return () => controller.abort();
  }, [cursor, filters]);

  const changePage = (nextUrl: string) => {
    dispatch({ type: "CHANGE_PAGE", cursor: nextUrl });
  };

  const changeFilters = (filters: State["filters"]) =>
    dispatch({ type: "CHANGE_FILTERS", filters });

  return {
    isLoading,
    pageSize,
    tickers,
    totalCount,
    error,
    changePage,
    nextUrl,
    changeFilters,
  };
};

export { useGetTickers };
