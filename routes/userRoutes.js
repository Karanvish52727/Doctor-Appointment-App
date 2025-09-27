import express from "express";
import {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
} from "../controllers/userCtrl.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// import ApplyDoctor from "../client/src/pages/ApplyDoctor.js";

const router = express.Router();

// Login || POST
router.post("/login", loginController);

// Register || POST
router.post("/register", registerController);

//Authentication || Post
router.post("/getUserData", authMiddleware, authController);

//for Apply doctor ||post method
router.post("/apply-doctor", authMiddleware, applyDoctorController);

//get notification || Post
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

//Delete notification || Post
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

//Get All Doctors
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

//Book Appointment
router.post("/book-appointment", authMiddleware, bookAppointmentController);

//Booking-Availability
router.post(
  "/booking-availability",
  authMiddleware,
  bookingAvailabilityController
);

//Appointment List
router.get("/user-appointments", authMiddleware, userAppointmentsController);
export default router;
