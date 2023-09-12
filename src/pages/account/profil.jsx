import { React, useState, useEffect } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import Link from "next/link";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";

function Profil() {
  const auth = getAuth();
  const router = useRouter();
  const { user, getUser } = useAuth();

  // Utilisez useEffect pour appeler getUser uniquement si l'utilisateur n'est pas encore défini
  useEffect(() => {
    if (!user) {
      getUser(user.email);
    }
  }, [user]);

  console.log(user);

  return (
    <>
      <div className="pl-10">
        <h1 className="font-bold mx-auto">Profil du compte</h1>
        {user && user.photoURL && (
          <Image
            src={user.photoURL}
            width={100}
            height={100}
            className="w-12 h-12 mt-4 mb-4"
            alt="Avatar"
          />
        )}
        <p>Prénom : {user ? user.firstname : ""}</p>
        <p>Nom : {user ? user.name : ""}</p>
        <p>Email : {user ? user.email : ""}</p>
        <p>Matricule : {user ? user.matricule : ""}</p>
      </div>
    </>
  );
}

export default Profil;
