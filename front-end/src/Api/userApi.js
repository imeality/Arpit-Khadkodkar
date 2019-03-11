import instance from '../utilities/axiosUtility';

const login = (email, password) => {
    return instance.post('/users/login', {
        user_email: email,
        user_password: password
    });
}

export {
    login
}