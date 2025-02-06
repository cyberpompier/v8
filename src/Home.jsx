import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
    import { app } from './firebaseConfig';
    import './Home.css';
    
    function Home() {
      const [user, setUser] = useState(null);
      const auth = getAuth(app);
    
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
        });
    
        return () => unsubscribe(); // Cleanup subscription on unmount
      }, [auth]);
    
      const handleLogout = async () => {
        try {
          await signOut(auth);
          // Optionally, redirect to the login page after logout
          // navigate('/login');
        } catch (error) {
          console.error('Logout failed:', error);
        }
      };
    
      return (
        <div className="home">
          <h2>Bienvenue sur la page d'accueil</h2>
          <p>Ceci est la page d'accueil de l'application.</p>
          <div className="buttons-container">
            {user ? (
              <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
            ) : (
              <>
                <Link to="/login" className="login-button">Se connecter</Link>
                <Link to="/register" className="register-button">S'enregistrer</Link>
              </>
            )}
          </div>
        </div>
      );
    }
    
    export default Home;
