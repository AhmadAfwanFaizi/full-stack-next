import React, { useState } from "react";
import { authPage } from "../../middlewares/authorizationPage";
import Router from "next/router";
import Nav from "../../components/Nav";

export async function getServerSideProps(context) {
  const auth = await authPage(context);
  if (auth.status === "unauth") {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }

  const token = auth.token;

  return {
    props: {
      token,
    },
  };
}

export default function PostCreate(props) {
  const [fields, setFields] = useState({
    title: "",
    content: "",
  });

  const [status, setStatus] = useState("normal");

  async function submitHandler(e) {
    e.preventDefault();

    setStatus("loading");

    const { token } = props;

    const create = await fetch("/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(fields),
    });

    if (!create.ok) return setStatus("error");

    const res = await create.json();

    setStatus("success");
    Router.push("/posts");
  }

  function inputHandler(e) {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div>
      <Nav />
      <h1>Create a Post</h1>

      <form onSubmit={(e) => submitHandler(e)}>
        <input
          type="text"
          name="title"
          onChange={(e) => inputHandler(e)}
          placeholder="Title"
        />
        <br />
        <textarea
          name="content"
          onChange={(e) => inputHandler(e)}
          rows="10"
        ></textarea>
        <br />
        <button>Add</button>
        <div>status : {status}</div>
      </form>
    </div>
  );
}
