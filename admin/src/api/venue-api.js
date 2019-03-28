import instance from '../config/axios-config';

export const getAllVenues = (limit,offset) => {
    console.log("inside getall of enquiry api");
    return instance.get('/venues/all/'+limit+'/'+offset+'');   
}

export const editVenue = (id, data) => {
    console.log(" inside editBookings api, data =>",data);
    return instance.patch('/venues/edit/'+id,data);   
}

export const getRowsCount = () => {
    console.log("inside getRowsCount of enquiry api");
    return instance.get('/venues/rowsCount/');   
}

export const deleteVenue = (id) => {
    return instance.delete('/venues/delete/'+id);
}