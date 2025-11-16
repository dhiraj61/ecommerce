const userProductController = async (req, res) => {
  res.status(200).json({
    message: req.user,
  });
};

const sellerProductController = async (req, res) => {
  res.status(200).json({
    message: req.seller,
  });
};

module.exports = { userProductController, sellerProductController };