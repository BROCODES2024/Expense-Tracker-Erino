import React, { useState } from "react";
import styled from "styled-components";

function Auth({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!isLogin) {
      // Registration Logic: Call backend /api/auth/register
      if (
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.email.trim() ||
        !formData.password.trim()
      ) {
        alert("All fields are required!");
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:5001/api/auth/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Registration successful! Please log in.");
          setIsLogin(true);
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred during registration.");
      }
    } else {
      // Login Logic: Call backend /api/auth/login
      try {
        const response = await fetch("http://localhost:5001/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          // Assume your backend returns a token in the response (and sets a cookie as well)
          localStorage.setItem("token", data.token);
          // Optionally, you can store user details if returned:
          // localStorage.setItem("user", JSON.stringify(data.user));
          setIsAuthenticated(true);
        } else {
          alert(data.message || "Invalid email or password");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login.");
      }
    }
  };

  return (
    <AuthStyled>
      <div className="auth-container">
        <h1>{isLogin ? "Login" : "Register"}</h1>

        {!isLogin && (
          <>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button onClick={handleAuth}>{isLogin ? "Login" : "Register"}</button>

        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </AuthStyled>
  );
}

const AuthStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f8f9fa;

  .auth-container {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 300px;
  }

  input {
    display: block;
    width: 100%;
    margin: 0.5rem 0;
    padding: 0.8rem;
  }

  button {
    background: #007bff;
    color: white;
    padding: 0.8rem;
    border: none;
    cursor: pointer;
  }

  p {
    cursor: pointer;
    color: #007bff;
  }
`;

export default Auth;
