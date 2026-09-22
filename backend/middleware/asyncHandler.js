// =====================================================
// ASYNC HANDLER MIDDLEWARE
// =====================================================

// This function catches errors from async controllers
// and passes them to the centralized error middleware.

const asyncHandler = (controllerFunction) => {
  return (req, res, next) => {
    Promise
      .resolve(controllerFunction(req, res, next))
      .catch(next);
  };
};

module.exports = asyncHandler;