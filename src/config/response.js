export const responseData = (res,message, data,statustCode) => {
    res.status(statustCode).json({
        message:message,
        content:data,
        Date: new Date()
    })
}