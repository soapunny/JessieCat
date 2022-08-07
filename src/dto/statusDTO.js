import StatusDBModel from "../db/statusDBModel";

class StatusDTO {
    _id = undefined;
    status = undefined;
    lastUpdatedDate = undefined;
    dueDate = undefined;

    constructor(statusDBModel){
        if(statusDBModel){
            this._id = statusDBModel._id;
            this.status = statusDBModel.status;
            this.lastUpdatedDate = statusDBModel.lastUpdatedDate;
            this.dueDate = statusDBModel.dueDate;
        }
    }

    toStatusDBModel = () => {
        const status = this.status;
        const lastUpdatedDate = this.lastUpdatedDate;
        const dueDate = this.dueDate;

        const statusDBModel = new StatusDBModel({
            status,
            lastUpdatedDate,
            dueDate,
        });

        return statusDBModel;
    }
}

export default StatusDTO;