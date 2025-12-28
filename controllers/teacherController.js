const Teacher = require('../models/Teacher')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// REGISTER
const createTeacher = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body

    const existingTeacher = await Teacher.findOne({ email })
    if (existingTeacher) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const teacher = new Teacher({
      username,
      email,
      password: hashedPassword,
      phone
    })

    await teacher.save()

    res.status(201).json({
      message: "Registered Successfully"
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

// LOGIN
const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body

    const teacher = await Teacher.findOne({ email })
    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found' })
    }

    const isMatch = await bcrypt.compare(password, teacher.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    const payload = {
      user: {
        id: teacher.id
      }
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30m' },
      (err, token) => {
        if (err) throw err
        res.status(200).json({ message: 'Login successful', token })
      }
    )
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

// PROFILE
const profileTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select('-password')

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" })
    }

    res.status(200).json(teacher)
  } catch (error) {
    console.error("Profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
}


//single teacher details
const SingleTeacher = async (req,res)=>{
    try{
        const teacher = await Teacher.findById(req.params.id)
        if(!teacher){
            return res.status(404).json({message:"teacher not found"})
        }
        res.status(200).json(teacher)

    }catch(error){
        console.log("error is an error",error)
        res.status(500).json({message:"server error"})
    }


}
// update teacher details
const updateTeacher = async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    const existingTeacher = await Teacher.findOne({
      email,
      _id: { $ne: req.params.id } 
    });

    if (existingTeacher) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { username, email, phone },
      { new: true, runValidators: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({
        message: "Teacher not found"
      });
    }

    res.status(200).json(updatedTeacher);

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// delete teacher 
const deleteTeacher = async (req,res)=>{
    try{
        const deleteTeacher = await Teacher.findByIdAndDelete(req.params.id)
        res.status(200).json(deleteTeacher)
    }catch(error){
        console.log("error is an error",error)
        res.status(500).json({message:"server error"})
    }
}






module.exports = { createTeacher, loginTeacher, profileTeacher,SingleTeacher, updateTeacher,deleteTeacher}
