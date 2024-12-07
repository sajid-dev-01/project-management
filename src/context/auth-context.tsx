"use client";

import { createContext, useContext } from "react";

import { Session, User } from "@/types";

type Context = {
  session?: Session | null;
  user?: User | null;
};

const Context = createContext<Context>({
  session: null,
  user: null,
});

export const useAuth = () => useContext(Context);

export const AuthContext: React.FC<React.PropsWithChildren<Context>> = ({
  children,
  session,
  user,
}) => {
  return (
    <Context.Provider value={{ session, user }}>{children}</Context.Provider>
  );
};
