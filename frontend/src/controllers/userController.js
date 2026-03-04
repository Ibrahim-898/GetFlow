import { fetchUsers, addUser } from "../services/userService";

export const getUsers = async () => {

   const data = await fetchUsers();

   return data;
};

export const createUser = async (userData) => {

   await addUser(userData);

};