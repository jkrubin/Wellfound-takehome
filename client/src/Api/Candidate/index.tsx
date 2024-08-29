import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";
import { Candidate } from "./types";
import { useApi } from "..";

interface CandidateContextType {
  candidates: Candidate[];
  fetchCandidates: () => Promise<void>;
  fetchCandidateById: (id: number) => Promise<Candidate | undefined>;
  createCandidate: (name: string, email: string) => Promise<Candidate>;
  updateCandidate: (
    id: number,
    name: string,
    email: string
  ) => Promise<Candidate>;
  deleteCandidate: (id: number) => Promise<void>;
}

const CandidateContext = createContext<CandidateContextType | undefined>(
  undefined
);

export const CandidateProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { fetchAPI } = useApi();
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const fetchCandidates = async () => {
    try {
      const data = await fetchAPI<Candidate[]>("candidate");
      setCandidates(data);
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    }
  };

  const fetchCandidateById = async (id: number) => {
    try {
      const data = await fetchAPI<Candidate>(`candidate/${id}`);
      return data;
    } catch (err) {
      console.error("Failed to fetch candidate", err);
      throw err;
    }
  };

  const createCandidate = async (name: string, email: string) => {
    try {
      const newCandidate = await fetchAPI<Candidate>("candidate", {
        method: "POST",
        body: JSON.stringify({ name, email }),
      });
      setCandidates((prev) => [newCandidate, ...prev]);
      return newCandidate;
    } catch (err) {
      console.error("Failed to create candidate", err);
      throw err;
    }
  };

  const updateCandidate = async (id: number, name: string, email: string) => {
    try {
      const updatedCandidate = await fetchAPI<Candidate>(`candidate/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name, email }),
      });
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === id ? updatedCandidate : candidate
        )
      );
      return updatedCandidate;
    } catch (err) {
      console.error("Failed to update candidate", err);
      throw err;
    }
  };

  const deleteCandidate = async (id: number) => {
    try {
      await fetchAPI<void>(`candidate/${id}`, {
        method: "DELETE",
      });
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));
    } catch (err) {
      console.error("Failed to delete candidate", err);
      throw err;
    }
  };

  return (
    <CandidateContext.Provider
      value={{
        candidates,
        fetchCandidates,
        fetchCandidateById,
        createCandidate,
        updateCandidate,
        deleteCandidate,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidateContext = () => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error(
      "useCandidateContext must be used within a CandidateProvider"
    );
  }
  return context;
};
