import jwt from "jsonwebtoken";

export default function authorization(req, res) {
  return new Promise((resolve, reject) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) return res.status(401).end();

      const authSplit = authorization.split(" ");
      const [authType, authToken] = [authSplit[0], authSplit[1]];

      if (authType !== "Bearer") return res.status(401).end();

      const verify = jwt.verify(authToken, process.env.JWT_SECRET);

      resolve(verify);
    } catch (error) {
      reject(res.status(401).end());
    }
  });
}
