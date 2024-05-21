import axios from 'axios';

const API_URL = '/api';

export const getTemplate = (type) => {
  return axios.get(`${API_URL}/${type}/template`);
}

export const getFinal = (type, company) => {
  return axios.get(`${API_URL}/${type}/${company}/final-template`)
}

export const getMappingData = (type, company) => {
  return axios.get(`${API_URL}/mapping/${type}/${company}`);
};

export const createZip = (type, company) => {
  return axios.post(`${API_URL}/create-download`, {type, company}, {responseType: 'blob'})
}

export const createMappingData = (type, company) => {
  return axios.post(`${API_URL}/create-mapping/${type}/${company}`);
};

export const makeSwap = (type, company) => {
  return axios.post(`${API_URL}/swap`, {type, company});
}

export const updateMappingData = (type, company, mappingData) => {
  return axios.patch(`${API_URL}/update-mapping/${type}/${company}`, mappingData);
};