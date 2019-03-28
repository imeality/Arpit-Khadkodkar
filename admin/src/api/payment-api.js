import instance from '../config/axios-config';

export const getPaymentInfo = (limit,offset) => {
    //console.log("inside getpaymentinfo of payments api");
    return instance.get('/payments/all/'+limit+'/'+offset+'');   
}

export const editPayment = (id, data) => {
    //console.log(" inside editPayment api, data =>",data);
    return instance.patch('/payments/edit/'+id,data);   
}

export const getRowsCount = () => {
    //console.log("inside getRowsCount of payment api");
    return instance.get('/payments/rowsCount/');   
}

export const deletePayment = (id) => {
    return instance.delete('/payments/delete/'+id);
}
