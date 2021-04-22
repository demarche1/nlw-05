import axios from "axios";

export default function useApi(config) {
  const call = async (localConfig) => {
    const finalConfig = {
      ...config,
      ...localConfig,
      baseURL: "http://localhost:5000",
    };
    const response = await axios(finalConfig);
    return response;
  };

  return [call];
}
