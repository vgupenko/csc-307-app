// src/MyApp.jsx
import React, { useState } from "react";
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