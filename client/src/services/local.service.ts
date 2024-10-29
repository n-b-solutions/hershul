import { API_BASE_URL } from '@/const/api.const';
import axios from 'axios';

const { VITE_GEONAMES_USERNAME, VITE_IPINFO_TOKEN } = import.meta.env;

const geonamesUsername = VITE_GEONAMES_USERNAME || '';
const ipinfoToken = VITE_IPINFO_TOKEN || '';

// Function to get the geonameid for the client's location
const getGeonameId = async (): Promise<string> => {
  try {
    const ipinfoResponse = await axios.get(`https://ipinfo.io/json?token=${ipinfoToken}`);
    const { city, country } = ipinfoResponse.data;

    const geonameResponse = await axios.get(
      `http://api.geonames.org/searchJSON?q=${city},${country}&maxRows=1&username=${geonamesUsername}`
    );
    const geonameData = geonameResponse.data;

    if (geonameData.geonames && geonameData.geonames.length > 0) {
      return geonameData.geonames[0].geonameId;
    }

    throw new Error(`GeonameId not found for location: ${city}, ${country}`);
  } catch (error) {
    console.error('Failed to get geonameid:', error);
    throw error;
  }
};

// Function to send the geonameid to the server
export const sendGeonameidToServer = async () => {
  try {
    const geonameid = await getGeonameId();
    await axios.post(`${API_BASE_URL}/geonameid`, { geonameid });
    console.log('Geonameid sent to server:', geonameid);
  } catch (error) {
    console.error('Failed to send geonameid to server:', error);
  }
};
