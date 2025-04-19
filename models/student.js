import mongoose from "mongoose";

let studentSchema = mongoose .Schema({
      name : String,
      age:Number,
      height : Number
})
let Student = mongoose.model("Students",studentSchema);

export default Student;
