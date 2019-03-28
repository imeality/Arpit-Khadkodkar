import instance from '../config/axios-config';

export const getAllModerators = (limit,offset) => {
    return instance.get('/moderators/all/'+limit+'/'+offset+'');   
}

export const getTempModerators = (limit,offset) => {
    return instance.get('/moderators/temporary/'+limit+'/'+offset+'');   
}

export const editModerators = (id,data) => {
    console.log("in editmoderator api data => ",data);
    return instance.patch('/moderators/edit/'+id,data);
}

export const permitModerator = (id) => {
    return instance.patch('/moderators/permit/'+id);
}

export const blockModerator = (id) => {
    return instance.patch('/moderators/block/'+id);
}

export const deleteModerator = (id) => {
    return instance.delete('/moderators/delete/'+id);
}

export const deleteTempModerator = (id) => {
    return instance.delete('/moderators/delete/newmoderator/'+id);
}

export const getModeratorsRowsCount = () => {
    return instance.get('/moderators/rowscount/');
}


