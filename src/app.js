const express = require("express");
const { connectToDb } = require("./config/DataBase");
const { userRouter } = require("./router/userRoute");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require('dotenv')

dotenv.config()

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Tumhara frontend origin
    credentials: true,
  })
);

app.use("/user", userRouter);

connectToDb()
  .then(() => console.log("Connect To DataBase Successfully!"))
  .catch((error) => console.log("Something Wrong To Connect Db " + error));

app.listen(process.env.PORT, (req, res) => {
  console.log("Server Started on Port 3000 !!");
  console.log("http://localhost:3000");
});
