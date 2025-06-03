import api from '../../utils/api';

export type SignUpDTO = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    birthday: string;
}

export const signIn = (email, password) => {
    return api.post('/auth/signin', { 
        email, 
        password,
    });
};

export const signUp = (data: SignUpDTO) => {
    return api.post('/auth/signup', data);
};

export const signOut = () => {
    return api.get('/auth/signout');
};