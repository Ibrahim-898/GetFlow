import axios from "axios";

const API = "http://localhost:8000/api/users";

export const fetchUsers = async () => {

   const response = await axios.get(API);

   return response.data;

};

export const addUser = async (userData) => {

   const response = await axios.post(API, userData);

   return response.data;

};