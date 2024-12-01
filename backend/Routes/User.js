//import the router function from the express package
const router = require("express").Router();

//import the User model from the Models folder
const User = require("../Models/User");

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

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser
      .save()
      .then(() => {
        res.json("Sign in successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
