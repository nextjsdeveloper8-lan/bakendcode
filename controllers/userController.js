const userService = require("../services/userService");

// GET /users
exports.getUsers = async (req, res) => {
  try {
    const data = await userService.getUsers(req.body);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// POST /users
exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      message: error.message || "Failed to create user",
    });
  }
};

exports.otpSend = async (req, res) => {
  try {
    const user = await userService.otpSend(req.body);

    res.status(201).json({
      message: "Send otp successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      message: error.message || "Failed to send otp",
    });
  }
};

exports.verifyotp = async (req, res) => {
  try {
    const result = await userService.verifyotp(req.body);

    res.status(200).json({
      message: "verify otp successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
       const result = await userService.login(req.body);

    res.status(200).json({
      message: "Login successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
       const result = await userService.updateUser(req.body);

    res.status(200).json({
      message: "Update User successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

exports.address = async (req, res) => {
  try {
    const result = await userService.address(req.body);

    res.status(200).json({
      message: "address saved successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};
