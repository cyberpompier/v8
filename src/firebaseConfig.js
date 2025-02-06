const firebaseConfig = {
      apiKey: "AIzaSyBIcyBpklYK-YYM5BmF_WVdQwfEAOoV-Aw",
      authDomain: "remise-noyon.firebaseapp.com",
      projectId: "remise-noyon",
      storageBucket: "remise-noyon.firebasestorage.app",
      messagingSenderId: "883902593638",
      appId: "1:883902593638:web:a90d526703f6f04bcb0ba7",
      measurementId: "G-SXWLTGQZZJ"
    };
    
    // Initialize Firebase
    import { initializeApp } from 'firebase/app';
    
    export const app = initializeApp(firebaseConfig);
    
    export default firebaseConfig;
