
export class AppError extends Error {
    statusCode: number;
    status: string;
    /**
     * 
     * @param message destructured message and statusCode as param0
     * @param statusCode 
     */
    constructor({ message, statusCode }: { message: string; statusCode: number; }) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
