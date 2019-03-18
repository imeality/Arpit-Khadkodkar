import instance from '../config/axios-config';

export const getAllUsersWithPagination = (limit,offset) => {
    return instance.get('/users/all/'+limit+'/'+offset+'');   
}

export const blockUser = (id) => {
    return instance.patch('/users/block/'+id);
}

export const unblockUser = (id) => {
    return instance.patch('/users/unblock/'+id);
}

export const deleteUser = (id) => {
    return instance.delete('/users/delete/'+id);
}

export const editInfo = (id, data) => {
    return instance.patch('/users/editInfo/'+id, data);
}

export const editIndividualUser = (id, data) => {
    return instance.patch('/users/editIndividualUser/'+id, data);
}

export const editCorporateUser = (id, data) => {
    return instance.patch('/users/editCorporateUser/'+id, data);
}
