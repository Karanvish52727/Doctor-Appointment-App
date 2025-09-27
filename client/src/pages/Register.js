import React, { useState } from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import Password from "antd/es/input/Password";

const Register = () => {
  // const [formData , setFormData] = useState({ name:"",email:"",Password:""});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading()); // Show loading here
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/register",
        values
      );
      dispatch(hideLoading()); // Hide loading after response
      if (res.data.success) {
        message.success("Registered Successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 300);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error(
        "User Name or Email is Matched to previous User Please Login"
      );
      setTimeout(() => {
        navigate("/login");
      }, 300);
    }
  };

  return (
    <div className="form-container">
      <Form
        layout="vertical"
        onFinish={onFinishHandler}
        className="register-form border p-4"
      >
        <h2 className="text-center">Register Form</h2>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input type="text" placeholder="Enter your Name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input type="email" placeholder="Enter your Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password placeholder="Enter your Password" />
        </Form.Item>

        <Link to="/login" className="m-2">
          Already a user? Login here
        </Link>

        <button className="btn btn-outline-primary" type="submit">
          Register
        </button>
      </Form>
    </div>
  );
};

export default Register;
