import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import LoginBtn from "../../components/login-btn";

const containerStyle = {
  position: "relative",
  width: "100vw", // Largeur de la fenêtre visible
  height: "100vh", // Hauteur de la fenêtre visible
  overflow: "hidden", // Empêche le débordement de l'image de fond
};

const imageStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%", // Utilise toute la largeur de la fenêtre visible
  height: "100%", // Utilise toute la hauteur de la fenêtre visible
  objectFit: "cover", // Ajuste la taille de l'image pour couvrir tout l'élément
};

const buttonContainerStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export default function Home() {
  const router = useRouter();
  const { user, getUser } = useAuth();

  return (
    <div style={containerStyle}>
      <Image
        src="/images/fondhome.jpg"
        alt="Background Image"
        width={1920}
        height={1080}
        style={imageStyle} // Appliquez le style ici
      />
      <div style={buttonContainerStyle}>
        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="text-white bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50 mr-2 mb-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-6 mr-4 -ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
            />
          </svg>
          {user ? "Mon Compte" : "Se connecter"}
        </button>
        <LoginBtn />
      </div>
    </div>
  );
}
