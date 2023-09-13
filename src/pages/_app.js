import "@/styles/globals.css";
import Navbar from "../../components/NavBar/navbar";
import { AuthContextProvider } from "../../context/AuthContext";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <SessionProvider session={session}>
        <AuthContextProvider>
          <Navbar />
          <Component {...pageProps} />
        </AuthContextProvider>
      </SessionProvider>
    </>
  );
}
