import jwt from "jsonwebtoken";

export default function jwtGenerator(email) {
  //   const jwt = jsonwebtoken();s
  const token = jwt.sign({ email }, process.env.JSON_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
}
