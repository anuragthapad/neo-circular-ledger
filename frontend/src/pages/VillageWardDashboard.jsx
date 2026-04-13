import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Leaf, IndianRupee, Zap, Scale, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { WASTE_TYPES, CARBON_CREDIT_FACTORS, PAYMENT_RATES } from '../data/seedData';
import { toast } from 'sonner';

const PIE_COLORS = ['#4CAF50', '#8D6E63', '#1B5E20'];

export default function VillageWardDashboard({ subPage }) {
  const { currentUser, wasteEntries, addWasteEntry } = useApp();
  const [wasteType, setWasteType] = useState('');
  const [quantity, setQuantity] = useState('');

  const myEntries = wasteEntries.filter(e => e.userId === currentUser?.id);
  const totalWaste = myEntries.reduce((s, e) => s + e.quantity, 0);
  const totalEarnings = myEntries.reduce((s, e) => s + e.payment, 0);
  const totalCredits = myEntries.reduce((s, e) => s + e.carbonCredits, 0);
  const paidCount = myEntries.filter(e => e.paymentStatus === 'paid').length;
  const efficiencyScore = myEntries.length > 0 ? Math.min(100, Math.round((paidCount / myEntries.length) * 100)) : 0;

  // Pie chart data
  const wasteDistribution = WASTE_TYPES.map(wt => ({
    name: wt.label,
    value: myEntries.filter(e => e.wasteType === wt.value).reduce((s, e) => s + e.quantity, 0),
  })).filter(d => d.value > 0);

  // Monthly bar chart
  const monthlyData = myEntries.reduce((acc, e) => {
    const month = new Date(e.timestamp).toLocaleDateString('en-IN', { month: 'short' });
    const existing = acc.find(a => a.month === month);
    if (existing) { existing.quantity += e.quantity; existing.earnings += e.payment; }
    else acc.push({ month, quantity: e.quantity, earnings: e.payment });
    return acc;
  }, []).reverse();

  // Auto calc preview
  const previewCredits = wasteType && quantity ? (parseFloat(quantity) * (CARBON_CREDIT_FACTORS[wasteType] || 0)).toFixed(4) : '0';
  const previewPayment = wasteType && quantity ? (parseFloat(quantity) * (PAYMENT_RATES[wasteType] || 0)).toFixed(2) : '0';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wasteType || !quantity || parseFloat(quantity) <= 0) return;
    addWasteEntry({ wasteType, quantity: parseFloat(quantity) });
    toast.success('Waste entry recorded successfully!');
    setWasteType('');
    setQuantity('');
  };

  if (subPage === 'entry') {
    return (
      <div className="flex min-h-screen bg-[#F1F8E9]">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="Add Waste Entry" subtitle={`${currentUser?.ward} Ward`} />
          <main className="p-8 max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Record Waste Supply
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1.5 block">
                        Waste Type
                      </label>
                      <Select value={wasteType} onValueChange={setWasteType}>
                        <SelectTrigger data-testid="waste-type-select" className="border-[#8D6E63]/30 bg-white">
                          <SelectValue placeholder="Select waste type" />
                        </SelectTrigger>
                        <SelectContent>
                          {WASTE_TYPES.map(wt => (
                            <SelectItem key={wt.value} value={wt.value}>{wt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1.5 block">
                        Quantity (kg)
                      </label>
                      <input
                        data-testid="waste-quantity-input"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        placeholder="Enter quantity in kg"
                        className="w-full border border-[#8D6E63]/30 rounded-md px-3 py-2.5 bg-white text-[#1A1C1A] placeholder:text-[#758077] focus:ring-2 focus:ring-[#1B5E20]/50 focus:border-[#1B5E20] transition-colors text-sm"
                        required
                      />
                    </div>
                    <button
                      data-testid="submit-waste-entry"
                      type="submit"
                      className="w-full bg-[#1B5E20] text-white hover:bg-[#144A18] rounded-md px-4 py-2.5 font-medium tracking-wide shadow-sm transition-colors text-sm"
                    >
                      Submit Entry
                    </button>
                  </form>
                </CardContent>
              </Card>

              {/* Live Preview */}
              <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Auto Calculation Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#E8F5E9] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-[#1B5E20]" strokeWidth={1.5} />
                        <span className="text-xs font-semibold text-[#4A554C] uppercase tracking-wide">Carbon Credits</span>
                      </div>
                      <p data-testid="preview-credits" className="text-2xl font-bold text-[#1B5E20]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {previewCredits}
                      </p>
                      <p className="text-xs text-[#758077] mt-1">tons CO2e</p>
                    </div>
                    <div className="bg-[#FFF8E1] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <IndianRupee className="w-4 h-4 text-[#8D6E63]" strokeWidth={1.5} />
                        <span className="text-xs font-semibold text-[#4A554C] uppercase tracking-wide">Payment</span>
                      </div>
                      <p data-testid="preview-payment" className="text-2xl font-bold text-[#8D6E63]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Rs {parseFloat(previewPayment).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-[#758077] mt-1">estimated earnings</p>
                    </div>
                  </div>

                  {wasteType && (
                    <div className="bg-[#F1F8E9] rounded-lg p-4 border border-[#4CAF50]/20">
                      <p className="text-xs font-semibold text-[#1B5E20] mb-2">FORMULA</p>
                      <p className="text-sm text-[#4A554C]">
                        Carbon Credits = {quantity || 0} kg x {CARBON_CREDIT_FACTORS[wasteType]} = <strong>{previewCredits}</strong> tons CO2e
                      </p>
                      <p className="text-sm text-[#4A554C] mt-1">
                        Payment = {quantity || 0} kg x Rs {PAYMENT_RATES[wasteType]}/kg = <strong>Rs {parseFloat(previewPayment).toLocaleString('en-IN')}</strong>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (subPage === 'ledger') {
    return (
      <div className="flex min-h-screen bg-[#F1F8E9]">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="My Ledger" subtitle="Transaction history" />
          <main className="p-8 max-w-[1600px] mx-auto">
            <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F1F8E9]/50">
                      <TableHead className="text-[#4A554C]">Date</TableHead>
                      <TableHead className="text-[#4A554C]">Waste Type</TableHead>
                      <TableHead className="text-[#4A554C]">Quantity (kg)</TableHead>
                      <TableHead className="text-[#4A554C]">Carbon Credits</TableHead>
                      <TableHead className="text-[#4A554C]">Payment (Rs)</TableHead>
                      <TableHead className="text-[#4A554C]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myEntries.map(entry => (
                      <TableRow key={entry.id} data-testid={`ledger-row-${entry.id}`}>
                        <TableCell className="text-sm text-[#4A554C]">
                          {new Date(entry.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[#E8F5E9] text-[#1B5E20] border-0 text-xs">
                            {entry.wasteType.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-[#1A1C1A]">{entry.quantity.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-sm text-[#1B5E20] font-medium">{entry.carbonCredits}</TableCell>
                        <TableCell className="text-sm font-medium text-[#1A1C1A]">Rs {entry.payment.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          {entry.paymentStatus === 'paid' ? (
                            <Badge className="bg-[#E8F5E9] text-[#2E7D32] border-0 text-xs flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3" /> Paid
                            </Badge>
                          ) : (
                            <Badge className="bg-[#FFF8E1] text-[#F57C00] border-0 text-xs flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" /> Pending
                            </Badge>
                          )}
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

  if (subPage === 'notifications') {
    return <NotificationsView />;
  }

  // Default: Dashboard
  return (
    <div className="flex min-h-screen bg-[#F1F8E9]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Village Ward Dashboard" subtitle={`Welcome, ${currentUser?.name} — ${currentUser?.ward}`} />
        <main className="p-8 max-w-[1600px] mx-auto space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard icon={Scale} label="Total Waste" value={`${totalWaste.toLocaleString('en-IN')} kg`} color="#4CAF50" />
            <KPICard icon={IndianRupee} label="Total Earnings" value={`Rs ${totalEarnings.toLocaleString('en-IN')}`} color="#8D6E63" />
            <KPICard icon={Zap} label="Carbon Credits" value={`${totalCredits.toFixed(2)} tCO2e`} color="#1B5E20" />
            <KPICard icon={TrendingUp} label="Efficiency Score" value={`${efficiencyScore}%`} color="#F57C00" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Waste Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wasteDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={wasteDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {wasteDistribution.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toLocaleString('en-IN')} kg`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-[#758077] text-center py-10">No data yet</p>
                )}
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Supply & Earnings Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#8D6E63" strokeOpacity={0.1} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#758077' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#758077' }} />
                      <Tooltip />
                      <Bar dataKey="quantity" fill="#4CAF50" radius={[4, 4, 0, 0]} name="Quantity (kg)" />
                      <Bar dataKey="earnings" fill="#8D6E63" radius={[4, 4, 0, 0]} name="Earnings (Rs)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-[#758077] text-center py-10">No data yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Entries */}
          <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Recent Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F1F8E9]/50">
                    <TableHead className="text-[#4A554C]">Date</TableHead>
                    <TableHead className="text-[#4A554C]">Type</TableHead>
                    <TableHead className="text-[#4A554C]">Qty (kg)</TableHead>
                    <TableHead className="text-[#4A554C]">Payment</TableHead>
                    <TableHead className="text-[#4A554C]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myEntries.slice(0, 5).map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-sm text-[#4A554C]">
                        {new Date(entry.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[#E8F5E9] text-[#1B5E20] border-0 text-xs capitalize">
                          {entry.wasteType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{entry.quantity.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-sm font-medium">Rs {entry.payment.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        {entry.paymentStatus === 'paid' ? (
                          <span className="text-[#2E7D32] text-xs font-semibold">Paid</span>
                        ) : (
                          <span className="text-[#F57C00] text-xs font-semibold">Pending</span>
                        )}
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

function KPICard({ icon: Icon, label, value, color }) {
  return (
    <Card className="border-[#8D6E63]/15 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
            <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#758077] uppercase tracking-wide">{label}</p>
            <p data-testid={`kpi-${label.toLowerCase().replace(/\s+/g, '-')}`} className="text-lg font-bold text-[#1A1C1A] mt-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsView() {
  const { currentUser, notifications, markNotificationRead } = useApp();
  const myNotifs = notifications.filter(n => n.userId === currentUser?.id);

  return (
    <div className="flex min-h-screen bg-[#F1F8E9]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Notifications" subtitle="Stay updated" />
        <main className="p-8 max-w-[1600px] mx-auto">
          <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
            <CardContent className="p-0">
              {myNotifs.length === 0 ? (
                <p className="p-8 text-center text-sm text-[#758077]">No notifications yet</p>
              ) : (
                myNotifs.map(n => (
                  <button
                    key={n.id}
                    data-testid={`notification-${n.id}`}
                    onClick={() => markNotificationRead(n.id)}
                    className={`w-full text-left px-6 py-4 border-b border-[#8D6E63]/10 hover:bg-[#F1F8E9]/50 transition-colors ${
                      !n.read ? 'bg-[#E8F5E9]/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm ${!n.read ? 'font-semibold text-[#1A1C1A]' : 'text-[#4A554C]'}`}>{n.message}</p>
                        <p className="text-xs text-[#758077] mt-1">
                          {new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-[#4CAF50] rounded-full mt-1.5 flex-shrink-0" />}
                    </div>
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
