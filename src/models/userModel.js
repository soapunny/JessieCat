import { isExistsTypeAnnotation } from "@babel/types";
import { updateUser, findUserByEmailAndPassword, doesEmailExist, doesUsernameExist } from "../dao/userDAO"
import UserDTO from "../dto/userDTO";


export const joinUser = async (userDTO) => {
    await updateUser(userDTO.toUserDBModel());
}

export const login = async (email, password) => {
    const userDBModel = await findUserByEmailAndPassword(email, password);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const checkEmail = async(email) => {
    return await doesEmailExist(email);
}

export const checkUsername = async(username) => {
    return await doesUsernameExist(username);
}
