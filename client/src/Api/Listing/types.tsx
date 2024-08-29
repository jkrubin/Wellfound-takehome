export interface Listing {
  id: number;
  title: string;
  description: string;
  applicants: { id: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  listingId: number;
  candidateId: number;
}

export interface ListingContextType {
  listings: Listing[];
  fetchListings: () => Promise<void>;
  fetchListingById: (id: number) => Promise<Listing | undefined>;
  createListing: (title: string, description: string) => Promise<Listing>;
  updateListing: (
    id: number,
    title: string,
    description: string
  ) => Promise<Listing>;
  deleteListing: (id: number) => Promise<void>;
  assignToListing: (listingId: number, candidateId: number) => void;
  unassignToListing: (listingId: number, candidateId: number) => void;
}
