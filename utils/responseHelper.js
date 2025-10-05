const respondSuccess = (res, data, meta = null, statusCode = 200) => {
  const response = {
    success: true,
    data
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

const respondError = (res, message, statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: {
      message,
      code: statusCode
    }
  };

  if (details) {
    response.error.details = details;
  }

  return res.status(statusCode).json(response);
};

const createPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

module.exports = {
  respondSuccess,
  respondError,
  createPaginationMeta
};
