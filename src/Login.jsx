import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
    import { app } from './firebaseConfig'; // Import the Firebase app instance
    import './Login.css';
    
    function Login() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();
      const auth = getAuth(app); // Initialize Firebase Auth
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
    
        try {
          // Sign in with Firebase Authentication
          await signInWithEmailAndPassword(auth, email, password);
    
          // If successful, navigate to the labels page
          navigate('/labels');
        } catch (err) {
          // Handle errors such as incorrect email, wrong password, or user not found
          setError(err.message);
          console.error('Login failed:', err.message);
        }
      };
    
      return (
        <div className="login-container">
          <h2>Se connecter</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Se connecter</button>
          </form>
        </div>
      );
    }
    
    export default Login;
