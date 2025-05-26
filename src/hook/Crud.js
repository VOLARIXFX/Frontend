import { useState } from 'react';
import api from '../../TokenHttp';
import axios from 'axios'; 

const UseCrud = (path = '') => {
  const [response, setResponse] = useState(null);
  const [responseById, setResponseById] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleError = (error) => {
    const errorMsg = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : error.message;
    setError(errorMsg);
    console.error("Error en la solicitud:", errorMsg);
    return errorMsg;
  };

  const getApi = async (urlOverride, isAuthenticatedRequest = true) => {
    setLoading(true);
    const requestUrl = urlOverride || path;
    try {
      let result;
      if (isAuthenticatedRequest) {
        result = await api.get(requestUrl); 
      } else {
        result = await axios.get(requestUrl); 
      }
      
      setResponse(result.data);
      return result.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const getApiById = async (id, isAuthenticatedRequest = true) => {
    setLoading(true);
    try {
      const url = `${path}/${id}`.replace(/([^:]\/)\/+/g, "$1");
      
      let result;
      if (isAuthenticatedRequest) {
         result = await api.get(url);
      } else {
         result = await axios.get(url); 
      }
      
      if (result.data) {
        if (Array.isArray(result.data)) {
          setResponseById(result.data);
          return result.data;
        } else {
          setResponseById([result.data]);
          return [result.data];
        }
      }
      
      return null;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setError(errorMsg);
      console.error("Error en la solicitud:", errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const postApi = async (data, isAuthenticatedRequest = true) => {
    setLoading(true);
    try {
      let result;
      if (isAuthenticatedRequest) {
        result = await api.post(path, data);
      } else {
        result = await axios.post(path, data); // Usar una instancia sin token
      }
       
      setResponse(result.data);
      return result.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  const updateApi = async (data, id = '', isAuthenticatedRequest = true) => {
    setLoading(true);
    try {
      const url = `${path}${id}`; // Construir la URL correctamente
      let result;
      if (isAuthenticatedRequest) {
         result = await api.patch(url, data); // Usar la instancia con token
      } else {
         result = await axios.patch(url, data); // Usar una instancia sin token
      }
    
      setResponse(result.data);
      return result.data;
    } catch (error) {
      const errorMsg = handleError(error);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  

  return { 
    response, 
    responseById, 
    error, 
    loading, 
    getApi, 
    getApiById, 
    postApi, 
    updateApi,
    
  };
};

export default UseCrud;
