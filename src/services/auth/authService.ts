import * as authResource from "./authResource";
import * as authMapper from "./authMapper";
import { SignUpDTO } from "./authResource";
import { getSigUpResponse } from "./authMapper";

export const signIn = (email, password) => {
  return authResource.signIn(email, password).then((response) => response.data);
};

export const signUp = (data: SignUpDTO) => {
  const dto = authMapper.getSignUpDTO(data);
  return authResource
    .signUp(dto)
    .then((response) => getSigUpResponse(response.data));
};

export const signOut = () => {
  return authResource.signOut().then((response) => response.data);
};
