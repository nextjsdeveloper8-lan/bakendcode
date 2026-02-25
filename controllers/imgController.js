
const productService = require("../services/imgService");

exports.createimg = async (req, res) => {
  try {

    const result = await productService.createimg(req.body);

    res.status(201).json({
      message: "Img add successfully",
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      message: error.message
    });
  }
};