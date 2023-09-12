import React, { useEffect } from "react";
import CreateUserForm from "../../../components/UserForm/CreateUserForm";

const signup = () => {
  return (
    <>
  
      <div className="md:w-1/2 mx-auto mb-[80px] mt-10">
        <CreateUserForm />
      </div>
    </>
  );
};

export default signup;
