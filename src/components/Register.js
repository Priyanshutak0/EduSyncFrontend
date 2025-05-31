import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.STUDENT
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate(formData.role === ROLES.INSTRUCTOR ? '/instructor-dashboard' : '/student-dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header className="bg-black text-white px-5 py-4 d-flex justify-content-between align-items-center shadow">
        <h1 className="text-primary fw-bold mb-0">EduSync</h1>
        <Link to="/Login" className="btn btn-primary px-4 py-2">
          Login
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-grow-1 bg-black text-white d-flex">
        {/* Left side image */}
        <div className="col-md-6 p-0" style={{ height: '550px' }}>
          <img
            src="/photo2.png" // Make sure this image is in the public folder
            alt="Register Illustration"
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Right side register box */}
        <div className="col-md-6 d-flex justify-content-center align-items-start pt-1 bg-black" style={{ height: '520px' }}>
          <div className="card bg-dark border-secondary" style={{ width: '100%', maxWidth: '400px', height: '100%' }}>
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <h2 className="text-center text-primary mb-4">Register</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label text-white">Name</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-white">Email</label>
                  <input
                    type="email"
                    className="form-control bg-dark text-white border-secondary"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-white">Password</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-white border-secondary"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label text-white">Role</label>
                  <select
                    className="form-select bg-dark text-white border-secondary"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value={ROLES.STUDENT}>Student</option>
                    <option value={ROLES.INSTRUCTOR}>Instructor</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
              <div className="text-center mt-3">
                <p className="text-secondary">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary text-decoration-none">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-2 mt-auto">
        <small>&copy; 2025 EduSync. All rights reserved.</small>
      </footer>
    </div>
  );
};

export default Register;
