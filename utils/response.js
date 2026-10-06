function success(res, status, data, message = "Success") {
  return res.status(status).json({ status, data, error: null, message });
}

function failure(res, status, error, field = null) {
  return res.status(status).json({ status, data: null, error, field, message: error });
}

module.exports = { success, failure };
