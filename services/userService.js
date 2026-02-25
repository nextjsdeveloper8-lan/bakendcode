const bcrypt = require("bcrypt");
const userRepo = require("../repositories/userRepository");
const { sendMail } = require("../utils/mailer");

const jwt = require("jsonwebtoken");
const { htmlTemplate } = require("../utils/otptemplate js");

exports.getUsers = async ({ filters, page = 1, limit = 10 }) => {
  const whereParts = [];
  const values = [];
  let index = 1;

  if (
    filters &&
    typeof filters === "object" &&
    typeof filters.search === "string" &&
    filters.search.trim() !== ""
  ) {
    values.push(`%${filters.search.trim()}%`);

    whereParts.push(`
      (
        username ILIKE $${index}
        OR email ILIKE $${index}
      )
    `);

    index++;
  }

  const whereClause = whereParts.length
    ? `WHERE ${whereParts.join(" AND ")}`
    : "";

  const safeLimit = Math.max(parseInt(limit, 10) || 10, 1);
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const offset = (safePage - 1) * safeLimit;

  const [usersResult, countResult] = await Promise.all([
    userRepo.findUsers({
      whereClause,
      values,
      limit: safeLimit,
      offset,
      index,
    }),
    userRepo.countUsers(),
  ]);

  return {
    totalRecord: Number(countResult.rows[0].total),
    page: safePage,
    limit: safeLimit,
    users: usersResult.rows,
  };
};

exports.createUser = async (data) => {
  const { username, email, password, role, is_active, verified } = data;

  if (!verified) {
    const err = new Error("Please verify your email before creating account");
    err.status = 403;
    throw err;
  }

  if (!username || !email || !password) {
    const err = new Error("username, email and password are required");
    err.status = 400;
    throw err;
  }

  const existingUser = await userRepo.findUserByEmail(email);

  if (existingUser.rows.length > 0) {
    const err = new Error("Email already exists");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await userRepo.createUser({
    username,
    email,
    passwordHash,
    role: role || "user",
    is_active: is_active ?? true,
  });

  return result.rows[0];
};

exports.otpSend = async (data) => {
  const { email } = data;

  if (!email) {
    const err = new Error("Email is required");
    err.status = 400;
    throw err;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // ✅ check user exists
  const existingUser = await userRepo.findUserByEmail(normalizedEmail);

  if (!existingUser.rows.length === 0) {
    const err = new Error("Email does not exist");
    err.status = 404;
    throw err;
  }

  // ✅ always 6 digit OTP
  // const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otp =123456;

  // ✅ 1 hour expiry
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // ✅ save with normalized email
  await userRepo.saveUserOtp({
    email: normalizedEmail,
    otp,
    expiresAt,
  });

  const html = htmlTemplate.replace("{{OTP}}", otp);

  await sendMail({
    to: normalizedEmail,
    subject: "Your OTP",
    html,
  });

  return {
    message: "OTP sent successfully",
  };
};

exports.verifyotp = async (data) => {
  let { email, otp } = data;

  if (!email || !otp) {
    const err = new Error("Email and OTP are required");
    err.status = 400;
    throw err;
  }

  const normalizedEmail = email.trim().toLowerCase();
  otp = String(otp).trim();

  console.log("email, otp", normalizedEmail, otp);

  const result = await userRepo.findUserOtp(normalizedEmail);

  if (result.rows.length === 0) {
    const err = new Error("OTP not found");
    err.status = 400;
    throw err;
  }

  const record = result.rows[0];

  // ✅ OTP compare (Node side)
  if (String(record.otp).trim() !== otp) {
    const err = new Error("Invalid OTP");
    err.status = 400;
    throw err;
  }

  // ✅ expiry check (correct column)
  if (new Date(record.otp_expires_at) < new Date()) {
    const err = new Error("OTP has expired");
    err.status = 400;
    throw err;
  }

  // ✅ delete after success
  // await userRepo.deleteUserOtp(normalizedEmail);

  return {
    message: "OTP verified successfully",
    verified: true,
  };
};

exports.login = async (data) => {
  const { email, password } = data;

  const normalizedEmail = email.trim().toLowerCase();

  const userResult = await userRepo.findUser(normalizedEmail);

  if (userResult.rows.length === 0) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const user = userResult.rows[0];
  console.log("email, password", email, password);
  console.log("DB password_hash =", user.password_hash);

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return {
    id: user.id,
    email: user.email,
    img: user.img,
    token,
  };
};
exports.updateUser = async (data) => {};
exports.address = async (data) => {
  const {
    user_id,
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
  } = data;

  if (!user_id) {
    const err = new Error("User id is required");
    err.status = 400;
    throw err;
  }

  // ✅ check user exists
  const existingUser = await userRepo.findUserById(user_id);

  if (existingUser.rows.length === 0) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  if (!address_line1 || !city || !postal_code || !country) {
    const err = new Error(
      "Address line1, city, postal code and country are required",
    );
    err.status = 400;
    throw err;
  }

  const payload = {
    user_id,
    full_name: full_name?.trim() || null,
    phone: phone?.trim() || null,
    address_line1: address_line1.trim(),
    address_line2: address_line2?.trim() || null,
    city: city.trim(),
    state: state?.trim() || null,
    postal_code: postal_code.trim(),
    country: country.trim(),
  };

  // upsert (insert or update – only one address per user)
  const result = await userRepo.upsertUserAddress(payload);

  return {
    message: "Address saved successfully",
    address: result.rows[0],
  };
};
