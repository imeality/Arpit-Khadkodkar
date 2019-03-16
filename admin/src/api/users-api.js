import instance from '../config/axios-config';

export const getAllUsersWithPagination = (limit,offset) => {
    return instance.get('/users/all/'+limit+'/'+offset+'');   
}