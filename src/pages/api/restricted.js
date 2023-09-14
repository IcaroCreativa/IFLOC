import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    });
  } else {
    const responseBody = {
      message:
        "You must be signed in to view the protected content on this page.",
    };
    // res.status(401).json(responseBody);
    res.writeHead(302, { Location: "/auth/login" });
    res.end();
    return;
  }
};
