// import ErrorHandler from "../utils/errorHandler";
import { NextRequest } from "next/server";

const ErrorHandler = require("../utils/errorHandler");

module.exports = errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  //Wrong jwt error
  if (err.name == "JsonWebTokenError") {
    const message = `Json web token is invalid try again`;
    err = new ErrorHandler(message, 400);
  }
  //JWT Expire Error

  if (err.name == "TokenExpireError") {
    const message = `Json web token is Expired, try again`;
    err = new ErrorHandler(message, 400);
  }
  //mongodb wrong id error

  if (err.name == "CastError") {
    const message = `Resource not Found, invakud:${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // error:err.stack for full information,
  });
};
