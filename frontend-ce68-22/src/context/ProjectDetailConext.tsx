"use client";
import { createContext, useContext, ReactNode } from "react";

const ProjectDetailContext = createContext<{ role: string | undefined }>({ role: undefined });

export const ProjectDetailProvider = ({ role, children }: { role: string | undefined; children: ReactNode }) => (
  <ProjectDetailContext.Provider value={{ role }}>
    {children}
  </ProjectDetailContext.Provider>
);

export const useProjectRole = () => useContext(ProjectDetailContext);