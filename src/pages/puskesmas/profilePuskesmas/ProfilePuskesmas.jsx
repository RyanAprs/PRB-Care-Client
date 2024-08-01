import React, { useEffect, useState } from "react";
import { getCurrentAdminPuskesmas } from "../../../services/PuskesmasService";
import { User } from "lucide-react";

const ProfilePuskesmas = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await getCurrentAdminPuskesmas();
        setName(response.namaPuskesmas);
        console.log(response);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <div className="h-full w-full flex justify-center items-center py-32 bg-white px-60 rounded shadow-xl">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="h-20 w-20 rounded-full bg-mainGreen flex justify-center items-center">
          <User size={50} />
        </div>
        <div>
          <h1>{name}</h1>
        </div>
      </div>
    </div>
  );
};

export default ProfilePuskesmas;
