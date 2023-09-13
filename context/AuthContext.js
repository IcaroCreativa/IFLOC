import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/router";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    firstname: "",
    name: "",
    uid: null,
    email: "",
    displayName: "",
    photoURL: "", // Vous pouvez définir une image par défaut ici
    matricule:"",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          firstname: "",
          name: "",
          photoURL: "",
          matricule:"",
        });
        // Appeler getUser ici une fois que 'user' est initialisé
        getUser(user.email);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getUser = async (email) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      process.env.NEXT_PUBLIC_API +
        "/api/auth/users?filter=email&value=" +
        email,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Dans Authcontext:");
          console.log(data.data[0].photoURL);
          setUser((prevUser) => ({
            ...prevUser,
            name: data.data[0].name,
            firstname: data.data[0].firstname,
            photoURL: data.data[0].photoURL,
            matricule:data.data[0].matricule,
          }));
        } else {
          console.log("Email not found in AuthContext.js");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
    router.push("/auth/login");
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const deleteUser = (uid) => {
    return deleteUser(auth, uid);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        resetPassword,
        getUser,
        deleteUser,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
