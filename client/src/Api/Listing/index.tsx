import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";
import { Application, Listing, ListingContextType } from "./types";
import { useApi } from "..";

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { fetchAPI } = useApi();
  const [listings, setListings] = useState<Listing[]>([]);

  const fetchListings = async () => {
    try {
      const data = await fetchAPI<Listing[]>("listing");
      setListings(data);
    } catch (err) {
      console.error("Failed to fetch listings", err);
    }
  };

  const fetchListingById = async (id: number) => {
    try {
      const data = await fetchAPI<Listing>(`listing/${id}`);
      return data;
    } catch (err) {
      console.error("Failed to fetch listing", err);
      throw err;
    }
  };

  const createListing = async (title: string, description: string) => {
    try {
      const newListing = await fetchAPI<Listing>("listing", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      newListing.applicants = [];
      setListings((prev) => [newListing, ...prev]);
      return newListing;
    } catch (err) {
      console.error("Failed to create listing", err);
      throw err;
    }
  };

  const updateListing = async (
    id: number,
    title: string,
    description: string
  ) => {
    try {
      let updatedListing = await fetchAPI<Listing>(`listing/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, description }),
      });

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? { ...updatedListing, applicants: [...listing.applicants] }
            : listing
        )
      );
      return updatedListing;
    } catch (err) {
      console.error("Failed to update listing", err);
      throw err;
    }
  };

  const deleteListing = async (id: number) => {
    try {
      await fetchAPI<void>(`listing/${id}`, {
        method: "DELETE",
      });
      setListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch (err) {
      console.error("Failed to delete listing", err);
      throw err;
    }
  };

  const assignToListing = async (listingId: number, candidateId: number) => {
    try {
      const application = await fetchAPI<Application>(
        `listing/${listingId}/assign/${candidateId}`,
        {
          method: "POST",
        }
      );
      setListings((prev) => {
        return prev.map((listing) => {
          if (listing.id === application.listingId) {
            listing.applicants.push({ id: candidateId });
          }
          return listing;
        });
      });
      return application;
    } catch (err) {
      console.error("Failed to apply candidate to listing", err);
      throw err;
    }
  };

  const unassignToListing = async (listingId: number, candidateId: number) => {
    try {
      await fetchAPI<any>(`listing/${listingId}/unassign/${candidateId}`, {
        method: "POST",
      });
      setListings((prev) => {
        return prev.map((listing) => {
          if (listing.id === listingId) {
            listing.applicants = listing.applicants.filter(
              (candidate) => candidate.id !== candidateId
            );
          }
          return listing;
        });
      });
    } catch (err) {
      console.error("Failed to unapply candidate from listing", err);
      throw err;
    }
  };

  return (
    <ListingContext.Provider
      value={{
        listings,
        fetchListings,
        fetchListingById,
        createListing,
        updateListing,
        deleteListing,
        assignToListing,
        unassignToListing,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
};

export const useListingContext = () => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error("useListingContext must be used within a ListingProvider");
  }
  return context;
};
