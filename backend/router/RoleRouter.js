const express = require('express');
const router = express.Router();
const roleController = require('../controller/RoleController') 

router.post('/create', roleController.createRole)
router.post("/edit/:id", roleController.editRole)
// router.get("/get",  roleController.getRoles)

module.exports = router