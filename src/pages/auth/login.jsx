import { React, useState, useEffect } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import Link from "next/link";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";

function Login() {
  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messagePassword, setMessagePassword] = useState("");
  const [message, setMessage] = useState("");
  const { user, getUser } = useAuth();
  const { login } = useAuth();

  // function to hidden or display secret code and passwords
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const logIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log(response.user);
        sessionStorage.setItem("Token", response.user.accessToken);
        console.log(response.user.auth.currentUser);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Vous êtes bien connecté",
          showConfirmButton: false,
          timer: 1500,
        });

        router.push("/account/profil");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-in-use":
            console.log("email-alredy-in-use");
            Swal.fire({
              position: "center",
              icon: "warning",
              text: `Ce compte existe déjà.\nVeuillez vous connecter`,
              showConfirmButton: false,
              timer: 4000,
            });
            router.push("/auth/login");

            break;

          case "auth/invalid-email":
            setMessage("Adresse Email invalide.");
            console.error("Invalid email address.");
            break;
          case "auth/user-disabled":
            setMessage("Utilisateur desactivé");
            console.error("User account is disabled.");
            break;
          case "auth/user-not-found":
            console.error("User not found.");
            setMessage("L'email n'existe pas.");
            break;
          case "auth/wrong-password":
            setMessagePassword("Mot de passe incorrect.");
            console.error("Incorrect password.");
            break;
          default:
            console.error(error.message);
        }
      });
  };

  useEffect(() => {
    let token = sessionStorage.getItem("Token");

    if (user) {
      router.push("/account/profil");
    }
  }, [user]);

  const handleLogin = async () => {
    // console.log(user)
    try {
      await login(email, password).then((response) => {
        getUser(response.user.email).then((result) => {
          console.log("getUser Response from Loginpage");
        });
        if (user) {
          router.push("/account/profil");
        } else {
          router.push("/");
        }
      });
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
          setMessage("Adresse Email invalide.");
          console.error("Invalid email address.");
          break;
        case "auth/user-disabled":
          setMessage("Utilisateur desactivé");
          console.error("User account is disabled.");
          break;
        case "auth/user-not-found":
          console.error("User not found.");
          setMessage("L'email n'existe pas.");
          break;
        case "auth/wrong-password":
          setMessagePassword("Mot de passe incorrect.");
          console.error("Incorrect password.");
          break;
        default:
          console.error(err.message);
      }
    }
  };

  return (
    <div className="mx-auto my-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 md:mt-6">
      <div className="flex justify-center">
        <a href="/" className="flex items-center rounded-full p-2 shadow-lg ">
          <Image
            className="h-28 w-28 "
            src="/images/logo.jpg"
            alt="boost logo"
            width={180}
            height={37}
            priority
          />
        </a>
      </div>

      <div className="mx-auto my-auto max-w-lg text-center">
        <p className="mt-4 text-[#2D4EC3] text-xl font-semibold  ">Connexion</p>
      </div>

      <div className="mx-auto mt-8 mb-0 max-w-md space-y-4">
        <div className="border-2 border-[#6378C2] rounded-md mx-9">
          <label htmlFor="email" className="sr-only">
            Email
          </label>

          <div className="relative">
            <input
              onFocus={() => setMessage("")}
              type="email"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm outline-gray-500 "
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              placeholder="Entrez votre email"
            />

            <span className="absolute inset-y-0 right-4 inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="flex ml-10 ">
          {message ? <p className="text-sm text-red-600">{message}</p> : null}
        </div>

        <div className="border-2 border-[#6378C2] rounded-md mx-9">
          <label htmlFor="email" className="sr-only">
            Email
          </label>

          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm outline-gray-500 "
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              onFocus={() => setMessagePassword("")}
              placeholder="Entrez votre mot de passe"
            />

            <button onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
              <span className="absolute inset-y-0 right-4 inline-flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#03989E]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
        <div className="flex ml-10 ">
          {messagePassword ? (
            <p className="text-sm text-red-600">{messagePassword}</p>
          ) : null}
        </div>
        <div className="flex justify-between mx-9">
          <div></div>
          <Link
            className="underline text-sm text-gray-500 hover:text-blue-600"
            href="/auth/ForgotPassword"
          >
            Mot de passe oublié
          </Link>
        </div>

        <div className="flex justify-between mx-9 pt-4">
          <button
            type="submit"
            className="inline-block bg-blue-600 px-5 py-2 text-sm font-medium text-white rounded-3xl hover:bg-blue-500 transition duration-500 hover:scale-105"
            onClick={handleLogin}
          >
            Connexion
          </button>

          <p className="text-sm text-gray-500">
            <Link
              href="/account/signup"
              className="underline hover:text-blue-600"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
