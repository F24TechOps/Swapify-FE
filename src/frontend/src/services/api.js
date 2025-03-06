import axios from "axios";

const API_URL = "https://swapify-server-kw7h.onrender.com/api";

export const getTemplate = async (type) => {
  try {
    const response = axios.get(`${API_URL}/${type}/template`);
    return response;
  } catch (err) {
    console.error(`error in getTemplate: ${err}`);
    throw err;
  }
};

export const getCompanies = async () => {
  try {
    const response = axios.get(`${API_URL}/companies`);
    return response;
  } catch (err) {
    console.error(`error in getCompanies: ${err}`);
    throw err;
  }
};

export const getImages = async (imgName) => {
  try {
    const response = axios.get(`images/${imgName}`);
    return response;
  } catch (err) {
    console.error(`error getting image ${imgName}`);
    throw err;
  }
};

export const getFinal = (type, company) => {
  return axios.get(`${API_URL}/${type}/${company}/final-template`);
};

export const getMappingData = (type, company) => {
  return axios.get(`${API_URL}/mapping/${type}/${company}`);
};

export const createZipOrCopy = (type, company, imageUrls) => {
  return axios.post(  
    `${API_URL}/create-download`,
    { type, company, imageUrls},
    { responseType: "blob" }
  );
};

export const createMappingData = (type, company) => {
  return axios.post(`${API_URL}/create-mapping/${type}/${company}`);
};

export const makeSwap = (type, company, imageUrls) => {
  return axios.post(`${API_URL}/swap`, { type, company, imageUrls });
};

export const updateMappingData = (type, company, mappingData) => {
  return axios.patch(
    `${API_URL}/update-mapping/${type}/${company}`,
    mappingData
  );
};

export const processStarColor = (company, replaceColor, imageUrls) => {
  return axios.post(`${API_URL}/process-star`, {
    company,
    replaceColor,
    imageUrls,
  });
};

export const processCircleImage = (company, imageKey, imageUrl) =>
  axios.post(`${API_URL}/process-circle`, { company, imageKey, imageUrl });

export const deleteCompany = (company) => {
  return axios.delete(`${API_URL}/delete-company/${company}`);
}