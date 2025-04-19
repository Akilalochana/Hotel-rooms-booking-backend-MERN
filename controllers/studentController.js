import Student from "../models/student.js"

export function getStudents(req, res){
      Student.find().then(
            (result)=>{
                   res.status(200).json(result)
      }).catch((err)=>{
            res.status(500).json({
                  message : "Error in fetching students"
            })
      })
}

export function postStudents(req, res){
      let studentData = req.body;

      let student = new Student(studentData)

      student.save().then(()=>{
            res.json({
                  message : "Student saved successfully"
            })
      }).catch(()=>{
            res.json({
                  message : "Error in saving student"
            })
      })
}