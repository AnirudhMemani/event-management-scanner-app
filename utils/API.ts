import { SERVER_URL } from "@/constants";
import axios from "axios";

const API = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default API;
