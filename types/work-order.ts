export type WorkOrder = {
    id: string;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    status: "Open" | "In Progress" | "Done";
    updatedAt: string;
};