import UserDBModel from "../db/userDBModel";

export const updateUser = async (userDBModel) => {
    const userDB = await userDBModel.save();
    console.log("Saved : "+userDB);
}

export const findUserByEmail = async (email) => {
    return await UserDBModel.findOne({email});
}

export const findUserByEmailAndUpdate = async (email, update) => {
    const filter = {email};
    return await UserDBModel.findOneAndUpdate(filter, update, {new: true});
}
export const findUserByEmailAndUpdatePassword = async (email, password) => {
    const filter = {email};
    const hashedPassword = await UserDBModel.hashPassword(password);
    const update = {password: hashedPassword}
    return await UserDBModel.findOneAndUpdate(filter, update, {new: true});
}

export const findUserByEmailAndPassword = async (email, password) => {
    const userDBModel = await findUserByEmail(email);
    let isSame = false;
    if(userDBModel)
        isSame = await UserDBModel.comparePassword(password, userDBModel.password);
    if(isSame)
        return userDBModel;
    return undefined;
}

export const doesEmailExist = async (email) => {
    return await UserDBModel.exists({email});
}

export const doesUsernameExist = async (username) => {
    return await UserDBModel.exists({username});
}