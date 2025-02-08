import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import './Label.css';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Label({ label, onIconClick, onVerifyClick, user }) {
  const [anomalies, setAnomalies] = useState([]);
  const [manquants, setManquants] = useState([]);
  const [verificationInfo, setVerificationInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchMateriels = async () => {
      try {
        const materielsRef = collection(db, "materials");
        const q = query(materielsRef, where("affection", "==", label.denomination));
        const querySnapshot = await getDocs(q);

        const fetchedAnomalies = [];
        const fetchedManquants = [];

        querySnapshot.forEach((doc) => {
          const materiel = doc.data();
          if (materiel.status === 'anomalie') {
            fetchedAnomalies.push(materiel);
          } else if (materiel.status === 'manquant') {
            fetchedManquants.push(materiel);
          }
        });

        setAnomalies(fetchedAnomalies);
        setManquants(fetchedManquants);
      } catch (error) {
        console.error("Erreur lors de la récupération des matériels :", error);
      }
    };

    const fetchVerificationInfo = async () => {
      try {
        const verificationRef = doc(db, 'verifications', label.id);
        const docSnap = await getDoc(verificationRef);
        if (docSnap.exists()) {
          setVerificationInfo(docSnap.data());
        } else {
          setVerificationInfo(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de vérification :", error);
        setVerificationInfo(null);
      }
    };

    fetchMateriels();
    fetchVerificationInfo();
  }, [label.denomination, label.id]);

  const shouldShowIcon = anomalies.length > 0 || manquants.length > 0;

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="label-container">
      <div className="label-icon" onClick={onIconClick}>
        {label.photo ? (
          <img src={label.photo} alt={label.denomination} style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover'
          }} />
        ) : (
          label.immatriculation ? label.immatriculation.substring(0, 2) : 'N/A'
        )}
      </div>
      <div className="label-details">
        <div className="label-title">
          {label.denomination}
          {shouldShowIcon && (
            <span className="label-info-icon" onClick={handleInfoClick}>
              ⓘ
            </span>
          )}
        </div>
        <div className="label-verification">
          {anomalies.length === 0 && manquants.length === 0 ? (
            <>
              Statut: {label.status}
              <br />
            </>
          ) : null}
          {anomalies.length > 0 && (
            <>
              Anomalies: {anomalies.length}
              <br />
            </>
          )}
          {manquants.length > 0 && (
            <>
              Manquants: {manquants.length}
              <br />
            </>
          )}
          {verificationInfo && (
            <>
              <br />
              Vérifié le: {verificationInfo.timestamp}
              <br />
              Par: {verificationInfo.grade} {verificationInfo.user}
            </>
          )}
        </div>
      </div>
      {user ? <button className="label-button" onClick={onVerifyClick}>Vérifier</button> : null}
      {showPopup && (
        <AnomaliePopup
          label={label}
          anomalies={anomalies}
          manquants={manquants}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}

function AnomaliePopup({ label, anomalies, manquants, onClose }) {
  return (
    <div className="anomalie-popup">
      <div className="anomalie-popup-content">
        <h3>{label.denomination} - Commentaires et Matériel</h3>
        {anomalies.length > 0 && (
          <div>
            <h4>Anomalies:</h4>
            <ul>
              {anomalies.map((materiel) => {
                const commentParts = materiel.comment ? materiel.comment.split('\n') : [];
                const timestampSignature = commentParts.length > 0 ? commentParts[0] : '';
                const commentText = commentParts.length > 1 ? commentParts[1] : '';

                return (
                  <li key={materiel.id}>
                    <b>{materiel.denomination}:</b>
                    {materiel.comment && (
                      <>
                        <p>{timestampSignature}</p>
                        <p><b>{commentText}</b></p>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {manquants.length > 0 && (
          <div>
            <h4>Manquants:</h4>
            <ul>
              {manquants.map((materiel) => {
                const commentParts = materiel.comment ? materiel.comment.split('\n') : [];
                const timestampSignature = commentParts.length > 0 ? commentParts[0] : '';
                const commentText = commentParts.length > 1 ? commentParts[1] : '';

                return (
                  <li key={materiel.id}>
                    <b>{materiel.denomination}:</b>
                    {materiel.comment && (
                      <>
                        <p>{timestampSignature}</p>
                        <p><b>{commentText}</b></p>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {anomalies.length === 0 && manquants.length === 0 && (
          <p>Aucun commentaire.</p>
        )}
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default Label;
