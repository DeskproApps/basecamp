import { useDeskproElements } from "@deskpro/app-sdk";
import { useSetTitle } from "../../hooks";
import { useLogin } from "./hooks";
import { Login } from "../../components";
import type { FC } from "react";

const LoginPage: FC = () => {
  const { onLogIn, authUrl, isLoading, error } = useLogin();

  useSetTitle("Basecamp");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
  });

  return (
    <Login
      error={error}
      onLogin={onLogIn}
      authUrl={authUrl}
      isLoading={isLoading}
    />
  );
};

export { LoginPage };
