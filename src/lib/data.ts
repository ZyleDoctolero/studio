import type { User, Equipment, Room, Reservation } from './types';

export const users: User[] = [
  { id: '1', name: 'Student User', username: 'student', password: 'student123', role: 'student', penaltyPoints: 0 },
  { id: '2', name: 'Faculty Member', username: 'teacher', password: 'teacher123', role: 'faculty', penaltyPoints: 0 },
  { id: '3', name: 'Admin User', username: 'admin', password: 'admin123', role: 'admin', penaltyPoints: 0 },
];

export const equipment: Equipment[] = [
    { id: 'e1', name: 'EPSON Projector EX3280', category: 'Projector', totalQuantity: 10, status: 'Available', imageUrl: 'https://placehold.co/600x400.png', aiHint: 'projector classroom' },
    { id: 'e2', name: 'Canon EOS R5', category: 'Camera', totalQuantity: 5, status: 'Available', imageUrl: 'https://placehold.co/600x400.png', aiHint: 'dslr camera' },
    { id: 'e3', name: 'Sony a7 IV', category: 'Camera', totalQuantity: 3, status: 'Available', imageUrl: 'https://placehold.co/600x400.png', aiHint: 'mirrorless camera' },
    { id: 'e4', name: 'Shure SM58 Wireless Mic', category: 'Microphone', totalQuantity: 15, status: 'Available', imageUrl: 'https://placehold.co/600x400.png', aiHint: 'wireless microphone' },
    { id: 'e5', 'name': 'Rode Wireless Go II', category: 'Microphone', totalQuantity: 8, status: 'Available', imageUrl: 'https://placehold.co/600x400.png', aiHint: 'lavalier microphone' },
    { id: 'e6', name: 'Tripod Stand', category: 'Other', totalQuantity: 20, status: 'Available', imageUrl: 'https://placehold.co/600x400.png', aiHint: 'camera tripod' },
];

export const rooms: Room[] = [
  { id: 'r1', name: 'AV Room 1', capacity: 30, equipment: ['EPSON Projector EX3280', 'Whiteboard'], imageUrl: 'https://placehold.co/600x400.png', aiHint: 'seminar room' },
  { id: 'r2', name: 'AV Room 2', capacity: 50, equipment: ['EPSON Projector EX3280', 'Podium with Mic'], imageUrl: 'https://placehold.co/600x400.png', aiHint: 'lecture hall' },
  { id: 'r3', name: 'Recording Studio', capacity: 5, equipment: ['Sony a7 IV', 'Rode Wireless Go II', 'Green Screen'], imageUrl: 'https://placehold.co/600x400.png', aiHint: 'recording studio' },
];

export const reservations: Reservation[] = [
  { id: 'res1', userId: '1', itemId: 'e2', itemType: 'equipment', start: new Date(new Date().setDate(new Date().getDate() - 2)), end: new Date(new Date().setDate(new Date().getDate() - 1)), status: 'Completed' },
  { id: 'res2', userId: '1', itemId: 'e4', itemType: 'equipment', start: new Date(), end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), status: 'Active' },
  { id: 'res3', userId: '2', itemId: 'r1', itemType: 'room', start: new Date(), end: new Date(new Date().getTime() + 3 * 60 * 60 * 1000), status: 'Active' },
];
