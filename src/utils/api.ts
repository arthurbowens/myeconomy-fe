import axios from "axios";

const app = axios.create({
    baseURL: "http://10.0.2.2:8080/passgenerator/",
    headers: {
      'Content-Type': 'application/json',
    }
});

app.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

app.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

export default app;