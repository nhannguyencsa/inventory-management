import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// ROUTES IMPORTS

// CONFIGURATIONS
dotenv.config();
const app = express();
app.use(express.json());//Without express.json(), Express can't parse JSON data from the client, so can't access it in req.body.
app.use(helmet());//middleware adds security headers 
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));//it permits cross-origin access to the resources
app.use(morgan("common")); //dev combined common short tiny
app.use(bodyParser.json());//Parse the JSON data in the request body and convert it into a JavaScript object in req.body
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());//Allow all origins (domains) to send requests to your server without being blocked by the browser.

// ROUTES
app.get("/hello", (req, res) => {
  res.send("hello world")
})

// SERVER
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})