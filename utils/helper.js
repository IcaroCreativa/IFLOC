



export const verifyMatriculeExist = async (matricule) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/auth/users?matricule=${matricule}`,
        requestOptions
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  
