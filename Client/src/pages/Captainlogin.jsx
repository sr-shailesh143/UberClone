import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CapatainContext';

const Captainlogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setCaptain } = useContext(CaptainDataContext); // Correct usage of context
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const captainCredentials = { email, password };
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captainCredentials
      );

      if (response.status === 200) {
        const data = response.data;

        // Save captain data and token
        setCaptain(data.captain); // Correctly setting the captain state
        localStorage.setItem('token', data.token);

        // Navigate to captain home
        navigate('/captain-home');
      } else {
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-20 mb-3"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="Uber Logo"
        />

        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="password"
          />

          <button
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
          >
            Login
          </button>
        </form>
        <p className="text-center">
          Join a fleet?{' '}
          <Link to="/captain-signup" className="text-blue-600">
            Register as a Captain
          </Link>
        </p>
      </div>
      <div>
        <Link
          to="/login"
          className="bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default Captainlogin;
