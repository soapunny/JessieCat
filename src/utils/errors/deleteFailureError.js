class DeleteFailureError extends Error {

    constructor(message) {
        super(message);
        this.name = "DeleteFailureError";
    }
}

export default DeleteFailureError;