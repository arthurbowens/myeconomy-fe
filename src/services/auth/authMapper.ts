import { SignUpDTO } from "./authResource";

export const getSignUpDTO = (data: SignUpDTO) => {
    return {
        nome: data.name,
        email: data.email,
        senha: data.password,
        confirmacaoSenha: data.confirmPassword,
        dataNascimento: data.birthday,
    };
};

export const getSigUpResponse = (data: any) => {
    return {
        name: data.nome,
        email: data.email,
        birthday: data.dataNascimento,
        password: data.senha,
        confirmPassword: data.confirmacaoSenha,
    };
};