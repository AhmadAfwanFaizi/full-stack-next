import Link from "next/link";
import Cookie from "js-cookie";
import Router from "next/router";

export default function Nav() {
  function logoutHandler() {
    Cookie.remove("token");

    Router.replace("/auth/login");
  }
  return (
    <>
      <ul>
        <li>
          <Link href="/posts">Posts</Link>
        </li>
        <li>
          <Link href="/posts/create">create</Link>
        </li>
        <li>
          <a href="#" onClick={logoutHandler}>
            Logout
          </a>
        </li>
      </ul>
    </>
  );
}
