// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

app.get("/users", (req, res) => {

  const name = req.query.name;
  const job = req.query.job;

  // if no query filters provided, return all users.
  if (!name && !job) {
    return res.send(users);
  }

  // filter users based on provided query parameters.
  const filteredUsers = users.users_list.filter((user) => {
    let valid = true;
    if (name) {
      valid = valid && user.name === name;
    }
    if (job) {
      valid = valid && user.job === job;
    }
    return valid;
  });

  res.send({ users_list: filteredUsers });
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.status(201).send();
});

// DELETE endpoint to delete a user by id
app.delete("/users/:id", (req, res) => {

  const userId = req.params.id;

  // find the index of the user in the list based on the id
  const userIndex = users["users_list"].findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found." });
  }

  // remove the user from the list using splice.
  users["users_list"].splice(userIndex, 1);
  //res.status(200).json({ message: `User with id ${userId} deleted successfully.` });
  res.status(204).send();
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});