const express = require("express");
const { User } = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/tokenAtuh");
const dotenv = require('dotenv')

dotenv.config()

const userRouter = express.Router();

userRouter.get("/getAll", verifyToken,async (req, res) => {
  try {
    
    const user = await User.find({});
    res.send("Get All Successfully !" + user);
  } catch (error) {
    console.log("Error Something Wrong " + error.code);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.send("User Not Found !");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send("Password Not Match !");
    }
    const token = jwt.sign({ email: email }, process.env.KEY, { expiresIn: "1d" });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 30000),
    });
    res.send({
      message:"Login Successfully Welcome !",
      data:{
        name:user.name,
        email:user.email
      }
    });
  } catch (error) {
    console.log("Error Something Wrong " + error.code);
  }
});

userRouter.post('/logout',async(req,res)=>{
  res.cookie("token",null,{
    expires:new Date(Date.now()*0),
  })
  res.send("LogOut Successfully!!")
  console.log("Bas Ustad Hogaya LogOut !");
  
})

userRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.send("Invalid Email !");
    } else if (!validator.isStrongPassword(password)) {
      return res.send("Type a Strong password !");
    }
    const hash = await bcrypt.hash(password, 10);
    console.log(hash);

    const user = await new User({ name, email, password: hash });
    user.save();

    const token = jwt.sign({ id: user._id }, process.env.KEY , { expiresIn: "10m" });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 5000),
    });

    res.send("Added To Db User Done ! " + user);
  } catch (error) {
    console.log("Error Something Wrong " + error.code);
  }
});

userRouter.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const user = await User.deleteOne({ _id: id });
    console.log(user);
    res.send("Deleted Successfully ! ");
  } catch (error) {
    console.log("Error Something Wrong " + error.code);
  }
});

userRouter.patch("/update", async (req, res) => {
  try {
    const { id, name, email, password } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { name: name, email: email, password: password },
      { new: true }
    );
    res.send("Updated Successfully ! " + user);
  } catch (error) {
    console.log("Error Something Wrong " + error.code);
  }
});

module.exports = {
  userRouter,
};
