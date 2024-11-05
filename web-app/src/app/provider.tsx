"use client";
import { ThemeProvider } from "@/providers/theme-provider";
import React from "react";
import { SessionProvider } from "next-auth/react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Provider;
