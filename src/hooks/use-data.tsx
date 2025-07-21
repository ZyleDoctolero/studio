
'use client';

import React, { createContext, useState, useContext, useCallback } from 'react';
import { equipment as initialEquipment, rooms as initialRooms, reservations as initialReservations } from '@/lib/data';
import type { Equipment, Room, Reservation } from '@/lib/types';
import { useToast } from './use-toast';

interface DataContextType {
  equipment: Equipment[];
  rooms: Room[];
  reservations: Reservation[];
  addEquipment: (newEquipment: Omit<Equipment, 'id' | 'status'>) => void;
  addReservation: (itemId: string, userId: string, start: Date, end: Date, itemType: 'equipment' | 'room') => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
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
            status: 'Active',
        };
        return [...prev, newReservation];
    });
    const itemName = itemType === 'equipment' 
        ? equipment.find(e => e.id === itemId)?.name 
        : rooms.find(r => r.id === itemId)?.name;
    toast({
        title: "Reservation Successful!",
        description: `You have successfully reserved ${itemName}.`
    })
  }, [toast, equipment, rooms]);

  const value = {
    equipment,
    rooms,
    reservations,
    addEquipment,
    addReservation,
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
