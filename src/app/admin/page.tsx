
'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useData } from '@/hooks/use-data';

export default function AdminDashboardPage() {
    const { equipment, rooms, reservations } = useData();

    const totalReservations = reservations.length;
    const activeReservations = reservations.filter(r => r.status === 'Active').length;
    const overdueItems = reservations.filter(r => r.status === 'Overdue').length;

    const equipmentUsageData = equipment.map(e => ({
        name: e.name.substring(0, 15) + (e.name.length > 15 ? '...' : ''),
        usage: reservations.filter(r => r.itemId === e.id).length
    }));

    const roomOccupancyData = rooms.map(room => ({
        name: room.name,
        bookings: reservations.filter(r => r.itemId === room.id).length,
    }));
    
  return (
    <div>
      <PageHeader
        title="System Analytics"
        description="An overview of resource usage and system status."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservations}</div>
            <p className="text-xs text-muted-foreground">All-time reservation count</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Checkouts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReservations}</div>
            <p className="text-xs text-muted-foreground">Items currently on loan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueItems}</div>
            <p className="text-xs text-muted-foreground">Items past their due date</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipment.length}</div>
            <p className="text-xs text-muted-foreground">Total types of equipment</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className='font-headline tracking-normal'>Equipment Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={equipmentUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}} />
                <Legend />
                <Bar dataKey="usage" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='font-headline tracking-normal'>Room Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roomOccupancyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))"/>
                    <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}} />
                    <Legend />
                    <Bar dataKey="bookings" fill="hsl(var(--accent))" />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
