const categoryRepo = require("../repositories/categoryRepository");

exports.createCategory = async (data) => {

  let { name, is_active } = data;

  if (!name) {
    const err = new Error("Category name is required");
    err.status = 400;
    throw err;
  }

  name = name.trim();

  const existing = await categoryRepo.findCategoryByName(name);

  if (existing.rows.length > 0) {
    const err = new Error("Category already exists");
    err.status = 409;
    throw err;
  }

  const result = await categoryRepo.createCategory({
    name,
    is_active: is_active ?? true
  });

  return result.rows[0];
};