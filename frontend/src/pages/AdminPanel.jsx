import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, BarChart3, Settings, Leaf, Factory, TrendingUp, ShieldCheck, Zap, IndianRupee, Scale, Download, CalendarDays } from 'lucide-react';
import { exportCSV, filterByDateRange } from '../utils/helpers';
import { toast } from 'sonner';

const CHART_COLORS = ['#1B5E20', '#4CAF50', '#8D6E63', '#F57C00'];
const ROLE_COLORS = { ward: '#4CAF50', plant: '#1B5E20', investor: '#8D6E63', admin: '#1A1C1A' };
const ROLE_ICONS = { ward: Leaf, plant: Factory, investor: TrendingUp, admin: ShieldCheck };
const ROLE_LABELS = { ward: 'Village Ward', plant: 'Plant Operator', investor: 'Investor', admin: 'Admin' };

export default function AdminPanel({ subPage }) {
  const { users, wasteEntries, processingLogs, investments, plants, notifications } = useApp();
  const [ledgerFilter, setLedgerFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const totalWaste = wasteEntries.reduce((s, e) => s + e.quantity, 0);
  const totalCredits = wasteEntries.reduce((s, e) => s + e.carbonCredits, 0);
  const totalRevenue = wasteEntries.reduce((s, e) => s + e.payment, 0);
  const totalInvested = investments.reduce((s, inv) => s + inv.amount, 0);
  const totalProcessed = processingLogs.reduce((s, l) => s + l.wasteProcessed, 0);
  const totalCBG = processingLogs.reduce((s, l) => s + l.cbgOutput, 0);

  if (subPage === 'users') {
    const roleCounts = users.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="flex min-h-screen bg-[#F1F8E9]">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="User Management" subtitle={`${users.length} registered users`} />
          <main className="p-8 max-w-[1600px] mx-auto space-y-6">
            {/* Role Summary */}
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(roleCounts).map(([role, count]) => {
                const Icon = ROLE_ICONS[role] || Users;
                return (
                  <Card key={role} className="border-[#8D6E63]/15 bg-white shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${ROLE_COLORS[role]}15` }}>
                        <Icon className="w-4 h-4" style={{ color: ROLE_COLORS[role] }} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-xs text-[#758077] font-semibold uppercase">{ROLE_LABELS[role] || role}</p>
                        <p className="text-lg font-bold text-[#1A1C1A]" style={{ fontFamily: "'Outfit', sans-serif" }}>{count}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Users Table */}
            <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F1F8E9]/50">
                      <TableHead className="text-[#4A554C]">Name</TableHead>
                      <TableHead className="text-[#4A554C]">Email</TableHead>
                      <TableHead className="text-[#4A554C]">Role</TableHead>
                      <TableHead className="text-[#4A554C]">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                        <TableCell className="text-sm font-medium text-[#1A1C1A]">{user.name}</TableCell>
                        <TableCell className="text-sm text-[#4A554C]">{user.email}</TableCell>
                        <TableCell>
                          <Badge className="border-0 text-xs text-white" style={{ backgroundColor: ROLE_COLORS[user.role] }}>
                            {ROLE_LABELS[user.role] || user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-[#758077]">
                          {user.ward ? `Ward: ${user.ward}` : user.plantId ? `Plant: ${user.plantId}` : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  if (subPage === 'ledger') {
    // Combined ledger
    const allTransactions = [
      ...wasteEntries.map(e => ({ ...e, txType: 'waste_supply', date: e.timestamp })),
      ...processingLogs.map(l => ({ ...l, txType: 'processing', date: l.timestamp })),
      ...investments.map(inv => ({ ...inv, txType: 'investment', date: inv.timestamp })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const typeFiltered = ledgerFilter === 'all' ? allTransactions : allTransactions.filter(t => t.txType === ledgerFilter);
    const filtered = filterByDateRange(typeFiltered, 'date', dateFrom, dateTo);

    const handleExport = () => {
      exportCSV(filtered, [
        { label: 'Date', accessor: (r) => new Date(r.date).toLocaleDateString('en-IN') },
        { label: 'Type', accessor: (r) => r.txType === 'waste_supply' ? 'Supply' : r.txType === 'processing' ? 'Processing' : 'Investment' },
        { label: 'Details', accessor: (r) => r.txType === 'waste_supply' ? `${r.wardName} - ${r.wasteType}` : r.txType === 'processing' ? `${r.wardName} - ${r.wasteType}` : r.plantName },
        { label: 'Amount', accessor: (r) => r.txType === 'waste_supply' ? `${r.quantity} kg / Rs ${r.payment}` : r.txType === 'processing' ? `${r.wasteProcessed} kg` : `Rs ${r.amount}` },
      ], 'all_transactions');
      toast.success('Transactions exported as CSV!');
    };

    return (
      <div className="flex min-h-screen bg-[#F1F8E9]">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="All Transactions" subtitle="System-wide ledger" />
          <main className="p-8 max-w-[1600px] mx-auto space-y-4">
            {/* Type filters */}
            <div className="flex flex-wrap gap-2">
              {['all', 'waste_supply', 'processing', 'investment'].map(f => (
                <button
                  key={f}
                  data-testid={`ledger-filter-${f}`}
                  onClick={() => setLedgerFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    ledgerFilter === f
                      ? 'bg-[#1B5E20] text-white'
                      : 'bg-white border border-[#8D6E63]/15 text-[#4A554C] hover:bg-[#1B5E20]/5'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'waste_supply' ? 'Waste Supply' : f === 'processing' ? 'Processing' : 'Investments'}
                </button>
              ))}
            </div>

            {/* Date Filters + Export */}
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1 block">From</label>
                <div className="flex items-center gap-2 border border-[#8D6E63]/30 rounded-md px-3 py-2 bg-white">
                  <CalendarDays className="w-4 h-4 text-[#758077]" strokeWidth={1.5} />
                  <input data-testid="admin-date-from" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                    className="bg-transparent text-sm text-[#1A1C1A] outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1 block">To</label>
                <div className="flex items-center gap-2 border border-[#8D6E63]/30 rounded-md px-3 py-2 bg-white">
                  <CalendarDays className="w-4 h-4 text-[#758077]" strokeWidth={1.5} />
                  <input data-testid="admin-date-to" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
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
                <button data-testid="admin-export-csv" onClick={handleExport}
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
                      <TableHead className="text-[#4A554C]">Type</TableHead>
                      <TableHead className="text-[#4A554C]">Details</TableHead>
                      <TableHead className="text-[#4A554C]">Amount / Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center text-sm text-[#758077] py-8">No transactions found</TableCell></TableRow>
                    ) : (
                      filtered.slice(0, 50).map((tx, i) => (
                        <TableRow key={`${tx.txType}-${tx.id || i}`}>
                          <TableCell className="text-sm text-[#4A554C]">
                            {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </TableCell>
                          <TableCell>
                            <Badge className={`border-0 text-xs ${
                              tx.txType === 'waste_supply' ? 'bg-[#E8F5E9] text-[#1B5E20]' :
                              tx.txType === 'processing' ? 'bg-[#FFF8E1] text-[#F57C00]' :
                              'bg-[#E3F2FD] text-[#0288D1]'
                            }`}>
                              {tx.txType === 'waste_supply' ? 'Supply' : tx.txType === 'processing' ? 'Processing' : 'Investment'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-[#4A554C]">
                            {tx.txType === 'waste_supply' ? `${tx.wardName} — ${tx.wasteType?.replace('_', ' ')}` :
                             tx.txType === 'processing' ? `${tx.wardName} — ${tx.wasteType?.replace('_', ' ')}` :
                             tx.plantName}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {tx.txType === 'waste_supply' ? `${tx.quantity?.toLocaleString('en-IN')} kg / Rs ${tx.payment?.toLocaleString('en-IN')}` :
                             tx.txType === 'processing' ? `${tx.wasteProcessed?.toLocaleString('en-IN')} kg processed` :
                             `Rs ${tx.amount?.toLocaleString('en-IN')}`}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <p className="text-xs text-[#758077]">{filtered.length} transactions shown</p>
          </main>
        </div>
      </div>
    );
  }

  if (subPage === 'analytics') {
    const wasteByType = [
      { name: 'Stubble', value: wasteEntries.filter(e => e.wasteType === 'stubble').reduce((s, e) => s + e.quantity, 0) },
      { name: 'Cow Dung', value: wasteEntries.filter(e => e.wasteType === 'cow_dung').reduce((s, e) => s + e.quantity, 0) },
      { name: 'Biodegradable', value: wasteEntries.filter(e => e.wasteType === 'biodegradable').reduce((s, e) => s + e.quantity, 0) },
    ].filter(d => d.value > 0);

    const plantComparison = plants.map(p => ({
      name: p.name.split(' ')[0],
      utilization: p.currentUtilization,
      roi: p.roi,
      performance: p.performance,
    }));

    return (
      <div className="flex min-h-screen bg-[#F1F8E9]">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="System Analytics" subtitle="Platform-wide metrics" />
          <main className="p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
                <CardHeader><CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Waste Composition</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={wasteByType} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {wasteByType.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={v => `${v.toLocaleString('en-IN')} kg`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
                <CardHeader><CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Plant Comparison</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={plantComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#8D6E63" strokeOpacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#758077' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#758077' }} />
                      <Tooltip />
                      <Bar dataKey="utilization" fill="#4CAF50" name="Utilization %" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="performance" fill="#1B5E20" name="Performance" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (subPage === 'settings') {
    return (
      <div className="flex min-h-screen bg-[#F1F8E9]">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="Settings" subtitle="System configuration" />
          <main className="p-8 max-w-[1600px] mx-auto">
            <Card className="border-[#8D6E63]/15 bg-white shadow-sm max-w-xl">
              <CardContent className="p-6">
                <p className="text-sm text-[#758077]">System settings will be available here. Currently running in demo mode with localStorage persistence.</p>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between py-2 border-b border-[#8D6E63]/10">
                    <span className="text-sm text-[#4A554C]">Data Storage</span>
                    <Badge className="bg-[#E8F5E9] text-[#1B5E20] border-0 text-xs">localStorage</Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#8D6E63]/10">
                    <span className="text-sm text-[#4A554C]">Total Users</span>
                    <span className="text-sm font-semibold text-[#1A1C1A]">{users.length}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#8D6E63]/10">
                    <span className="text-sm text-[#4A554C]">Total Entries</span>
                    <span className="text-sm font-semibold text-[#1A1C1A]">{wasteEntries.length + processingLogs.length + investments.length}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-[#4A554C]">Notifications</span>
                    <span className="text-sm font-semibold text-[#1A1C1A]">{notifications.length}</span>
                  </div>
                </div>
                <button
                  data-testid="clear-data-btn"
                  onClick={() => {
                    localStorage.removeItem('neo_circular_ledger');
                    window.location.reload();
                  }}
                  className="mt-6 w-full border border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F]/5 rounded-md px-4 py-2 font-medium text-sm transition-colors"
                >
                  Reset All Data (Reload Defaults)
                </button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="flex min-h-screen bg-[#F1F8E9]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Admin Dashboard" subtitle="System overview" />
        <main className="p-8 max-w-[1600px] mx-auto space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <AKPI icon={Scale} label="Biomass" value={`${(totalWaste / 1000).toFixed(1)}T`} color="#4CAF50" />
            <AKPI icon={Factory} label="Processed" value={`${(totalProcessed / 1000).toFixed(1)}T`} color="#1B5E20" />
            <AKPI icon={Zap} label="Credits" value={`${totalCredits.toFixed(1)} tCO2e`} color="#8D6E63" />
            <AKPI icon={IndianRupee} label="Revenue" value={`Rs ${(totalRevenue / 100000).toFixed(1)}L`} color="#F57C00" />
            <AKPI icon={TrendingUp} label="Invested" value={`Rs ${(totalInvested / 100000).toFixed(1)}L`} color="#1B5E20" />
            <AKPI icon={Users} label="Users" value={users.length} color="#4CAF50" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Waste by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Stubble', value: wasteEntries.filter(e => e.wasteType === 'stubble').reduce((s, e) => s + e.quantity, 0) },
                        { name: 'Cow Dung', value: wasteEntries.filter(e => e.wasteType === 'cow_dung').reduce((s, e) => s + e.quantity, 0) },
                        { name: 'Biodegradable', value: wasteEntries.filter(e => e.wasteType === 'biodegradable').reduce((s, e) => s + e.quantity, 0) },
                      ].filter(d => d.value > 0)}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[0, 1, 2].map(i => <Cell key={i} fill={CHART_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={v => `${v.toLocaleString('en-IN')} kg`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Plant Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={plants.map(p => ({ name: p.name.split(' ')[0], utilization: p.currentUtilization, roi: p.roi }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#8D6E63" strokeOpacity={0.1} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#758077' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#758077' }} />
                    <Tooltip />
                    <Bar dataKey="utilization" fill="#4CAF50" name="Utilization %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="roi" fill="#8D6E63" name="ROI %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F1F8E9]/50">
                    <TableHead className="text-[#4A554C]">Time</TableHead>
                    <TableHead className="text-[#4A554C]">Type</TableHead>
                    <TableHead className="text-[#4A554C]">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ...wasteEntries.slice(0, 3).map(e => ({
                      time: e.timestamp,
                      type: 'Supply',
                      detail: `${e.wardName}: ${e.quantity}kg ${e.wasteType.replace('_', ' ')}`,
                      color: '#1B5E20',
                    })),
                    ...investments.slice(0, 2).map(inv => ({
                      time: inv.timestamp,
                      type: 'Investment',
                      detail: `Rs ${inv.amount.toLocaleString('en-IN')} in ${inv.plantName}`,
                      color: '#0288D1',
                    })),
                  ]
                    .sort((a, b) => new Date(b.time) - new Date(a.time))
                    .slice(0, 5)
                    .map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm text-[#758077]">
                          {new Date(item.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          <Badge className="border-0 text-xs text-white" style={{ backgroundColor: item.color }}>{item.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-[#4A554C]">{item.detail}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

function AKPI({ icon: Icon, label, value, color }) {
  return (
    <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
            <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#758077] uppercase tracking-wide">{label}</p>
            <p data-testid={`admin-kpi-${label.toLowerCase()}`} className="text-sm font-bold text-[#1A1C1A]" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
