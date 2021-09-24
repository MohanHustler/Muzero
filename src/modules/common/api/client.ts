import axios from 'axios';

export const fetchClientIpAddress = async () => {
  const response = await axios.get<{ ip: string }>(
    'https://ipinfo.io?token=' + process.env.REACT_APP_IPINFO_TOKEN
  );

  return response.data.ip;
};
