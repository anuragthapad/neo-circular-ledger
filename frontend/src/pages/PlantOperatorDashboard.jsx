import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Progress } from '../components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Factory, Zap, Leaf, Package, TrendingUp, Gauge, Download, CalendarDays } from 'lucide-react';
import { WASTE_TYPES } from '../data/seedData';
import { toast } from 'sonner';
import { exportCSV, filterByDateRange } from '../utils/helpers';

const CHART_COLORS = ['#1B5E20', '#4CAF50', '#8D6E63', '#F57C00'];

export default function PlantOperatorDashboard({ subPage }) {
  const { currentUser, processingLogs, wasteEntries, addProcessingLog } = useApp();
  const [wardName, setWardName] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [wasteReceived, setWasteReceived] = useState('');
  const [wasteProcessed, setWasteProcessed] = useState('');

  const myLogs = processingLogs.filter(l => l.plantId === currentUser?.plantId);
  const totalReceived = myLogs.reduce((s, l) => s + l.wasteReceived, 0);
  const totalProcessed = myLogs.reduce((s, l) => s + l.wasteProcessed, 0);
  const totalCBG = myLogs.reduce((s, l) => s + l.cbgOutput, 0);
  const totalManure = myLogs.reduce((s, l) => s + l.manureGenerated, 0);
  const totalCredits = myLogs.reduce((s, l) => s + l.carbonCredits, 0);
  const capacity = 50000;
  const utilization = Math.min(100, Math.round((totalProcessed / capacity) * 100));
  const processRatio = totalReceived > 0 ? ((totalProcessed / totalReceived) * 100).toFixed(1) : 0;

  // Ward-wise aggregation
  const wardAgg = myLogs.reduce((acc, l) => {
    const existing = acc.find(a => a.ward === l.wardName);
    if (existing) { existing.received += l.wasteReceived; existing.processed += l.wasteProcessed; }
    else acc.push({ ward: l.wardName, received: l.wasteReceived, processed: l.wasteProcessed });
    return acc;
  }, []);

  // Revenue breakdown
  const revenueCBG = totalCBG * 50;
  const revenueManure = totalManure * 8;
  const revenueCredits = totalCredits * 1200;
  const revenueData = [
    { name: 'CBG Sales', value: Math.round(revenueCBG) },
    { name: 'Manure Sales', value: Math.round(revenueManure) },
    { name: 'Carbon Credits', value: Math.round(revenueCredits) },
  ].filter(d => d.value > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wardName || !wasteType || !wasteReceived || !wasteProcessed) return;
    addProcessingLog({
      wardName,
      wasteType,
      wasteReceived: parseFloat(wasteReceived),
      wasteProcessed: parseFloat(wasteProcessed),
    });
    toast.success('Processing log recorded!');
    setWardName('');
    setWasteType('');
    setWasteReceived('');
    setWasteProcessed('');
  };

  const wards = [...new Set(wasteEntries.map(e => e.wardName))];

  if (subPage === 'processing') {
    return (
      <div className="flex min-h-screen bg-[#F1F8E9]">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="Log Processing" subtitle="Record waste processing data" />
          <main className="p-8 max-w-[1600px] mx-auto">
            <Card className="border-[#8D6E63]/15 bg-white shadow-sm max-w-2xl">
              <CardHeader>
                <CardTitle className="text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  New Processing Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1.5 block">Ward</label>
                      <Select value={wardName} onValueChange={setWardName}>
                        <SelectTrigger data-testid="processing-ward-select" className="border-[#8D6E63]/30 bg-white">
                          <SelectValue placeholder="Select ward" />
                        </SelectTrigger>
                        <SelectContent>
                          {wards.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1.5 block">Waste Type</label>
                      <Select value={wasteType} onValueChange={setWasteType}>
                        <SelectTrigger data-testid="processing-type-select" className="border-[#8D6E63]/30 bg-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {WASTE_TYPES.map(wt => <SelectItem key={wt.value} value={wt.value}>{wt.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1.5 block">Waste Received (kg)</label>
                      <input
                        data-testid="waste-received-input"
                        type="number"
                        min="1"
                        value={wasteReceived}
                        onChange={e => setWasteReceived(e.target.value)}
                        placeholder="kg received"
                        className="w-full border border-[#8D6E63]/30 rounded-md px-3 py-2.5 bg-white text-[#1A1C1A] placeholder:text-[#758077] focus:ring-2 focus:ring-[#1B5E20]/50 focus:border-[#1B5E20] transition-colors text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1.5 block">Waste Processed (kg)</label>
                      <input
                        data-testid="waste-processed-input"
                        type="number"
                        min="1"
                        value={wasteProcessed}
                        onChange={e => setWasteProcessed(e.target.value)}
                        placeholder="kg processed"
                        className="w-full border border-[#8D6E63]/30 rounded-md px-3 py-2.5 bg-white text-[#1A1C1A] placeholder:text-[#758077] focus:ring-2 focus:ring-[#1B5E20]/50 focus:border-[#1B5E20] transition-colors text-sm"
                        required
                      />
                    </div>
                  </div>
                  <button
                    data-testid="submit-processing-log"
                    type="submit"
                    className="w-full bg-[#1B5E20] text-white hover:bg-[#144A18] rounded-md px-4 py-2.5 font-medium tracking-wide shadow-sm transition-colors text-sm"
                  >
                    Record Processing Log
                  </button>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  if (subPage === 'analytics') {
    return (
      <div className="flex min-h-screen bg-[#F1F8E9]">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="Analytics" subtitle="Detailed plant performance" />
          <main className="p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
                <CardHeader><CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Ward-wise Supply</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={wardAgg}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#8D6E63" strokeOpacity={0.1} />
                      <XAxis dataKey="ward" tick={{ fontSize: 12, fill: '#758077' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#758077' }} />
                      <Tooltip />
                      <Bar dataKey="received" fill="#4CAF50" name="Received (kg)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="processed" fill="#1B5E20" name="Processed (kg)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
                <CardHeader><CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Revenue Streams</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={revenueData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {revenueData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={v => `Rs ${v.toLocaleString('en-IN')}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (subPage === 'ledger') {
    return <PlantLedger myLogs={myLogs} />;
  }

  if (subPage === 'notifications') {
    return <PlantNotifications />;
  }

  // Dashboard
  return (
    <div className="flex min-h-screen bg-[#F1F8E9]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Plant Operator Dashboard" subtitle={currentUser?.name} />
        <main className="p-8 max-w-[1600px] mx-auto space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <KPI icon={Gauge} label="Utilization" value={`${utilization}%`} color="#1B5E20" />
            <KPI icon={Package} label="Total Received" value={`${totalReceived.toLocaleString('en-IN')} kg`} color="#4CAF50" />
            <KPI icon={Factory} label="CBG Output" value={`${totalCBG.toFixed(1)} kg`} color="#8D6E63" />
            <KPI icon={Leaf} label="Manure" value={`${totalManure.toFixed(1)} kg`} color="#F57C00" />
            <KPI icon={Zap} label="Carbon Credits" value={`${totalCredits.toFixed(2)} tCO2e`} color="#1B5E20" />
          </div>

          {/* Utilization bar */}
          <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#1A1C1A]">Capacity Utilization</span>
                <span className="text-sm font-bold text-[#1B5E20]">{utilization}%</span>
              </div>
              <Progress value={utilization} className="h-3 bg-[#E8F5E9] [&>div]:bg-[#4CAF50]" />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-[#758077]">Input/Output Ratio: {processRatio}%</span>
                <span className="text-xs text-[#758077]">Capacity: {capacity.toLocaleString('en-IN')} kg</span>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
              <CardHeader><CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Top Supplying Wards</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={wardAgg} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#8D6E63" strokeOpacity={0.1} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: '#758077' }} />
                    <YAxis dataKey="ward" type="category" tick={{ fontSize: 12, fill: '#758077' }} width={80} />
                    <Tooltip />
                    <Bar dataKey="received" fill="#4CAF50" radius={[0, 4, 4, 0]} name="Received (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
              <CardHeader><CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Revenue Streams</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'CBG Sales', value: revenueCBG, color: '#1B5E20' },
                    { label: 'Manure Sales', value: revenueManure, color: '#4CAF50' },
                    { label: 'Carbon Credits', value: revenueCredits, color: '#8D6E63' },
                  ].map(rev => (
                    <div key={rev.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#4A554C]">{rev.label}</span>
                        <span className="font-semibold" style={{ color: rev.color }}>
                          Rs {Math.round(rev.value).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="h-2 bg-[#E8F5E9] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (rev.value / Math.max(revenueCBG, revenueManure, revenueCredits, 1)) * 100)}%`,
                            backgroundColor: rev.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#8D6E63]/10">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-[#1A1C1A]">Total Revenue</span>
                      <span className="text-sm font-bold text-[#1B5E20]">
                        Rs {Math.round(revenueCBG + revenueManure + revenueCredits).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, color }) {
  return (
    <Card className="border-[#8D6E63]/15 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
            <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#758077] uppercase tracking-wide">{label}</p>
            <p data-testid={`kpi-${label.toLowerCase().replace(/\s+/g, '-')}`} className="text-base font-bold text-[#1A1C1A]" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PlantNotifications() {
  const { currentUser, notifications, markNotificationRead } = useApp();
  const myNotifs = notifications.filter(n => n.userId === currentUser?.id);
  return (
    <div className="flex min-h-screen bg-[#F1F8E9]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Notifications" subtitle="Plant alerts & updates" />
        <main className="p-8 max-w-[1600px] mx-auto">
          <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
            <CardContent className="p-0">
              {myNotifs.length === 0 ? (
                <p className="p-8 text-center text-sm text-[#758077]">No notifications</p>
              ) : (
                myNotifs.map(n => (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`w-full text-left px-6 py-4 border-b border-[#8D6E63]/10 hover:bg-[#F1F8E9]/50 transition-colors ${!n.read ? 'bg-[#E8F5E9]/30' : ''}`}
                  >
                    <p className={`text-sm ${!n.read ? 'font-semibold text-[#1A1C1A]' : 'text-[#4A554C]'}`}>{n.message}</p>
                    <p className="text-xs text-[#758077] mt-1">
                      {new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}


function PlantLedger({ myLogs }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => filterByDateRange(myLogs, 'timestamp', dateFrom, dateTo), [myLogs, dateFrom, dateTo]);

  const handleExport = () => {
    exportCSV(filtered, [
      { label: 'Date', accessor: (r) => new Date(r.timestamp).toLocaleDateString('en-IN') },
      { label: 'Ward', accessor: 'wardName' },
      { label: 'Waste Type', accessor: (r) => r.wasteType.replace('_', ' ') },
      { label: 'Received (kg)', accessor: 'wasteReceived' },
      { label: 'Processed (kg)', accessor: 'wasteProcessed' },
      { label: 'CBG Output (kg)', accessor: 'cbgOutput' },
      { label: 'Manure (kg)', accessor: 'manureGenerated' },
      { label: 'Carbon Credits', accessor: 'carbonCredits' },
    ], 'processing_ledger');
    toast.success('Processing ledger exported as CSV!');
  };

  return (
    <div className="flex min-h-screen bg-[#F1F8E9]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Processing Ledger" subtitle="All processing records" />
        <main className="p-8 max-w-[1600px] mx-auto space-y-4">
          {/* Date Filters + Export */}
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1 block">From</label>
              <div className="flex items-center gap-2 border border-[#8D6E63]/30 rounded-md px-3 py-2 bg-white">
                <CalendarDays className="w-4 h-4 text-[#758077]" strokeWidth={1.5} />
                <input data-testid="plant-date-from" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="bg-transparent text-sm text-[#1A1C1A] outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1 block">To</label>
              <div className="flex items-center gap-2 border border-[#8D6E63]/30 rounded-md px-3 py-2 bg-white">
                <CalendarDays className="w-4 h-4 text-[#758077]" strokeWidth={1.5} />
                <input data-testid="plant-date-to" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="bg-transparent text-sm text-[#1A1C1A] outline-none" />
              </div>
            </div>
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(''); setDateTo(''); }}
                className="px-3 py-2 text-xs font-medium text-[#8D6E63] hover:bg-[#8D6E63]/10 rounded-md transition-colors">
                Clear
              </button>
            )}
            <div className="ml-auto">
              <button data-testid="plant-export-csv" onClick={handleExport}
                className="flex items-center gap-2 bg-[#1B5E20] text-white hover:bg-[#144A18] rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm">
                <Download className="w-4 h-4" strokeWidth={1.5} /> Export CSV
              </button>
            </div>
          </div>

          <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F1F8E9]/50">
                    <TableHead className="text-[#4A554C]">Date</TableHead>
                    <TableHead className="text-[#4A554C]">Ward</TableHead>
                    <TableHead className="text-[#4A554C]">Type</TableHead>
                    <TableHead className="text-[#4A554C]">Received</TableHead>
                    <TableHead className="text-[#4A554C]">Processed</TableHead>
                    <TableHead className="text-[#4A554C]">CBG (kg)</TableHead>
                    <TableHead className="text-[#4A554C]">Manure (kg)</TableHead>
                    <TableHead className="text-[#4A554C]">Credits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center text-sm text-[#758077] py-8">No records found</TableCell></TableRow>
                  ) : (
                    filtered.map(log => (
                      <TableRow key={log.id} data-testid={`processing-row-${log.id}`}>
                        <TableCell className="text-sm text-[#4A554C]">
                          {new Date(log.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </TableCell>
                        <TableCell className="text-sm font-medium">{log.wardName}</TableCell>
                        <TableCell>
                          <Badge className="bg-[#E8F5E9] text-[#1B5E20] border-0 text-xs capitalize">{log.wasteType.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{log.wasteReceived.toLocaleString('en-IN')} kg</TableCell>
                        <TableCell className="text-sm">{log.wasteProcessed.toLocaleString('en-IN')} kg</TableCell>
                        <TableCell className="text-sm font-medium text-[#1B5E20]">{log.cbgOutput}</TableCell>
                        <TableCell className="text-sm font-medium text-[#8D6E63]">{log.manureGenerated}</TableCell>
                        <TableCell className="text-sm font-medium text-[#1B5E20]">{log.carbonCredits}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="text-xs text-[#758077]">{filtered.length} records shown</p>
        </main>
      </div>
    </div>
  );
}
