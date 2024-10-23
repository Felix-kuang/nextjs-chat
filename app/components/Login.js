import { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make sure username and password are both filled out
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    if (username.trim() && password.trim()) {
      onLogin(username,password);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-800 w-screen">
      <h1 className="font-sans text-4xl font-semibold text-gray-300 mb-3">
        NextJS Chat App
      </h1>
      <h2 className="font-sans text-sm font-semibold text-gray-400 mb-3">
        Enter your username and password for join chat
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-400 p-4 rounded shadow-md"
      >
        {/* <h2 className="text-lg text-slate-800 mb-4">Enter your username:</h2> */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border border-gray-500 rounded p-2 text-slate-800"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-gray-500 rounded p-2 text-slate-800"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          Join Chat
        </button>
      </form>
    </div>
  );
};

export default Login;
