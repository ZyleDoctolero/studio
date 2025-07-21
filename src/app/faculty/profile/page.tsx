
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useData } from '@/hooks/use-data';

export default function FacultyProfilePage() {
  const { user } = useAuth();
  const { reservations, equipment, rooms } = useData();
  
  if (!user) return null;

  const userReservations = reservations.filter(r => r.userId === user.id);

  const getItemName = (itemId: string, itemType: 'equipment' | 'room') => {
    const source = itemType === 'equipment' ? equipment : rooms;
    return source.find(item => item.id === itemId)?.name || 'Unknown Item';
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="My Profile"
        description="View your personal information and reservation history."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className='font-headline tracking-normal'>My Information</CardTitle>
            <CardDescription>Details about your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Username</p>
              <p>{user.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p className="capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Penalty Points</p>
              <p className="text-lg font-bold text-destructive">{user.penaltyPoints}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className='font-headline tracking-normal'>Reservation History</CardTitle>
            <CardDescription>A log of your current and past reservations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userReservations.length > 0 ? (
                  userReservations.map(res => (
                    <TableRow key={res.id}>
                      <TableCell>{getItemName(res.itemId, res.itemType)}</TableCell>
                      <TableCell className='capitalize'>{res.itemType}</TableCell>
                      <TableCell>{format(res.start, 'MMM d, yyyy h:mm a')}</TableCell>
                      <TableCell>{format(res.end, 'MMM d, yyyy h:mm a')}</TableCell>
                      <TableCell>
                        <Badge variant={res.status === 'Active' ? 'default' : res.status === 'Overdue' ? 'destructive' : 'secondary'}>
                          {res.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No reservations found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
