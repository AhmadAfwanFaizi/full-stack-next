import React, { useState } from "react";
import { authPage } from "../../middlewares/authorizationPage";
import Router from "next/router";
import Nav from "../../components/Nav";

// SSR
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
  const postReq = await fetch("http://localhost:3000/api/posts", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const posts = await postReq.json();

  return {
    props: {
      token,
      posts: posts.data,
    },
  };
}

export default function PostIndex(props) {
  const [posts, setPosts] = useState(props.posts);

  async function deleteHandler(id) {
    const { token } = props;

    const conf = confirm("Are you sure want to delete?");
    if (conf) {
      const deletePost = await fetch(
        `http://localhost:3000/api/posts/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const res = await deletePost.json();
      const postFiltered = posts.filter((post) => {
        return post.id !== id && post;
      });

      setPosts(postFiltered);
    }
  }

  function editHandler(id) {
    Router.push("/posts/edit/" + id);
  }

  return (
    <div>
      <Nav />
      <h1>Posts</h1>

      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((value) => (
            <tr key={value.id}>
              <td>{value.title}</td>
              <td>{value.content}</td>
              <td>
                <button onClick={() => editHandler(value.id)}>Edit</button>
                <button onClick={() => deleteHandler(value.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
