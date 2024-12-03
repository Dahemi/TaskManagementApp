//import the router function from the express package
const router = require("express").Router();

//import the User model from the Models folder
const User = require("../Models/User");

const bcrypt = require("bcrypt"); //for hashing passwords
const jwt = require("jsonwebtoken"); //for creating and verifying tokens

//Sign up API
router.post("/sign-up", async (req, res) => {
  console.log("Incoming Request Body:", req.body); // Debugging line
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    } else if (username.length < 3) {
      return res
        .status(400)
        .json({ error: "Username must be at least 3 characters" });
    }

    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser
      .save()
      .then(() => {
        res.json("Sign up successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//Login API
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  //Find the user by username
  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    return res.status(404).json({ error: "User not found" });
  }

  // Compare the entered password with the stored hashed password
  const isMatch = await bcrypt.compare(password, existingUser.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate a JWT token
  const token = jwt.sign(
    { userId: existingUser._id }, // Payload
    "dswTM", // Secret key (must match the one in auth.js)
    { expiresIn: "2d" } // Token expiration (2 days)
  );

  // Respond with the token
  res.status(200).json({ id: existingUser._id, token: token });
});

module.exports = router;
