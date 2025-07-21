
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
  // Add other functions for updating data here
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

  const value = {
    equipment,
    rooms,
    reservations,
    addEquipment,
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
