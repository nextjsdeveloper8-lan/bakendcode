const pool = require("../config/db");

exports.findUsers = async ({ whereClause, values, limit, offset, index }) => {
  const query = `
    SELECT id, username, email, role, is_active, created_at, updated_at
    FROM users
    ${whereClause}
    ORDER BY id ASC
    LIMIT $${index++}
    OFFSET $${index++}
  `;

  return pool.query(query, [...values, limit, offset]);
};

exports.countUsers = async () => {
  return pool.query(`SELECT COUNT(*) AS total FROM users`);
};

exports.findUserByEmail = async (email) => {
  return pool.query("SELECT id FROM users WHERE email = $1", [email]);
};
exports.findUserById = async (id) => {
  return pool.query("SELECT id FROM users WHERE id = $1", [id]);
};

exports.createUser = async (payload) => {
  const { username, email, passwordHash, role, is_active } = payload;

  return pool.query(
    `INSERT INTO users
     (username, email, password_hash, role, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, username, email, role, is_active, created_at, updated_at`,
    [username, email, passwordHash, role, is_active],
  );
};

exports.saveUserOtp = async ({ email, otp, expiresAt }) => {
  return pool.query(
    `
      INSERT INTO otptable (email, otp, otp_expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET
        otp = EXCLUDED.otp,
        otp_expires_at = EXCLUDED.otp_expires_at
    `,
    [email, otp, expiresAt],
  );
};

exports.findUserOtp = async (normalizedEmail) => {
  return pool.query(
    `
    SELECT email, otp, otp_expires_at
    FROM otptable
    WHERE email = $1
    ORDER BY otp_expires_at DESC
    LIMIT 1
    `,
    [normalizedEmail],
  );
};

// userRepo.js
exports.upsertUserAddress = (data) => {
  const query = `
    INSERT INTO user_address (
      user_id,
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (user_id)
    DO UPDATE SET
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      address_line1 = EXCLUDED.address_line1,
      address_line2 = EXCLUDED.address_line2,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      postal_code = EXCLUDED.postal_code,
      country = EXCLUDED.country,
      updated_at = now()
    RETURNING *;
  `;

  const values = [
    data.user_id,
    data.full_name,
    data.phone,
    data.address_line1,
    data.address_line2,
    data.city,
    data.state,
    data.postal_code,
    data.country,
  ];

  return pool.query(query, values);
};

exports.findUser = (email) => {
  return pool.query(
    `
    SELECT
      id,
      email,
      password_hash
    FROM users
    WHERE email = $1
    `,
    [email]
  );
};
