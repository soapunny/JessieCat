import StatusDBModel from "../db/statusDBModel"


export const createStatus = async () => {
    const statusDBModel = new StatusDBModel();
    return statusDBModel.save();
}

export const deleteStatusByFilter = async (filter) => {
    return StatusDBModel.deleteOne(filter);
}