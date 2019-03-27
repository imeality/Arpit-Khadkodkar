import instance from '../config/axios-config';

export const getAllModerators = (limit,offset) => {
    return instance.get('/moderators/all/'+limit+'/'+offset+'');   
}

export const getTempModerators = (limit,offset) => {
    return instance.get('/moderators/temporary/'+limit+'/'+offset+'');   
}

