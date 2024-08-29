import { useState } from "react";
import { AuthContextType, useAuth } from "./Auth";
import { CreateToastFnReturn, useToast } from "@chakra-ui/react";

export const API_URL = "localhost:8080";
export const API_ENDPOINT = `http://${API_URL}/v1`;

type ErrorRes = {
  message: string;
};
export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  let auth: AuthContextType | null = null;
  let toast: CreateToastFnReturn | null = null;
  try {
    auth = useAuth();
  } catch (err) {
    console.log("auth not set");
  }
  try {
    toast = useToast();
  } catch (err) {
    console.log("toast not set");
  }
  const getHeaders = () => ({
    "Content-Type": "application/json",
    "x-access-token": `${auth?.token}`,
  });

  async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_ENDPOINT}/${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          ...getHeaders(),
        },
      });
      const data = (await res.json()) as T;
      if (!res.ok) {
        if (res.status === 440) {
          auth?.logout();
        }
        const message = (data as ErrorRes).message || "unable to get message";
        throw new Error(`${res.status}: ${message}`);
      }
      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast &&
        toast({
          title: "An error occurred.",
          description: `${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      throw err;
    }
  }

  return { fetchAPI, isLoading };
};
