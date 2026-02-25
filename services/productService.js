const productRepo = require("../repositories/productRepository");
const userRepo = require("../repositories/userRepository");
const categoryRepo = require("../repositories/categoryRepository");

exports.createProduct = async (data) => {

  console.log("SERVICE DATA =>", data);

 

  const {
    category_id,
    product_name,
    listing_type,
    sell_price,
    rent_price,
    created_by
  } = data;

  if (!category_id || !product_name || !listing_type || !created_by) {
    const err = new Error("category_id, product_name, listing_type and created_by are required");
    err.status = 400;
    throw err;
  }

  if (!["sell", "rent", "both"].includes(listing_type)) {
    const err = new Error("listing_type must be sell, rent or both");
    err.status = 400;
    throw err;
  }

  if (listing_type === "sell" && !sell_price) {
    const err = new Error("sell_price is required");
    err.status = 400;
    throw err;
  }

  if (listing_type === "rent" && !rent_price) {
    const err = new Error("rent_price is required");
    err.status = 400;
    throw err;
  }

  if (listing_type === "both" && (!sell_price || !rent_price)) {
    const err = new Error("sell_price and rent_price both are required");
    err.status = 400;
    throw err;
  }

  const user = await userRepo.findUserById(created_by);
  if (user.rows.length === 0) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  const cat = await categoryRepo.findCategoryById(category_id);
  if (cat.rows.length === 0) {
    const err = new Error("Category not found");
    err.status = 404;
    throw err;
  }

  const result = await productRepo.createProduct({
    category_id,
    product_name: product_name.trim(),
    listing_type,
    sell_price: sell_price ?? null,
    rent_price: rent_price ?? null,
    created_by
  });

  return result.rows[0];
};