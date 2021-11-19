import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import Router from "next/router";
import { authPage } from "../../middlewares/authorizationPage";
import Link from "next/link";

// SSR
export async function getServerSideProps(context) {
  const auth = await authPage(context);
  console.log(auth);
  if (auth.status === "auth") {
    return {
      permanent: false,
      destination: "/posts",
    };
  }

  return { props: {} };
}

export default function Login() {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState("normal");

  //   cara biasa
  //   useEffect(() => {
  //     const token = Cookie.get("token");
  //     if (token) return Router.push("/posts");
  //   }, []);

  function fieldHandler(e) {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  }

  async function loginHandler(e) {
    e.preventDefault();

    const loginReq = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });

    if (!loginReq.ok) return setStatus("error" + loginReq.status);

    const loginRes = await loginReq.json();
    setStatus("success");

    Cookie.set("token", loginRes.token);

    Router.push("/posts");
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={(e) => loginHandler(e)}>
        <input
          type="email"
          name="email"
          onChange={(e) => fieldHandler(e)}
          placeholder="Email"
        />
        <br />
        <input
          type="password"
          name="password"
          onChange={(e) => fieldHandler(e)}
          placeholder="Password"
        />
        <br />
        <button>Login</button>
        <div>{status}</div>

        <Link href="/auth/register">
          <a href="#">Register</a>
        </Link>
      </form>
    </div>
  );
}
