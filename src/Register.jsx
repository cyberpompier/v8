import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
    import { app } from './firebaseConfig'; // Import the Firebase app instance
    import './Register.css';
    
    function Register() {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();
      const auth = getAuth(app); // Initialize Firebase Auth
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
    
        try {
          // Create user with Firebase Authentication
          await createUserWithEmailAndPassword(auth, email, password);
    
          // Update the user's profile with the display name
          await updateProfile(auth.currentUser, {
            displayName: name,
          });
    
          // If successful, navigate to the labels page or any other authenticated area
          navigate('/labels');
        } catch (err) {
          // Handle errors such as email already in use, weak password, etc.
          setError(err.message);
          console.error('Registration failed:', err.message);
        }
      };
    
      return (
        <div className="register-container">
          <h2>S'enregistrer</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nom:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <button type="submit">S'enregistrer</button>
          </form>
        </div>
      );
    }
    
    export default Register;
