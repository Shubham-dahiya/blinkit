// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const {uploadImageToCloudinary} = require("../utils/imageUploader");

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({
//       msg: "Bad request. Please add email and password in the request body",
//     });
//   }

//   let foundUser = await User.findOne({ email: req.body.email });
//   if (foundUser) {
//     const isMatch = await foundUser.comparePassword(password);

//     if (isMatch) {
//       const token = jwt.sign(
//         { id: foundUser._id, name: foundUser.name },
//         process.env.JWT_SECRET,
//         {
//           expiresIn: "30h",
//         }
//       );

//       return res.status(200).json({ msg: "user logged in", token });
//     } else {
//       return res.status(400).json({ msg: "Bad password" });
//     }
//   } else {
//     return res.status(400).json({ msg: "Bad credentails" });
//   }
// };

// const dashboard = async (req, res) => {
//   const luckyNumber = Math.floor(Math.random() * 100);
//   const userId = req.user.id;

//   res.status(200).json({
//     msg: `Hello, ${req.user.name}`,
//     secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
//   });

//   const image = req.files.image

//   const imageUpload= await uploadImageToCloudinary(
//     image,
//     process.env.FOLDER_NAME
//   )
//   const userinfo = await User.findById(userId);
//   if (!userinfo) {
//     return res.status(404).json({
//       success: false,
//       message: "user Details Not Found",
//     })
//   }
//   await User.findByIdAndUpdate(
//     {
//       _id: userId,
//     },
//     {
//       $push: {
//         images: imageUpload.secure_url,
//       },
//     },
//     { new: true }
//   )
// };

// const getAllUsers = async (req, res) => {
//   let users = await User.find({});

//   return res.status(200).json({ users });
// };

// const register = async (req, res) => {
//   let foundUser = await User.findOne({ email: req.body.email });
//   if (foundUser === null) {
//     let { username, email, password } = req.body;
//     if (username.length && email.length && password.length) {
//       const person = new User({
//         name: username,
//         email: email,
//         password: password,
//       });
//       await person.save();
//       return res.status(201).json({ person });
//     }else{
//         return res.status(400).json({msg: "Please add all values in the request body"});
//     }
//   } else {
//     return res.status(400).json({ msg: "Email already in use" });
//   }
// };

// module.exports = {
//   login,
//   register,
//   dashboard,
//   getAllUsers,
// };
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }

  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(400).json({ msg: "Bad credentials" });
    }

    const isMatch = await foundUser.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Bad password" });
    }

    const token = jwt.sign(
      { id: foundUser._id, name: foundUser.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "30h",
      }
    );

    res.status(200).json({ msg: "User logged in", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const dashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Send initial response
    res.status(200).json({
      msg: `Hello, ${req.user.name}`,
      secret: 'Welcome to Blinkit ',
    });

    // Check if image was uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const image = req.files.image;

    // Upload image to Cloudinary
    const imageUpload = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);

    // Find user by ID
    const userinfo = await User.findById(userId);
    if (!userinfo) {
      return res.status(404).json({
        success: false,
        message: "User details not found",
      });
    }

    // Update user's images array with the uploaded image URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { images: imageUpload.secure_url } },
      { new: true }
    );

    // Send success response with updated user details
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    let users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    // Check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Please add all values in the request body" });
    }

    // Create new user
    const newUser = new User({
      name: username,
      email,
      password,
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  login,
  register,
  dashboard,
  getAllUsers,
};
