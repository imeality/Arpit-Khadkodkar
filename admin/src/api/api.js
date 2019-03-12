import instance from '../config/axios-config';

export const login = (id, password) => {

    return instance.post('/admin/login',{
        id: id,
        password: password
    });
}
