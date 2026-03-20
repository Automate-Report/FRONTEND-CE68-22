"use client";
import { createContext, useContext, ReactNode } from "react";

const ProjectDetailContext = createContext<{ role: string | undefined }>({ role: undefined });

export const ProjectProvider = ({ role, children }: { role: string; children: ReactNode }) => (
  <ProjectDetailContext.Provider value={{ role }}>{children}</ProjectDetailContext.Provider>
);

export const useProjectRole = () => useContext(ProjectDetailContext);