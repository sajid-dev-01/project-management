"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React, { PropsWithChildren } from "react";

import { queryClient } from "@/lib/query-client";

import { Toaster } from "./ui/sonner";
import { AlertDialogProvider } from "./ui-extension/alert";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <NuqsAdapter>
      <ThemeProvider attribute="class" defaultTheme="system">
        <QueryClientProvider client={queryClient}>
          <AlertDialogProvider>{children}</AlertDialogProvider>
          <Toaster
            position="top-center"
            richColors
            duration={5000}
            closeButton
          />
        </QueryClientProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
};
