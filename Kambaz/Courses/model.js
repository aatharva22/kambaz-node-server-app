import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("CourseModel", schema); // CourseModel is a unique name which can be used to refer to this model elsewhere(from other schemas)
export default model;