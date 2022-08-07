import { createStatus, deleteStatusByFilter } from "../dao/statusDAO";
import StatusDTO from "../dto/statusDTO";
import { userStatus } from "../names/names";


export const saveNewStatus = async () => {
    const statusDBModel = await createStatus();
    if(statusDBModel){
        return new StatusDTO(statusDBModel);
    }
    return undefined;
}

export const deleteStatusById = async (_id) => {
    const statusDBModel = await deleteStatusByFilter({_id});
    if(statusDBModel)
        return new StatusDTO(statusDBModel);
    return undefined;
}