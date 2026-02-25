const pool = require("../config/db");

exports.createProduct = async (data) => {

  const query = `
    INSERT INTO products
    (
      category_id,
      product_name,
      listing_type,
      sell_price,
      rent_price,
      created_by
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *;
  `;

  const values = [
    data.category_id,
    data.product_name,
    data.listing_type,
    data.sell_price,
    data.rent_price,
    data.created_by
  ];

  return pool.query(query, values);
};