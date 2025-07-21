
export type Role = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: Role;
  penaltyPoints: number;
}

export type EquipmentCategory = 'Projector' | 'Camera' | 'Microphone' | 'Other';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  totalQuantity: number;
  status: 'Available' | 'Partially Available' | 'Unavailable' | 'Maintenance';
  imageUrl: string;
  aiHint: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  equipment: string[]; // list of equipment names
  imageUrl: string;
  aiHint: string;
}

export interface Reservation {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'equipment' | 'room';
  start: Date;
  end: Date;
  purpose?: string;
  status: 'Active' | 'Completed' | 'Overdue' | 'Pending' | 'Declined';
}
