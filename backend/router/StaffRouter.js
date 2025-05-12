const express = require('express');
const router = express.Router();
const staffController = require('../controller/StaffController')
const { authenticateStaff } = require('../middleware/authMiddleware')
const { upload } = require('../service/ImagesService')

/**Authentication */
router.get('/getme', authenticateStaff, staffController.getMe)

/**API */
router.post('/sign-up', upload.single("avatar"), staffController.createStaff)
router.post('/sign-in', staffController.loginStaff)
router.get('/all-staff', staffController.getAllStaff)
router.put('/update-staff/:id', upload.single("avatar"), staffController.updateStaff)
router.delete('/delete-staff/:id', staffController.deleteStaff)
router.post('/:staffId/upload-face', staffController.registerFace)
router.get('/all-staff-face', staffController.getAllStaffFaceEmbedding)




module.exports = router