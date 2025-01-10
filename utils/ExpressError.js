class ExpressError extends Error{
    constructor(status , message){
        super();
        super.status = status;
        super.message = message;
    }
}

module.exports = ExpressError;