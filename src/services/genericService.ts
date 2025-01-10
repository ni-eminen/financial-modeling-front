// ./services/genericService.ts
import axios, { AxiosResponse } from "axios";
import { ModelParams, ModelType, Quantity } from "../types/types";

// Define the base URL for the backend
const API_BASE_URL = "http://localhost:8000";

// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Example function to get data from an endpoint
export const createOperator = async (name: string): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post(
      `${API_BASE_URL}/create-operator/${name}`
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error for handling in the calling code
  }
};

export const createQuantity = async (
  quantity_name: string,
  operator_name: string,
  model: ModelType,
  model_params: ModelParams,
  categories: string[]
): Promise<any> => {
  try {
    const payload = {
      quantity_name,
      operator_name,
      model,
      model_params,
      categories,
    };

    const response: AxiosResponse = await apiClient.post(
      `${API_BASE_URL}/create-quantity`,
      payload
    );

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error for handling in the calling code
  }
};

export const createConvolution = async (
  quantity1_name: string,
  quantity2_name: string,
  operator1_name: string,
  operator2_name: string,
  operation: string,
  convolution_name: string
): Promise<any> => {
  try {
    const payload = {
      quantity1_name,
      quantity2_name,
      operator1_name,
      operator2_name,
      operation,
      convolution_name,
    };

    const response: AxiosResponse = await apiClient.post(
      `${API_BASE_URL}/create-convolution`,
      payload
    );

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error for handling in the calling code
  }
};

// Example function to post data to an endpoint
export const postData = async (endpoint: string, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post(endpoint, data);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error posting data:", error);
    throw error; // Rethrow the error for handling in the calling code
  }
};

export const updateQuantityParams = async (
  name: string,
  newParams: any,
  operator: string
) => {
  try {
    const payload = {
      params: newParams,
      operator_name: operator,
      quantity_name: name,
    };

    const response = await apiClient.post(
      `${API_BASE_URL}/update-parameters`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error("updateQuantityParams", error);
    return { error };
  }
};
// Add more functions for other HTTP methods (PUT, DELETE, etc.) as needed

export const getNewSamples = async (operator: string, quantity: string) => {
  try {
    const payload = {
      operator_name: operator,
      quantity_name: quantity,
    };

    const response = await apiClient.post(
      `${API_BASE_URL}/get-new-samples`,
      payload
    );

    return response.data.samples;
  } catch (error) {
    console.error("updateAllSamples", error);
    return { error };
  }
};
