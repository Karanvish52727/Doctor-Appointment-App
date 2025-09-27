import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // form handler
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/login",
        values
      );
      //for reloading the page
      window.location.reload();
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Details Did't Matched Please Register Again!!");
      setTimeout(() => {
        navigate("/Register");
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
        <h2 className="text-center">Login Form</h2>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email!",
            },
            {
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input type="email" placeholder="Enter your Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password!",
            },
          ]}
        >
          <Input type="password" placeholder="Enter your Password" />
        </Form.Item>

        <Link to="/register" className="m-2">
          Not a user? Register here
        </Link>

        <button className="btn btn-outline-primary" type="submit">
          Login
        </button>
      </Form>
    </div>
  );
};

export default Login;
