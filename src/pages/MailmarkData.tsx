
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

// Sample data for the handover performance
const handoverData = [
  { name: 'Day 1', value: 40, color: '#4ade80' }, // Green
  { name: 'Day 2', value: 30, color: '#facc15' }, // Yellow
  { name: 'Day 3', value: 15, color: '#fb923c' }, // Orange
  { name: 'Older', value: 10, color: '#ef4444' }, // Red
  { name: 'Not Handed Over', value: 5, color: '#6b7280' }, // Gray
];

const MailmarkData: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-jobRed">Mailmark Direct Data</h1>
            <p className="text-sm text-jobGray-dark">
              Analysis of handover performance metrics
            </p>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Handover Performance</CardTitle>
                  <CardDescription>
                    Distribution of mail items by handover timing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={handoverData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {handoverData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} items`, 'Volume']}
                        />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom"
                          align="center"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default MailmarkData;
