
'use client';

import React, { createContext, useState, useContext, useCallback } from 'react';
import { equipment as initialEquipment, rooms as initialRooms, reservations as initialReservations, users as initialUsers } from '@/lib/data';
import type { Equipment, Room, Reservation, User } from '@/lib/types';
import { useToast } from './use-toast';

interface DataContextType {
  equipment: Equipment[];
  rooms: Room[];
  reservations: Reservation[];
  users: User[];
  addEquipment: (newEquipment: Omit<Equipment, 'id' | 'status'>) => void;
  addReservation: (itemId: string, userId: string, start: Date, end: Date, itemType: 'equipment' | 'room') => void;
  approveReservation: (reservationId: string) => void;
  declineReservation: (reservationId: string) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();

  const addEquipment = useCallback((newEquipmentData: Omit<Equipment, 'id' | 'status'>) => {
    setEquipment(prev => {
        const newEquipment: Equipment = {
            ...newEquipmentData,
            id: `e${prev.length + 1}`,
            status: 'Available',
        };
        return [...prev, newEquipment]
    });
    toast({
        title: "Success!",
        description: `Successfully added ${newEquipmentData.name}.`
    })
  }, [toast]);

  const addReservation = useCallback((itemId: string, userId: string, start: Date, end: Date, itemType: 'equipment' | 'room') => {
    setReservations(prev => {
        const newReservation: Reservation = {
            id: `res${prev.length + 1}`,
            itemId,
            userId,
            start,
            end,
            itemType,
            status: 'Pending',
        };
        return [...prev, newReservation];
    });
    const itemName = itemType === 'equipment' 
        ? equipment.find(e => e.id === itemId)?.name 
        : rooms.find(r => r.id === itemId)?.name;
    toast({
        title: "Request Submitted!",
        description: `Your reservation request for ${itemName} has been submitted for approval.`
    })
  }, [toast, equipment, rooms]);

  const approveReservation = useCallback((reservationId: string) => {
    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'Active' } : r));
    toast({
        title: "Reservation Approved",
        description: "The reservation is now active."
    });
  }, [toast]);

    const declineReservation = useCallback((reservationId: string) => {
    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'Declined' } : r));
    toast({
        title: "Reservation Declined",
        variant: "destructive",
        description: "The reservation has been declined."
    });
    }, [toast]);

  const value = {
    equipment,
    rooms,
    reservations,
    users,
    addEquipment,
    addReservation,
    approveReservation,
    declineReservation,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
