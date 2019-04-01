import instance from '../config/axios-config';

export const getAllVenues = (limit,offset) => {
    console.log("inside getall of enquiry api");
    return instance.get('/venues/allrows/'+limit+'/'+offset+'');   
}

export const editVenue = (id, data) => {
    console.log(" inside editVenue api, data =>",data);
    return instance.patch('/venues/edit/'+id,data);  
}

export const getRowsCount = () => {
    console.log("inside getRowsCount of enquiry api");
    return instance.get('/venues/rowsCount/');   
}

export const deleteVenue = (id) => {
    return instance.delete('/venues/delete/'+id);
}

export const blockVenue = (id) => {
    return instance.patch('/venues/block/'+id);
}

export const unBlockVenue = (id) => {
    return instance.patch('/venues/unblock/'+id);
}