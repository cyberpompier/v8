import React, { useState, useEffect } from 'react';
    import { initializeApp } from 'firebase/app';
    import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
    import firebaseConfig from './firebaseConfig';
    import './Label.css';

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    function Label({ label, onIconClick, onVerifyClick, user }) {
      const [anomalieCount, setAnomalieCount] = useState(0);
      const [manquantCount, setManquantCount] = useState(0);
      const [verificationInfo, setVerificationInfo] = useState(null);

      useEffect(() => {
        const fetchCounts = async () => {
          try {
            const materielsRef = collection(db, "materials");
            const q = query(materielsRef, where("affection", "==", label.denomination));

            const querySnapshot = await getDocs(q);
            let anomalie = 0;
            let manquant = 0;

            querySnapshot.forEach((doc) => {
              const materiel = doc.data();
              if (materiel.status === 'anomalie') {
                anomalie++;
              } else if (materiel.status === 'manquant') {
                manquant++;
              }
            });

            setAnomalieCount(anomalie);
            setManquantCount(manquant);
          } catch (error) {
            console.error("Error fetching counts:", error);
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
            console.error("Error fetching verification info:", error);
            setVerificationInfo(null);
          }
        };

        fetchCounts();
        fetchVerificationInfo();
      }, [label.denomination, label.id]);

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
            <div className="label-title">{label.denomination}</div>
            <div className="label-verification">
              {anomalieCount === 0 && manquantCount === 0 ? (
                <>
                  Status: {label.status}
                  <br />
                </>
              ) : null}
              {anomalieCount > 0 && (
                <>
                  Anomalies: {anomalieCount}
                  <br />
                </>
              )}
              {manquantCount > 0 && (
                <>
                  Manquants: {manquantCount}
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
        </div>
      );
    }

    export default Label;
