
'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useData } from '@/hooks/use-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { User } from '@/lib/types';
import { AddUserForm } from '@/components/admin/add-user-form';
import { EditUserForm } from '@/components/admin/edit-user-form';
import { AdjustPenaltyForm } from '@/components/admin/adjust-penalty-form';

export default function AdminUsersPage() {
  const { users, addUser, updateUser, deleteUser } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = React.useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const handleAddUser = (newUser: Omit<User, 'id' | 'penaltyPoints'>) => {
    addUser(newUser);
    setIsAddModalOpen(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    updateUser(updatedUser.id, updatedUser);
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };
  
  const handlePenaltyUpdate = (userId: string, penaltyPoints: number) => {
    updateUser(userId, { penaltyPoints });
    setIsPenaltyModalOpen(false);
    setSelectedUser(null);
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openPenaltyModal = (user: User) => {
    setSelectedUser(user);
    setIsPenaltyModalOpen(true);
  };

  const openDeleteAlert = (user: User) => {
    setSelectedUser(user);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
      setIsDeleteAlertOpen(false);
      setSelectedUser(null);
    }
  };


  return (
    <div>
      <PageHeader
        title="User Management"
        description="View and manage all user accounts in the system."
      >
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
                <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <AddUserForm onSubmit={handleAddUser} onCancel={() => setIsAddModalOpen(false)} />
            </DialogContent>
        </Dialog>
      </PageHeader>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Penalty Points</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://avatar.vercel.sh/${user.username}.png`} alt={`@${user.username}`} />
                        <AvatarFallback>{user.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                    </Avatar>
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      user.penaltyPoints > 0 ? 'text-destructive' : ''
                    }
                  >
                    {user.penaltyPoints}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => openEditModal(user)}>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>View Activity</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => openPenaltyModal(user)}>Adjust Penalties</DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onSelect={() => openDeleteAlert(user)}
                      >
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

       <Dialog open={isEditModalOpen} onOpenChange={(isOpen) => { setIsEditModalOpen(isOpen); if (!isOpen) setSelectedUser(null);}}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {selectedUser && (
                <EditUserForm
                    user={selectedUser}
                    onSubmit={handleUpdateUser}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </DialogContent>
      </Dialog>
      
       <Dialog open={isPenaltyModalOpen} onOpenChange={(isOpen) => { setIsPenaltyModalOpen(isOpen); if (!isOpen) setSelectedUser(null);}}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Adjust Penalties for {selectedUser?.name}</DialogTitle>
            </DialogHeader>
            {selectedUser && (
                <AdjustPenaltyForm
                    user={selectedUser}
                    onSubmit={handlePenaltyUpdate}
                    onCancel={() => {
                        setIsPenaltyModalOpen(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user "{selectedUser?.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
