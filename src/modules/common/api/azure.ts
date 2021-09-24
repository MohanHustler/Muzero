import axios from 'axios';
import { AzureMapResponse } from '../contracts/azure_map';
import { GET_AZURE_LOCATIONS } from './routes';

export const fetchLocations = async (query: string) => {
  const response = await axios.get<AzureMapResponse>(GET_AZURE_LOCATIONS, {
    params: {
      'subscription-key': process.env.REACT_APP_AZURE_MAPS_KEY,
      'api-version': '1.0',
      query: query,
    },
  });

  return response.data;
};
