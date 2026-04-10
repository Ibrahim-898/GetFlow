import api from "./api";

export const  analyticsAPI = {
   getAnalytics : ()=> api.get('api/analytics/logs')
}