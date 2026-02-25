const pool = require("../config/db");

exports.createProductImage = async ({ product_id, image_url, is_primary }) => {
  return pool.query(
    `
    INSERT INTO product_images (product_id, image_url, is_primary)
    VALUES ($1, $2, $3)
    RETURNING id, product_id, image_url, is_primary, created_at
    `,
    [product_id, image_url, is_primary ?? false]
  );
};