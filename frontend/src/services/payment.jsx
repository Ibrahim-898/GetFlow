import api from "./api";

export const paymentAPI ={

    initPayment : (data)=> api.post('api/payment/init',data)
    

}