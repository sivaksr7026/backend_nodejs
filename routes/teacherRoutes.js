const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const auth = require('../middleware/auth')

router.post('/register', teacherController.createTeacher);
router.post('/login', teacherController.loginTeacher);
router.get('/myprofile', auth, teacherController.profileTeacher)

router.get('/edit/:id',auth, teacherController.SingleTeacher)
router.put('/update/:id',auth,teacherController.updateTeacher)
router.delete('/delete/:id',auth, teacherController.deleteTeacher)
module.exports = router;
