const productService = require("../services/productService");

exports.createProduct = async (req, res) => {
  try {

    console.log("BODY =>", req.body);

    const result = await productService.createProduct(req.body);

    res.status(201).json({
      message: "Product created successfully",
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      message: error.message
    });
  }
};