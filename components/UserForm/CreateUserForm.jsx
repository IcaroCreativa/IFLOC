// pages/signup.js
import { useState } from "react";
import { auth, database } from "../../firebaseConfig"; // Assurez-vous d'importer correctement votre configuration Firebase
import { useRouter } from "next/router";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { verifyMatriculeExist } from "../../utils/helper";

import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import des icônes
import LoginBtn from "../../components/login-btn";

export default function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [matricule, setMatricule] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const isMatriculeValid = (matricule) => /^\d{8}$/.test(matricule);
  const isPasswordValid = (password) =>
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
      password
    );

  const handleSignUp = async (e) => {
    e.preventDefault();

    const response = await verifyMatriculeExist(matricule);
    if (response.success == true) {
      setError("Un utilisateur avec ce numéro de matricule existe déjà!");
      return;
    }
    if (!isMatriculeValid(matricule)) {
      setError("Le matricule doit comporter 8 chiffres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!isPasswordValid(password)) {
      setError(
        "Le mot de passe doit comporter 8 caractères avec au moins une majuscule et un caractère spéciale."
      );
      return;
    }

    try {
      // Création de l'utilisateur dans Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Enregistrement des informations supplémentaires dans Firestore
      await setDoc(doc(database, "users", user.uid), {
        firstname: firstname, // Renommé firstname
        name: name,
        email: email,
        matricule: matricule,
        photoURL: "/images/avatars/10.png",
        // Ajoutez d'autres champs si nécessaire
      });

      // Redirigez l'utilisateur vers une autre page après l'inscription
      router.push("/account/profil");
    } catch (error) {
      setError("Erreur lors de la création du compte : " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="#"
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img className="w-20 mr-2" src="/images/logo.jpg" alt="logo" />
        IFMSResid
      </a>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0  xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Créer un compte
          </h1>
          <div>
            <LoginBtn />
          </div>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSignUp}>
            <div className="lg:grid lg:grid-cols-2 lg:gap-4">
              <div>
                <label
                  htmlFor="firstname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="username"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Nom"
                />
              </div>
              <div>
                <label
                  htmlFor="matricule"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Matricule
                </label>
                <input
                  type="text"
                  name="matricule"
                  id="matricule"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  onClick={() => setError("")}
                  pattern="\d{8}"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Matricule (8 chiffres)"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Votre adresse e-mail
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                />
              </div>
            </div>
            {/* Champ "Mot de passe" */}
            <div className="relative">
              <label htmlFor="password">Mot de passe</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                autoComplete="new-password"
                onClick={() => setError("")}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
              <button
                className="absolute top-11 right-3 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash /> // Icône pour masquer le mot de passe
                ) : (
                  <FaEye /> // Icône pour montrer le mot de passe
                )}
              </button>
            </div>

            {/* Champ "Confirmer le mot de passe" */}
            <div className="relative">
              <label htmlFor="confirm-password">
                Confirmer le mot de passe
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm-password"
                id="confirm-password"
                value={confirmPassword}
                autoComplete="new-password"
                onClick={() => setError("")}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
              <button
                className="absolute top-11 right-3 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash /> // Icône pour masquer la confirmation du mot de passe
                ) : (
                  <FaEye /> // Icône pour montrer la confirmation du mot de passe
                )}
              </button>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="terms"
                  className="font-light text-gray-500 dark:text-gray-300"
                >
                  J'accepte les{" "}
                  <a
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    href="#"
                  >
                    Conditions d'utilisation
                  </a>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Créer un compte
            </button>
            {error && <div className="text-red-500">{error}</div>}
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Vous avez déjà un compte ?{" "}
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Connectez-vous ici
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
