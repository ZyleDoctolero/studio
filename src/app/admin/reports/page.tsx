
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import React from 'react';
import { Label } from '@/components/ui/label';

export default function AdminReportsPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div>
      <PageHeader
        title="Reporting"
        description="Generate and export usage reports for analysis."
      />
      <Card>
        <CardHeader>
          <CardTitle className='font-headline tracking-normal'>Generate Report</CardTitle>
          <CardDescription>
            Select a report type and date range to generate and export data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="report-type">Report Type</Label>
              <Select>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select a report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usage">Equipment Usage</SelectItem>
                  <SelectItem value="occupancy">Room Occupancy</SelectItem>
                  <SelectItem value="penalties">User Penalties</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="date-range">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-range"
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
