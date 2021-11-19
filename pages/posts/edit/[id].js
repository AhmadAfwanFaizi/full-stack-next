import React, { useState } from "react";
import { authPage } from "../../../middlewares/authorizationPage";
import Router from "next/router";
import Nav from "../../../components/Nav";

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

  const { id } = context.query;
  const token = auth.token;

  const postReq = await fetch("http://localhost:3000/api/posts/get/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const res = await postReq.json();

  return {
    props: {
      token,
      post: res.data,
    },
  };
}

export default function PostEdit(props) {
  const { post } = props;

  const [fields, setFields] = useState({
    title: post.title,
    content: post.content,
  });

  const [status, setStatus] = useState("normal");

  async function updateHandler(e) {
    e.preventDefault();

    setStatus("loading");

    const { token } = props;

    const update = await fetch("/api/posts/update/" + post.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(fields),
    });

    if (!update.ok) return setStatus("error");

    const res = await update.json();

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
      <h1>Update a Post</h1>

      <form onSubmit={(e) => updateHandler(e)}>
        <input
          type="text"
          name="title"
          value={fields.title}
          onChange={(e) => inputHandler(e)}
          placeholder="Title"
        />
        <br />
        <textarea
          name="content"
          value={fields.content}
          onChange={(e) => inputHandler(e)}
          rows="10"
        ></textarea>
        <br />
        <button>Save Change</button>
        <div>status : {status}</div>
      </form>
    </div>
  );
}
