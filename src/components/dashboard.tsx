'use client';

import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import type { DentalCase } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useMemo } from 'react';

interface DashboardProps {
  cases: DentalCase[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

export default function Dashboard({ cases }: DashboardProps) {
  const casesByDentist = useMemo(() => {
    if (!cases) return [];
    const counts = cases.reduce((acc, c) => {
      acc[c.dentistName] = (acc[c.dentistName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, cases: value }));
  }, [cases]);

  const prosthesisTypeDistribution = useMemo(() => {
    if (!cases) return [];
    const counts = cases.reduce((acc, c) => {
      acc[c.prosthesisType] = (acc[c.prosthesisType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [cases]);
  
  const materialUsage = useMemo(() => {
    if (!cases) return [];
    const counts = cases.reduce((acc, c) => {
        const materials = c.material.split(',').map(m => m.trim()).filter(m => m);
        materials.forEach(material => {
            acc[material] = (acc[material] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, count: value }));
  }, [cases]);


  if (cases.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle>Cases per Dentist</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={casesByDentist}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="cases" fill="hsl(var(--primary))" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Prosthesis Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={prosthesisTypeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {prosthesisTypeDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Material Usage</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                     <BarChart data={materialUsage} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={80} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="hsl(var(--accent))" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  );
}
