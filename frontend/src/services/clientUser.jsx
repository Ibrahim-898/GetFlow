import api from "./api";

export const clientUserTableAPI = {
  getTable: (apiKey) => {
    return api.post("/api/user/table", {
      apiKey, 
    });
  },
};