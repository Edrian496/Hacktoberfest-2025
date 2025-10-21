export interface Campaign {
  id: number;
  title: string;
  description: string;
  location: string;
  status: "Urgent" | "Active" | "Ongoing";
  amountRaised: string;
  image: string;
}