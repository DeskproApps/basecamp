import { useNavigate } from "react-router-dom";
import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";

type UseCheckAuth = () => void;

const useCheckAuth: UseCheckAuth = () => {
  const navigate = useNavigate();

  useInitialisedDeskproAppClient(() => {
    navigate("/login");
  }, [navigate]);
};

export { useCheckAuth };
