import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
  Link,
  MakeGenerics,
  Outlet,
  ReactLocation,
  Router,
  useMatch,
} from "@tanstack/react-location";
import React from "react";
import ReactDOM from "react-dom/client";

import App, { fetchCharacters } from "./App";
import { CharacterDetail, fetchCharacter } from "./CharacterDetail";

import "./index.css";

const queryClient = new QueryClient();
const location = new ReactLocation();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router
        location={location}
        routes={[
          {
            path: "/",
            element: <App />,
            loader: () =>
              queryClient.getQueryData(["characters"]) ??
              queryClient.fetchQuery(["characters"], fetchCharacters),
          },
          {
            path: "/character/:characterId",
            element: <CharacterDetail />,
            loader: ({ params: { characterId } }) =>
              queryClient.getQueryData(["characters", characterId]) ??
              queryClient.fetchQuery(["characters", characterId], () =>
                fetchCharacter(characterId)
              ),
          },
        ]}
      />
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  </React.StrictMode>
);
