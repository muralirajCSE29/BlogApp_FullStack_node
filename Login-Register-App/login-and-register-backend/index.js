import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/myLoginRegisterDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// Routes
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email }).exec();
      if (user) {
        if (password === user.password) {
          res.send({ message: "Login Successful", user: user });
        } else {
          res.send({ message: "Password didn't match" });
        }
      } else {
        res.send({ message: "User not registered" });
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.send({ message: "User already registered" });
    } else {
      const user = new User({
        name,
        email,
        password
      });
      await user.save();
      res.send({ message: "Successfully Registered, Please login now." });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(9002, () => {
  console.log("BE started at port 9002");
});
