import axios from "axios";
import * as qs from "qs";

const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN || null;
const BASE_URL = import.meta.env.VITE_BASE_URL || null;

const instancePromise = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  paramsSerializer: {
    serialize(params) {
      return qs.stringify(params); 
    },
  },
});


instancePromise.interceptors.request.use(
  async function (config) {
    if (BEARER_TOKEN) {
      config.headers.Authorization = `Bearer ${BEARER_TOKEN}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instancePromise.interceptors.response.use(undefined, async function (error) {
  if (!axios.isAxiosError(error) || !error.response) {
    throw error.response.data.error; 
  }
  return Promise.reject(error);
});

export default function getInstance() {
  return instancePromise;
}