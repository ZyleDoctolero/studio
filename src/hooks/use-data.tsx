
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
  updateEquipment: (equipmentId: string, updatedData: Partial<Omit<Equipment, 'id'>>) => void;
  deleteEquipment: (equipmentId: string) => void;
  addRoom: (newRoom: Omit<Room, 'id'>) => void;
  updateRoom: (roomId: string, updatedData: Partial<Omit<Room, 'id'>>) => void;
  deleteRoom: (roomId: string) => void;
  addUser: (newUser: Omit<User, 'id' | 'penaltyPoints'>) => void;
  updateUser: (userId: string, updatedData: Partial<Omit<User, 'id'>>) => void;
  deleteUser: (userId: string) => void;
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
            id: crypto.randomUUID(),
            status: 'Available',
        };
        return [...prev, newEquipment]
    });
    toast({
        title: "Success!",
        description: `Successfully added ${newEquipmentData.name}.`
    })
  }, [toast]);

  const updateEquipment = useCallback((equipmentId: string, updatedData: Partial<Omit<Equipment, 'id'>>) => {
    setEquipment(prev =>
      prev.map(item =>
        item.id === equipmentId ? { ...item, ...updatedData } : item
      )
    );
    const updatedName = updatedData.name || equipment.find(e => e.id === equipmentId)?.name;
    toast({
        title: "Success!",
        description: `Successfully updated ${updatedName}.`
    })
  }, [toast, equipment]);
  
  const deleteEquipment = useCallback((equipmentId: string) => {
    const equipmentToDelete = equipment.find(e => e.id === equipmentId);
    setEquipment(prev => prev.filter(e => e.id !== equipmentId));
    toast({
        title: "Equipment Deleted",
        description: `Successfully deleted ${equipmentToDelete?.name}.`,
        variant: 'destructive'
    });
  }, [toast, equipment]);
  
  const addRoom = useCallback((newRoomData: Omit<Room, 'id'>) => {
    setRooms(prev => {
        const newRoom: Room = {
            ...newRoomData,
            id: crypto.randomUUID(),
        };
        return [...prev, newRoom]
    });
    toast({
        title: "Success!",
        description: `Successfully added ${newRoomData.name}.`
    })
  }, [toast]);

  const updateRoom = useCallback((roomId: string, updatedData: Partial<Omit<Room, 'id'>>) => {
    setRooms(prev =>
      prev.map(item =>
        item.id === roomId ? { ...item, ...updatedData } : item
      )
    );
    toast({
        title: "Success!",
        description: `Successfully updated ${updatedData.name}.`
    })
  }, [toast]);

  const deleteRoom = useCallback((roomId: string) => {
    const roomToDelete = rooms.find(r => r.id === roomId);
    setRooms(prev => prev.filter(r => r.id !== roomId));
    toast({
        title: "Room Deleted",
        description: `Successfully deleted ${roomToDelete?.name}.`,
        variant: 'destructive'
    });
  }, [toast, rooms]);

  const addUser = useCallback((newUserData: Omit<User, 'id' | 'penaltyPoints'>) => {
    setUsers(prev => {
      const newUser: User = {
        ...newUserData,
        id: crypto.randomUUID(),
        penaltyPoints: 0,
      };
      return [...prev, newUser]
    });
    toast({
        title: "Success!",
        description: `Successfully added user ${newUserData.name}.`
    })
  }, [toast]);
  
  const updateUser = useCallback((userId: string, updatedData: Partial<Omit<User, 'id'>>) => {
    setUsers(prev =>
      prev.map(item =>
        item.id === userId ? { ...item, ...updatedData } : item
      )
    );
    const updatedUser = users.find(u => u.id === userId);
    toast({
        title: "Success!",
        description: `Successfully updated ${updatedUser?.name}.`
    })
  }, [toast, users]);


  const deleteUser = useCallback((userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
     toast({
        title: "User Deleted",
        description: `Successfully deleted ${userToDelete?.name}.`,
        variant: 'destructive'
    });
  }, [toast, users]);

  const addReservation = useCallback((itemId: string, userId: string, start: Date, end: Date, itemType: 'equipment' | 'room') => {
    setReservations(prev => {
        const newReservation: Reservation = {
            id: crypto.randomUUID(),
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
    updateEquipment,
    deleteEquipment,
    addRoom,
    updateRoom,
    deleteRoom,
    addUser,
    updateUser,
    deleteUser,
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
