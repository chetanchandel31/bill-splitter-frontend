import axios from "axios";

export const BASE_URL = process.env.REACT_APP_BACKEND;

export const API = axios.create({ baseURL: BASE_URL });

//a function that runs before each request
// always adds bearer token to req headers. if it's present in local storage
API.interceptors.request.use((req) => {
  const jwt = localStorage.getItem("jwt");

  if (req.headers && jwt) {
    req.headers.Authorization = `Bearer ${JSON.parse(jwt)?.token}`;
  }

  return req;
});
