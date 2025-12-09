import express from "express"
import Hello from "./hello.js";
import Lab5 from "./Lab5/index.js";
import PathParameters from "./Lab5/PathParameters.js";
import QueryParameters from "./Lab5/QueryParameters.js";
import WorkingWithObjects from "./Lab5/WorkingWithObjects.js";
import WorkingWithArrays from "./Lab5/WorkingWithArrays.js";
import cors from "cors";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import "dotenv/config";
import session from "express-session";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import modulesRoutes from "./Kambaz/Modules/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import mongoose from "mongoose";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING ||"mongodb://127.0.0.1:27017/kambaz"
// const CONNECTION_STRING = "mongodb+srv://atharvaboston10:CS5610@kambaz.1a03rej.mongodb.net/?appName=Kambaz"
mongoose.connect(CONNECTION_STRING);
const app = express(); // Create an instance of express application
app.use(cors(
    {
        credentials: true,
        origin: process.env.CLIENT_URL || "http://localhost:3000",
    }
)); // Enable CORS for cross-origin requests

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
}; // Session configuration
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}// Adjust session settings for production environment
app.use(session(sessionOptions));
app.use(express.json());

app.use(express.json()); //TO enable parsing of JSON body content
UserRoutes(app, db); // Configure User routes with the app and db

Hello(app);
Lab5(app);
PathParameters(app);
QueryParameters(app);
WorkingWithObjects(app);
WorkingWithArrays(app);
CourseRoutes(app, db); // Configure Course routes with the app and db
modulesRoutes(app, db); // Configure Module routes with the app and db
EnrollmentsRoutes(app, db); // Configure Enrollment routes with the app and db
AssignmentsRoutes(app, db); // Configure Assignment routes with the app and db
app.listen(process.env.PORT || 4000);