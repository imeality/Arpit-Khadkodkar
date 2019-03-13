import instance from '../config/axios-config';

// --------  admin   -------

export const login = (id, password) => {

    return instance.post('/admin/login',{
        email: id,
        password: password
    });
}

// -------- for bookings ---------

export const totalBookings = () => {

    return instance.get('/bookings/count');
}

export const newBookings = () => {
    return instance.get('/bookings/count/newBookings');   
}

// -----------  for users --------- 

export const newUsers = () => {

    return instance.get('/users/count/newUsers');
}

// export const averageUser = () => {
//     return instance.get('/users/count/average');
// }



export const getUser = () => {

    return instance.get('/users');
}


// ------------  for moderators -----------

export const moderatorRequest = () => {
    return instance.get('/moderators/count/temporary');   
}

// ------------ for enquiries -----------

export const newEnquiries = () => {
    return instance.get('/enquiries/count/newEnquiries');   
}


// -----------  venues ---------------

export const venuesListed = () => {
    console.log(" inside venues listed api ");
    return instance.get('/venues/count/all');   
}

// ---------  payment ----------

export const paymentReceived = () => {
    return instance.get('/payments/count/newReceived');   
}

export const totalRevenue = () => {
    return instance.get('/payments/count/totalRevenue');   
}