export interface Disaster {
    id: string;
    title: string;
    location: string;
    description: string;
    date?: string;
    status: "active" | "completed";
    fundsRaised?: number;
    fundGoal?: number;
    isVerified?: boolean; 
}
