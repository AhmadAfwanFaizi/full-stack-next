import cookies from "next-cookies";

// export function unAuthPage(ctx) {
//   return new Promise((resolve, reject) => {
//     const allCookies = cookies(ctx);
//     // console.log(allCookies.token);
//     if (allCookies.token) {
//       return {
//         redirect: {
//           permanent: false,
//           destination: "/posts",
//         },
//       };
//     }

//     return resolve(true);
//     // return resolve("unauth");

//     // if (allCookies.token) {
//     //   resolve("auth");
//     // }
//   });
// }

export function authPage(ctx) {
  return new Promise((resolve, reject) => {
    try {
      const allCookies = cookies(ctx);

      if (allCookies.token) {
        resolve({
          status: "auth",
          token: allCookies.token,
        });
      } else {
        resolve({
          status: "unauth",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}
