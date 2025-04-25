// backend.js
import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.get("/users", (req, res) => {
  const { name, job } = req.query;
  userService.getUsers(name, job)
    .then((users) => {
      res.json({ users_list: users });
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "An error occurred while fetching users." });
    });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  userService.findUserById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send("Resource not found.");
      }
      res.json(user);
    })
    .catch((error) => {
      console.error("Error fetching user by id:", error);
      res.status(500).json({ error: "An error occurred while fetching the user." });
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  // generate a random id for the user using Math.random().
  // this generates a base-36 string (0-9, a-z).
  userToAdd.id = Math.random().toString(36).substr(2, 6);
  
  userService.addUser(userToAdd)
    .then((addedUser) => {
      res.status(201).json(addedUser);
    })
    .catch((error) => {
      console.error("Error adding new user:", error);
      res.status(500).json({ error: "An error occurred while adding the user." });
    });
});

// DELETE /users/:id - delete a user by id.
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  
  // check if deleteUser function exists in the service layer.
  if (typeof userService.deleteUser !== "function") {
    return res.status(501).json({ error: "Delete operation is not supported." });
  }
  
  userService.deleteUser(id)
    .then((deletionResult) => {
      if (deletionResult.deletedCount === 0) {
        return res.status(404).json({ error: "User not found." });
      }
      res.status(204).send();
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "An error occurred while deleting the user." });
    });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

