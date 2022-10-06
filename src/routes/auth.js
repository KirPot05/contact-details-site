import { Router } from "express";
import { body, validationResult } from "express-validator";
import { failed_response, success_response } from "../utils/response.js";
import {
  encryptPassword,
  isCorrectPassword,
  getAuthToken,
} from "../utils/passwordUtil.js";
import User from "../models/user.js";

const router = Router();

router.get("/", (req, res) => {
  let heading = "";
  let isRegister = false;
  if (req.query.op === "login") {
    heading = "Login";
  } else {
    heading = "Register";
    isRegister = true;
  }

  res.render("authForm", {
    heading,
    isRegister,
  });
});

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],

  async (req, res) => {
    // Validation results error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(failed_response(500, "Something went wrong", errors.array()));
    }

    try {
      const { email, password } = req.body;
      let userData;

      if (email !== null && email !== "") {
        userData = await User.findOne({ email: email });
      }
      if (userData == null) {
        return res.status(500).json(failed_response(500, "User not found"));
      }

      // Compares hashed password in DB and entered password
      const passwordMatches = await isCorrectPassword(
        password,
        userData.password
      );
      console.log(userData);
      if (!passwordMatches) {
        return res
          .status(500)
          .json({ error: "Please enter valid credentials" });
      }

      // Returns Logged in user's id
      const data = {
        id: userData.id,
      };

      // Signs and generates an authentication token
      const authToken = await getAuthToken(data);

      // Passing created user's data {authenticated token} as response
      res.json(success_response(200, "Login successful", authToken));
    } catch (error) {
      console.error(error.message);
      res.status(500).json(failed_response(500, "Internal Server Error"));
    }
  }
);

router.post(
  "/create",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],

  async (req, res) => {
    // Validation results error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(failed_response(500, "Something went wrong", errors.array()));
    }

    try {
      let userData;

      // DB operation to find user
      userData = await User.find({ email: req.body.email });
      if (userData.length > 0) {
        return res.json(failed_response(400, "User already exists"));
      }

      const { name, email, password } = req.body;
      const secPassword = await encryptPassword(password);
      userData = {
        name,
        email,
        password: secPassword,
      };

      // DB operation to create user
      const user = await User.create(userData);
      const data = {
        id: user.id,
      };

      const authToken = await getAuthToken(data);
      res.json(success_response(200, "Registration successful", authToken));
    } catch (error) {
      console.error(error.message);
      return res.json(failed_response(500, "Internal server error"));
    }
  }
);

export default router;
