import instance from '../config/axios-config';

export const getAllBookings = (limit,offset) => {
    return instance.get('/bookings/all/admin/'+limit+'/'+offset+'');   
}

export const editBookings = (id, data) => {
    console.log(" inside editBookings api, data =>",data);
    return instance.patch('/bookings/edit/'+id,data);   
}

export const getRowsCount = () => {
    return instance.get('/bookings/rowsCount/');   
}

export const deleteBooking = (id) => {
    return instance.delete('/bookings/delete/'+id);   
}
