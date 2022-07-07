/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import config from '../config';
import { CURRENTUSER, TOKEN } from '../constants/types';
import { refreshAccessToken } from '../actions/auth-request-actions';

const axiosInstance = axios.create({
  baseURL: config.api.base,
  // headers: {'Content-Type': 'application/json; charset=utf-8'}
});

// eslint-disable-next-line no-undef
export const getAuthToken = async () => {
  const tokenObj = JSON.parse(localStorage.getItem(TOKEN));
  if (tokenObj) {
    const now = new Date();
    const expireDate = new Date(tokenObj.expireAt);
    if (expireDate < now) {
      const currentUser = JSON.parse(localStorage.getItem(CURRENTUSER));
      const result = await refreshAccessToken(currentUser.currentLoggedInUserPrincipal);
      return result;
    }
    return tokenObj.token;
  }
};

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  // you can also do other modification in config
  return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use((response) => {
  if (response.status === 401) {
    // your failure logic
    return <Redirect to="/login" />;
  }
  return response;
}, (error) => Promise.reject(error));

export default axiosInstance;
