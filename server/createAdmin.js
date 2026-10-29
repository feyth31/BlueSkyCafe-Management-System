
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
require("dotenv").config();

const User = require("./models/User");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    rl.question("Enter Administrator full name: ", async (fullName) => {
      rl.question("Enter Administrator username: ", async (username) => {
        rl.question("Enter Administrator password: ", async (password) => {
          try {
            const existingUser = await User.findOne({ username });

            if (existingUser) {
              console.log("This username already exists. Choose another one.");
              return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const admin = new User({
              fullName,
              username,
              password: hashedPassword,
              role: "Administrator",
            });

            await admin.save();

            console.log("Administrator account created successfully!");
            console.log("Username:", username);
          } catch (error) {
            console.error("Error creating Administrator:", error.message);
          } finally {
            await mongoose.disconnect();
            rl.close();
          }
        });
      });
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    rl.close();
  }
}

createAdmin();
