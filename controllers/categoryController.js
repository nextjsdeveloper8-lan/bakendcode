const categoryService = require("../services/categoryService");

exports.createCategory = async (req, res) => {
  try {
    const result = await categoryService.createCategory(req.body);

    res.status(201).json({
      message: "Category created successfully",
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      message: error.message
    });
  }
};