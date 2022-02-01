module.exports = (error, _req, res) => {
  if (error.message) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  return res.status(500).json({ message: 'Internal Server Error' });
};
