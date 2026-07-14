import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AppState {
  streak: number;
  problemsSolved: number;
  careerScore: number;
  dsaScore: number;
  systemDesignScore: number;
  behavioralScore: number;
  resumeMatch: number;
  user: { name: string; email: string; role?: string } | null;
  solveProblem: (xp: number) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [streak, setStreak] = useState(0);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [careerScore, setCareerScore] = useState(0);
  const [dsaScore, setDsaScore] = useState(0);
  const [systemDesignScore, setSystemDesignScore] = useState(0);
  const [behavioralScore, setBehavioralScore] = useState(0);
  const [resumeMatch, setResumeMatch] = useState(0);
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [token, setTokenState] = useState<string | null>(localStorage.getItem("token"));

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    if (token) {
      // Fetch user data from backend
      fetch('/api/user/me', {
        headers: { 'x-auth-token': token }
      })
      .then(res => res.json())
      .then(data => {
        if (data.name) setUser({ name: data.name, email: data.email, role: data.role });
        if (data.streak !== undefined) setStreak(data.streak);
        if (data.problemsSolved !== undefined) setProblemsSolved(data.problemsSolved);
        if (data.careerScore !== undefined) setCareerScore(data.careerScore);
        if (data.dsaScore !== undefined) setDsaScore(data.dsaScore);
        if (data.systemDesignScore !== undefined) setSystemDesignScore(data.systemDesignScore);
        if (data.behavioralScore !== undefined) setBehavioralScore(data.behavioralScore);
        if (data.resumeMatch !== undefined) setResumeMatch(data.resumeMatch);
      })
      .catch(err => console.error(err));
    }
  }, [token]);

  const solveProblem = (xp: number) => {
    const newProblemsSolved = problemsSolved + 1;
    const newCareerScore = Math.min(100, careerScore + 1);

    setProblemsSolved(newProblemsSolved);
    setCareerScore(newCareerScore);

    if (token) {
      fetch('/api/user/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          problemsSolved: newProblemsSolved,
          careerScore: newCareerScore
        })
      }).catch(err => console.error(err));
    }
  };

  return (
    <AppContext.Provider value={{ streak, problemsSolved, careerScore, dsaScore, systemDesignScore, behavioralScore, resumeMatch, user, solveProblem, token, setToken }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
