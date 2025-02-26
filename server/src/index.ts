import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// ROUTES IMPORTS
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";

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
app.use("/dashboard", dashboardRoutes) // http://localhost:8000/dashboard
app.use("/products", productRoutes)
app.use("/users", userRoutes)
app.use("/expenses", expenseRoutes);


// SERVER
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})