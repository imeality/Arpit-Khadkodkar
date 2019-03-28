import instance from '../config/axios-config';

export const getAllEnquiries = (limit,offset) => {
    console.log("inside getall of enquiry api");
    return instance.get('/enquiries/all/'+limit+'/'+offset+'');   
}

export const editEnquiry = (id, data) => {
    console.log(" inside editBookings api, data =>",data);
    return instance.patch('/enquiries/edit/'+id,data);   
}

export const getRowsCount = () => {
    console.log("inside getRowsCount of enquiry api");
    return instance.get('/enquiries/rowsCount/');   
}

export const deleteEnquiry = (id) => {
    return instance.delete('/enquiries/delete/'+id);
}
