const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profilePics");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/profilePics", express.static("profilePics"));

let studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  mobileNo: String,
  profilePic: String,
});

let Student = new mongoose.model("student", studentSchema);

app.post("/validateToken", upload.none(), async (req, res) => {
  console.log(req.body);

  try {
    let decryptedToken = jwt.verify(req.body.token, "lalala");

    let userDetails = await Student.find().and({ email: decryptedToken.email });

    if (userDetails.length > 0) {
      console.log(userDetails);

      if (userDetails[0].password == decryptedToken.password) {
        let loggedInUserDetails = {
          firstName: userDetails[0].firstName,
          lastName: userDetails[0].lastName,
          age: userDetails[0].age,
          email: userDetails[0].email,
          profilePic: userDetails[0].profilePic,
        };

        res.json({ status: "success", data: loggedInUserDetails });
      } else {
        res.json({ status: "failure", msg: "Invalid Password" });
      }
    } else {
      res.json({ status: "failure", msg: "User doesnot exist" });
    }
  } catch (err) {
    res.json({ status: "failure", msg: "Invalid Token" });
  }
});

app.post("/signin", upload.none(), async (req, res) => {
  console.log(req.body);

  let userDetails = await Student.find().and({ email: req.body.email });

  if (userDetails.length > 0) {
    console.log(userDetails);

    let isPasswordValid = await bcrypt.compare(
      req.body.password,
      userDetails[0].password
    );

    if (isPasswordValid == true) {
      let token = jwt.sign(
        {
          email: req.body.email,
          password: req.body.password,
        },
        "lalala"
      );

      let loggedInUserDetails = {
        firstName: userDetails[0].firstName,
        lastName: userDetails[0].lastName,
        age: userDetails[0].age,
        email: userDetails[0].email,
        mobileNo: userDetails[0].mobileNo,
        profilePic: userDetails[0].profilePic,
        token: token,
      };

      res.json({ status: "success", data: loggedInUserDetails });
    } else {
      res.json({ status: "failure", msg: "Invalid Password" });
    }
  } else {
    res.json({ status: "failure", msg: "User doesnot exist" });
  }
});

app.post("/signup", upload.single("profilePic"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  try {
    let userDetails = await Student.find().and({ email: req.body.email });

    if (userDetails.length > 0) {
      res.json({ status: "failure", msg: "User already exists." });
    } else {
      let hashedPassword = await bcrypt.hash(req.body.password, 10);

      console.log(hashedPassword);

      let newStudent = new Student({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        email: req.body.email,
        password: hashedPassword,
        mobileNo: req.body.mobileNo,
        profilePic: req.file.path,
      });

      await Student.insertMany([newStudent]);
      res.json({ status: "success", msg: "User created successfully." });
    }
  } catch (err) {
    res.json({ status: "failure", msg: "Unable to create user" });
  }
});

app.put("/updateProfile", upload.single("profilePic"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  try {
    if (req.body.firstName.trim().length > 0) {
      await Student.updateMany(
        { email: req.body.email },
        { firstName: req.body.firstName }
      );
    }

    if (req.body.lastName.trim().length > 0) {
      await Student.updateMany(
        { email: req.body.email },
        { lastName: req.body.lastName }
      );
    }

    if (req.body.age.trim().length > 0) {
      await Student.updateMany(
        { email: req.body.email },
        { age: req.body.age }
      );
    }

    if (req.body.password.length > 0) {
      await Student.updateMany(
        { email: req.body.email },
        { password: req.body.password }
      );
    }

    if (req.body.mobileNo.trim().length > 0) {
      await Student.updateMany(
        { email: req.body.email },
        { mobileNo: req.body.mobileNo }
      );
    }

    if (req.file && req.file.path.length > 0) {
      await Student.updateMany(
        { email: req.body.email },
        { profilePic: req.file.path }
      );
    }

    res.json({ status: "success", msg: "Profile updated successfully" });
  } catch (err) {
    res.json({ status: "failure", msg: "Something went wrong." });
  }
});

app.delete("/deleteProfile", upload.none(), async (req, res) => {
  console.log(req.body);

  try {
    let deleteResponse = await Student.deleteMany({ email: req.body.email });
    console.log(deleteResponse);

    res.json({ status: "success", msg: "User profile deleted successfully." });
  } catch (err) {
    res.json({ status: "failure", msg: "Unable to delete profile." });
  }
});

app.listen(process.env.port, () => {
  console.log(`Listening to port ${process.env.port}`);
});

let connectToMDB = async () => {
  try {
    await mongoose.connect(process.env.mdburl);

    console.log("Connected to MDB");
  } catch (err) {
    console.log("Unable to connect to MDB");
  }
};

connectToMDB();
