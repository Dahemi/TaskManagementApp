import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/v1/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token); //store the token
      navigate("/tasks"); //redirect to task page
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
