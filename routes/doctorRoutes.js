import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  doctorAppointmentsController,
  getDoctorByIdController,
  getDoctorInfoController,
  updateProfileController,
  updateStatusController,
} from "../controllers/doctorCtrl.js";

const router = express.Router();

//Post Single Doctor info
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//Post Update Profile
router.post("/updateProfile", authMiddleware, updateProfileController);

router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

router.get(
  "/doctor-appointments",
  authMiddleware,
  doctorAppointmentsController
);

//post update status
router.post('/update-status' ,authMiddleware,updateStatusController)

export default router;
