import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LoginSign = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    email: "",
    address: "",
    age: "",
    city: "",
    state: "",
    postalcode: "",
  });

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (event, isLogin = false) => {
    const { name, value } = event.target;
    if (isLogin) {
      setLoginData({
        ...loginData,
        [name]: value,
      });
    } else {
      setRegisterData({
        ...registerData,
        [name]: value,
      });
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/login", loginData);
      alert(`Welcome back, ${response.data.username}!`);
      setLoginData({ username: "", password: "" });
      navigate('/ButtonAdd'); // Use navigate to redirect to AddProject
    } catch (error) {
      alert("Invalid username or password.");
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/registers", registerData);
      alert("User registered successfully!");
      setRegisterData({
        username: "",
        password: "",
        email: "",
        address: "",
        age: "",
        city: "",
        state: "",
        postalcode: "",
      });
    } catch (error) {
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <h1>REAL ESTATE</h1>
      </header>

      <div className="form-container">
        <div className="tab-header">
          <button
            className={activeTab === "login" ? "tab active" : "tab"}
            onClick={() => handleTabSwitch("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "register" ? "tab active" : "tab"}
            onClick={() => handleTabSwitch("register")}
          >
            Register
          </button>
        </div>

        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="form">
            <h2>Login</h2>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
        )}

        {activeTab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="form">
            <h2>Register</h2>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={registerData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={registerData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={registerData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalcode"
                  value={registerData.postalcode}
                  onChange={handleInputChange}
                  placeholder="Postal Code"
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={registerData.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                  required
                />
              </div>
            </div>
            <button type="submit" className="submit-button">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginSign;