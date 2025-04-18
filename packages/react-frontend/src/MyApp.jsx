// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {

  const [characters, setCharacters] = useState([]);

  /*"Character" means "entry" here, and not an alphanumeric "character".*/
  function removeOneCharacter(index) {

    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }

  function updateList(person) {
    setCharacters([...characters, person]);
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

 function postUser(person) {
  const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });

    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          // Parse the backend's response body to get the newly created user object
          return response.json();
        } else {
          console.error(`User not added. Received status: ${response.status}`);
          throw new Error("Failed to add user");
        }
      })
      .then((newUser) => {
        // Update the table with the new user from the backend (which includes the generated id)
        setCharacters((prevCharacters) => [...prevCharacters, newUser]);
      })
      .catch((error) => {
        console.error("Error posting user:", error);
      });
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
      />
    <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;