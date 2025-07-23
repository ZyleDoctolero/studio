
'use client';

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { equipment as initialEquipment, rooms as initialRooms, reservations as initialReservations, users as initialUsers } from '@/lib/data';
import type { Equipment, Room, Reservation, User } from '@/lib/types';
import { useToast } from './use-toast';

// Helper to get data from localStorage
const getFromStorage = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') {
        return fallback;
    }
    try {
        const item = window.localStorage.getItem(key);
        if (item) {
            // Special handling for dates
            return JSON.parse(item, (key, value) => {
                if (key === 'start' || key === 'end') {
                    return new Date(value);
                }
                return value;
            });
        }
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
    }
    return fallback;
};

// Helper to set data to localStorage
const setToStorage = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

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
    const [users, setUsers] = useState<User[]>(() => getFromStorage('uic_users', initialUsers));
    const [equipment, setEquipment] = useState<Equipment[]>(() => getFromStorage('uic_equipment', initialEquipment));
    const [rooms, setRooms] = useState<Room[]>(() => getFromStorage('uic_rooms', initialRooms));
    const [reservations, setReservations] = useState<Reservation[]>(() => getFromStorage('uic_reservations', initialReservations));
    const { toast } = useToast();
    
    // Persist to localStorage on change
    useEffect(() => { setToStorage('uic_users', users); }, [users]);
    useEffect(() => { setToStorage('uic_equipment', equipment); }, [equipment]);
    useEffect(() => { setToStorage('uic_rooms', rooms); }, [rooms]);
    useEffect(() => { setToStorage('uic_reservations', reservations); }, [reservations]);


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
    let updatedName = '';
    setEquipment(prev =>
      prev.map(item => {
        if (item.id === equipmentId) {
            updatedName = updatedData.name || item.name;
            return { ...item, ...updatedData };
        }
        return item;
      })
    );
    
    toast({
        title: "Success!",
        description: `Successfully updated ${updatedName}.`
    })
  }, [toast]);
  
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
    let roomName = '';
    setRooms(prev =>
      prev.map(item => {
        if (item.id === roomId) {
            roomName = updatedData.name || item.name;
            return { ...item, ...updatedData };
        }
        return item;
      })
    );
    toast({
        title: "Success!",
        description: `Successfully updated ${roomName}.`
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
    let userName = '';
    setUsers(prev =>
      prev.map(item => {
        if (item.id === userId) {
            userName = updatedData.name || item.name;
            return { ...item, ...updatedData };
        }
        return item;
      })
    );
    toast({
        title: "Success!",
        description: `Successfully updated ${userName}.`
    })
  }, [toast]);


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
