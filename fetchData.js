import fetch from 'node-fetch'
import config from './config.json' assert { type: 'json' };

async function fetchData(channel) {
  const apiUrl = config.apiUrl[channel];
  if (!apiUrl) {
    throw new Error(`Channel ${channel} not found`);
  }
  const response = await fetch(apiUrl);
  return await response.json();
}

export default fetchData;
