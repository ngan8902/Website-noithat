const express = require('express');
const router = express.Router();
const staffController = require('../controller/StaffController') 
const { authenticateStaff } = require('../middleware/authMiddleware')

/**Authentication */
router.get('/getme' , authenticateStaff, staffController.getMe)

/**API */
router.post('/sign-up' , staffController.createStaff)
router.post('/sign-in' , staffController.loginStaff)
router.get('/all-staff' , staffController.getAllStaff)
router.put('/update-staff/:id' , staffController.updateStaff)
router.delete('/delete-staff/:id' , staffController.deleteStaff)



module.exports = router