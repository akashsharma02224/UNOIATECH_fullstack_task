const asyncHandler = (requestHandler) => {
    return (req, resp, next) => {
        Promise.resolve(requestHandler(req, resp, next)).catch((err) => next(err))
    }
}

module.exports = { asyncHandler };