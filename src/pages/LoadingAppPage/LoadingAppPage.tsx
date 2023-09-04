import { LoadingSpinner } from "@deskpro/app-sdk";
import { useCheckAuth } from "./hooks";
import type { FC } from "react";

const LoadingAppPage: FC = () => {
  useCheckAuth();

  return (
    <LoadingSpinner/>
  );
};

export { LoadingAppPage };
