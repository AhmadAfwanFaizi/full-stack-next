import React, { useState } from "react";
import { authPage } from "../../middlewares/authorizationPage";
import Link from "next/link";

// SSR
export async function getServerSideProps(context) {
  const auth = await authPage(context);
  if (auth.status === "auth") {
    return {
      redirect: {
        permanent: false,
        destination: "/posts",
      },
    };
  }

  return { props: {} };
}

export default function Register() {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState("normal");

  async function registerHandler(e) {
    e.preventDefault();

    setStatus("loading");

    const registerReq = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(fields),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!registerReq.ok) return setStatus("error" + registerReq.status);

    const registerRes = await registerReq.json();

    setStatus("success");
  }

  function fieldHandler(e) {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={(e) => registerHandler(e)}>
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
        <button>Register</button>

        <div>{status}</div>

        <Link href="/auth/login">
          <a href="#">Login</a>
        </Link>
      </form>
    </div>
  );
}
