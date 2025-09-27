import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModels.js";

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({}).lean();
    res.status(200).send({
      success: true,
      message: "Users data list",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error,
    });
  }
};

export const getAllDoctorsControler = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors data list",
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching doctors data",
      error,
    });
  }
};

// doctor account status
export const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
    const user = await userModel.findOne({ _id: doctor.userId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Associated user not found",
      });
    }

    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status}`,
      onClickPath: "/notification",
    });
    user.isDoctor = status === "approved" ? true : false;
    await user.save();

    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in Account Status",
      error,
    });
  }
};
