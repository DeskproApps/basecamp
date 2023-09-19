import { useMemo } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { match } from "ts-pattern";
import {
  LoadingSpinner,
  useDeskproElements,
  useDeskproAppClient,
  useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useLogout, useUnlinkCard } from "./hooks";
import { isNavigatePayload, isUnlinkPayload } from "./utils";
import {
  HomePage,
  LoginPage,
  ViewCardPage,
  EditCardPage,
  LinkCardsPage,
  LoadingAppPage,
  CreateCardPage,
  AdminCallbackPage,
  CreateCardCommentPage,
} from "./pages";
import type { FC } from "react";
import type { EventPayload } from "./types";

const App: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { client } = useDeskproAppClient();
  const { logout, isLoading: isLoadingLogout } = useLogout();
  const { unlink, isLoading: isLoadingUnlink } = useUnlinkCard();
  const isAdmin = useMemo(() => pathname.includes("/admin/"), [pathname]);
  const isLoading = [isLoadingLogout, isLoadingUnlink].some((isLoading) => isLoading);

  useDeskproElements(({ registerElement, deRegisterElement }) => {
    deRegisterElement("refresh");
    deRegisterElement("home");
    deRegisterElement("plus");
    deRegisterElement("menu");
    deRegisterElement("edit");

    registerElement("refresh", { type: "refresh_button" });
  });

  const debounceElementEvent = useDebouncedCallback((_, __, payload: EventPayload) => {
    return match(payload.type)
      .with("changePage", () => {
        if (isNavigatePayload(payload)) {
          navigate(payload.path);
        }
      })
      .with("logout", logout)
      .with("unlink", () => {
        if (isUnlinkPayload(payload)) {
          unlink(payload);
        }
      })
      .run();
  }, 500);

  useDeskproAppEvents({
    onShow: () => {
      client && setTimeout(() => client.resize(), 200);
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onElementEvent: debounceElementEvent,
  }, [client]);

  if (!client || isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/admin/callback" element={<AdminCallbackPage/>}/>)
        <Route path="/login" element={<LoginPage/>}/>)
        <Route path="/home" element={<HomePage/>}/>)
        <Route path="/cards/link" element={<LinkCardsPage/>}/>)
        <Route path="/cards/view" element={<ViewCardPage/>}/>)
        <Route path="/cards/create" element={<CreateCardPage/>}/>)
        <Route path="/cards/edit" element={<EditCardPage/>}/>)
        <Route path="/cards/comments/create" element={<CreateCardCommentPage/>} />
        <Route index element={<LoadingAppPage/>} />
      </Routes>
      {!isAdmin && (<><br/><br/><br/></>)}
    </>
  );
}

export { App };
