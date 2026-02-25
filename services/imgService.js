const productImageRepo = require("../repositories/productImageRepo");

exports.createimg = async (payload) => {

  const { product_id } = payload;

  if (!product_id) {
    const err = new Error("product_id is required");
    err.status = 400;
    throw err;
  }

  const result = await productImageRepo.createProductImage(payload);

  return result.rows[0];
};