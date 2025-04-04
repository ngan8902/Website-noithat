const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController') 
const {authMiddleware, authUserMiddleware, authenticateUser} = require('../middleware/authMiddleware')
const { upload } = require('../service/ImagesService')

/**Authentication */
router.get('/getme' , authenticateUser, userController.getMe)
router.post('/refresh-token' , userController.refreshToken)

/**SignIn Sign Up API */
router.post('/sign-up' , userController.createUser)
router.post('/sign-in' , userController.loginUser)

/**API */
router.put('/update-user/:id' , upload.single("avatar"), userController.updateUser)
router.put('/update-password/:id' , userController.updatePassword)
router.delete('/delete-user/:id' , authMiddleware, userController.deleteUser)
router.get('/get-all', userController.getAllUser)
router.get('/get-details/:id' , authenticateUser, userController.getDetailsUser)

module.exports = router