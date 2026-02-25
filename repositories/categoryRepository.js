const pool = require("../config/db");

exports.createCategory = async ({ name, is_active }) => {
  return pool.query(
    `
    INSERT INTO categories (name, is_active)
    VALUES ($1, $2)
    RETURNING id, name, is_active, created_at
    `,
    [name, is_active]
  );
};

exports.findCategoryByName = async (name) => {
  return pool.query(
    `SELECT id FROM categories WHERE name = $1`,
    [name]
  );
};



exports.createCategory = async ({ name, is_active }) => {
  return pool.query(
    `
    INSERT INTO categories (name, is_active)
    VALUES ($1, $2)
    RETURNING id, name, is_active, created_at
    `,
    [name, is_active]
  );
};

exports.findCategoryByName = async (name) => {
  return pool.query(
    `SELECT id FROM categories WHERE name = $1`,
    [name]
  );
};

// ✅ ADD THIS
exports.findCategoryById = async (id) => {
  return pool.query(
    `SELECT id FROM categories WHERE id = $1`,
    [id]
  );
};