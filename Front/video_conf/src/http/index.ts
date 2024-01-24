import axios from 'axios';
import { environment } from './../environments/environment';

const API_URL = environment.apiUrl as string;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export default $api;
