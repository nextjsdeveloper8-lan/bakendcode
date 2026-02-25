require("dotenv").config();

const express = require("express");
const userRouter = require("./routes/userRouter");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const imgRoutes = require("./routes/imgRoutes");
const auth = require("./middlewares/auth");

const app = express();

app.use(express.json());

app.use("/api", userRouter);
app.use("/api", auth,categoryRoutes);
app.use("/api",auth, productRoutes);
app.use("/api",auth, imgRoutes);



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
