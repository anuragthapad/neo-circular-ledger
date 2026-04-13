import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, IndianRupee, Zap, ShieldCheck, Factory, MapPin, BarChart3, Trophy, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const CHART_COLORS = ['#1B5E20', '#4CAF50', '#8D6E63', '#F57C00'];

export default function InvestorDashboard({ subPage }) {
  const { currentUser, investments, plants, addInvestment } = useApp();
  const [investDialog, setInvestDialog] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [filterPerf, setFilterPerf] = useState('all');

  const myInvestments = investments.filter(inv => inv.investorId === currentUser?.id);
  const totalInvested = myInvestments.reduce((s, inv) => s + inv.amount, 0);
  const totalReturns = myInvestments.reduce((s, inv) => s + inv.returns, 0);
  const totalCarbonPortfolio = myInvestments.reduce((s, inv) => {
    const plant = plants.find(p => p.id === inv.plantId);
    return s + (plant?.co2Reduced || 0) * (inv.amount / (plant?.totalInvestment || 1));
  }, 0);

  const avgIRR = myInvestments.length > 0
    ? (myInvestments.reduce((s, inv) => s + inv.irr, 0) / myInvestments.length).toFixed(1)
    : 0;

  // ESG totals from invested plants
  const investedPlantIds = [...new Set(myInvestments.map(inv => inv.plantId))];
  const investedPlants = plants.filter(p => investedPlantIds.includes(p.id));
  const esgCO2 = investedPlants.reduce((s, p) => s + p.co2Reduced, 0);
  const esgWaste = investedPlants.reduce((s, p) => s + p.wasteProcessed, 0);
  const esgJobs = investedPlants.reduce((s, p) => s + p.jobsCreated, 0);

  // Filtered plants for marketplace
  const filteredPlants = plants.filter(p => {
    if (filterPerf === 'high') return p.performance >= 80;
    if (filterPerf === 'medium') return p.performance >= 60 && p.performance < 80;
    if (filterPerf === 'low') return p.performance < 60;
    return true;
  });

  const handleInvest = () => {
    if (!investDialog || !investAmount || parseFloat(investAmount) <= 0) return;
    addInvestment({ plantId: investDialog.id, amount: parseFloat(investAmount) });
    toast.success(`Investment of Rs ${parseFloat(investAmount).toLocaleString('en-IN')} confirmed!`);
    setInvestDialog(null);
    setInvestAmount('');
  };

  // Portfolio distribution pie
  const portfolioData = myInvestments.reduce((acc, inv) => {
    const existing = acc.find(a => a.name === inv.plantName);
    if (existing) existing.value += inv.amount;
    else acc.push({ name: inv.plantName, value: inv.amount });
    return acc;
  }, []);

  if (subPage === 'marketplace') {
    return (
      <div className="flex min-h-screen bg-[#F1F8E9]">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="Investment Marketplace" subtitle="Discover and invest in CBG plants" />
          <main className="p-8 max-w-[1600px] mx-auto">
            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold text-[#758077] uppercase tracking-wide">Filter:</span>
              {['all', 'high', 'medium', 'low'].map(f => (
                <button
                  key={f}
                  data-testid={`filter-${f}`}
                  onClick={() => setFilterPerf(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filterPerf === f
                      ? 'bg-[#1B5E20] text-white'
                      : 'bg-white border border-[#8D6E63]/15 text-[#4A554C] hover:bg-[#1B5E20]/5'
                  }`}
                >
                  {f === 'all' ? 'All Plants' : `${f.charAt(0).toUpperCase() + f.slice(1)} Performance`}
                </button>
              ))}
            </div>

            {/* Plant Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPlants.map(plant => (
                <Card
                  key={plant.id}
                  data-testid={`plant-card-${plant.id}`}
                  className="border-[#8D6E63]/15 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#1A1C1A]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {plant.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-[#758077]" />
                          <span className="text-xs text-[#758077]">{plant.location}</span>
                        </div>
                      </div>
                      <Badge className={`border-0 text-xs ${
                        plant.riskScore === 'Low' ? 'bg-[#E8F5E9] text-[#2E7D32]' :
                        plant.riskScore === 'Medium' ? 'bg-[#FFF8E1] text-[#F57C00]' :
                        'bg-[#FFEBEE] text-[#D32F2F]'
                      }`}>
                        {plant.riskScore} Risk
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-[#F1F8E9] rounded-md p-2.5">
                        <p className="text-[10px] text-[#758077] uppercase tracking-wide font-semibold">Capacity</p>
                        <p className="text-sm font-bold text-[#1A1C1A]">{(plant.capacity / 1000).toFixed(0)}T</p>
                      </div>
                      <div className="bg-[#F1F8E9] rounded-md p-2.5">
                        <p className="text-[10px] text-[#758077] uppercase tracking-wide font-semibold">ROI</p>
                        <p className="text-sm font-bold text-[#1B5E20]">{plant.roi}%</p>
                      </div>
                      <div className="bg-[#F1F8E9] rounded-md p-2.5">
                        <p className="text-[10px] text-[#758077] uppercase tracking-wide font-semibold">Score</p>
                        <p className="text-sm font-bold text-[#1A1C1A]">{plant.performance}/100</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#4A554C] mb-4">
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#4CAF50]" /> {plant.co2Reduced}t CO2</span>
                      <span className="flex items-center gap-1"><Factory className="w-3 h-3 text-[#8D6E63]" /> {(plant.wasteProcessed / 1000).toFixed(0)}T waste</span>
                    </div>

                    {/* Utilization bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#758077]">Utilization</span>
                        <span className="font-semibold text-[#1B5E20]">{plant.currentUtilization}%</span>
                      </div>
                      <div className="h-2 bg-[#E8F5E9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4CAF50] rounded-full transition-all"
                          style={{ width: `${plant.currentUtilization}%` }}
                        />
                      </div>
                    </div>

                    <button
                      data-testid={`invest-btn-${plant.id}`}
                      onClick={() => setInvestDialog(plant)}
                      className="w-full bg-[#1B5E20] text-white hover:bg-[#144A18] rounded-md px-4 py-2 font-medium text-sm transition-colors shadow-sm"
                    >
                      Invest Now
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Investment Dialog */}
            <Dialog open={!!investDialog} onOpenChange={() => setInvestDialog(null)}>
              <DialogContent className="bg-white border-[#8D6E63]/15">
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Invest in {investDialog?.name}
                  </DialogTitle>
                  <DialogDescription>Enter the amount you wish to invest</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1.5 block">
                      Investment Amount (Rs)
                    </label>
                    <input
                      data-testid="invest-amount-input"
                      type="number"
                      min="1000"
                      step="1000"
                      value={investAmount}
                      onChange={e => setInvestAmount(e.target.value)}
                      placeholder="e.g. 100000"
                      className="w-full border border-[#8D6E63]/30 rounded-md px-3 py-2.5 bg-white text-[#1A1C1A] placeholder:text-[#758077] focus:ring-2 focus:ring-[#1B5E20]/50 focus:border-[#1B5E20] transition-colors text-sm"
                    />
                  </div>
                  {investAmount && parseFloat(investAmount) > 0 && (
                    <div className="bg-[#E8F5E9] rounded-lg p-4">
                      <p className="text-xs font-semibold text-[#1B5E20] mb-2">ESTIMATED RETURNS</p>
                      <p className="text-sm text-[#4A554C]">
                        Expected IRR: <strong>{investDialog?.roi}%</strong>
                      </p>
                      <p className="text-sm text-[#4A554C]">
                        Annual Return: <strong>Rs {Math.round(parseFloat(investAmount) * (investDialog?.roi || 0) / 100).toLocaleString('en-IN')}</strong>
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <button
                    onClick={() => setInvestDialog(null)}
                    className="px-4 py-2 text-sm font-medium text-[#4A554C] hover:bg-[#8D6E63]/10 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    data-testid="confirm-invest-btn"
                    onClick={handleInvest}
                    className="bg-[#1B5E20] text-white hover:bg-[#144A18] rounded-md px-4 py-2 font-medium text-sm transition-colors shadow-sm"
                  >
                    Confirm Investment
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    );
  }

  if (subPage === 'portfolio') {
    return (
      <div className="flex min-h-screen bg-[#F1F8E9]">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="My Investments" subtitle="Portfolio overview" />
          <main className="p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#F1F8E9]/50">
                          <TableHead className="text-[#4A554C]">Plant</TableHead>
                          <TableHead className="text-[#4A554C]">Invested</TableHead>
                          <TableHead className="text-[#4A554C]">Returns</TableHead>
                          <TableHead className="text-[#4A554C]">IRR</TableHead>
                          <TableHead className="text-[#4A554C]">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myInvestments.map(inv => (
                          <TableRow key={inv.id} data-testid={`investment-row-${inv.id}`}>
                            <TableCell className="text-sm font-medium text-[#1A1C1A]">{inv.plantName}</TableCell>
                            <TableCell className="text-sm">Rs {inv.amount.toLocaleString('en-IN')}</TableCell>
                            <TableCell className="text-sm text-[#2E7D32] font-medium">Rs {inv.returns.toLocaleString('en-IN')}</TableCell>
                            <TableCell>
                              <Badge className="bg-[#E8F5E9] text-[#1B5E20] border-0 text-xs">{inv.irr}%</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-[#758077]">
                              {new Date(inv.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Portfolio Pie */}
              <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Portfolio Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={portfolioData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {portfolioData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={v => `Rs ${v.toLocaleString('en-IN')}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {portfolioData.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                          <span className="text-[#4A554C]">{d.name}</span>
                        </div>
                        <span className="font-semibold text-[#1A1C1A]">Rs {d.value.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (subPage === 'leaderboard') {
    const sortedPlants = [...plants].sort((a, b) => b.roi - a.roi);
    const sortedWards = [
      { ward: 'Laxmipur', totalWaste: 7000, credits: 10.7, efficiency: 95 },
      { ward: 'Gopalpur', totalWaste: 4400, credits: 7.08, efficiency: 88 },
      { ward: 'Sundarpur', totalWaste: 3100, credits: 5.2, efficiency: 82 },
    ];

    return (
      <div className="flex min-h-screen bg-[#F1F8E9]">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header title="Leaderboard" subtitle="Top performers" />
          <main className="p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Plants */}
              <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    <Trophy className="w-5 h-5 text-[#F57C00]" /> Top Plants by ROI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sortedPlants.map((plant, i) => (
                    <div key={plant.id} data-testid={`leaderboard-plant-${plant.id}`}
                      className="flex items-center gap-4 p-3 rounded-lg bg-[#F1F8E9]/50 border border-[#8D6E63]/10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i === 0 ? 'bg-[#F57C00] text-white' : i === 1 ? 'bg-[#8D6E63] text-white' : 'bg-[#E8F5E9] text-[#1B5E20]'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#1A1C1A]">{plant.name}</p>
                        <p className="text-xs text-[#758077]">{plant.location}</p>
                      </div>
                      <Badge className="bg-[#E8F5E9] text-[#1B5E20] border-0 text-xs">{plant.roi}% ROI</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Wards */}
              <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    <Trophy className="w-5 h-5 text-[#4CAF50]" /> Top Wards by Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sortedWards.map((ward, i) => (
                    <div key={ward.ward}
                      className="flex items-center gap-4 p-3 rounded-lg bg-[#F1F8E9]/50 border border-[#8D6E63]/10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i === 0 ? 'bg-[#4CAF50] text-white' : i === 1 ? 'bg-[#8D6E63] text-white' : 'bg-[#E8F5E9] text-[#1B5E20]'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#1A1C1A]">{ward.ward}</p>
                        <p className="text-xs text-[#758077]">{ward.totalWaste.toLocaleString('en-IN')} kg supplied</p>
                      </div>
                      <Badge className="bg-[#E8F5E9] text-[#1B5E20] border-0 text-xs">{ward.efficiency}%</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (subPage === 'notifications') {
    return <InvestorNotifications />;
  }

  // Dashboard
  return (
    <div className="flex min-h-screen bg-[#F1F8E9]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Investor Dashboard" subtitle={`Welcome, ${currentUser?.name}`} />
        <main className="p-8 max-w-[1600px] mx-auto space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <IKPI icon={IndianRupee} label="Total Invested" value={`Rs ${totalInvested.toLocaleString('en-IN')}`} color="#1B5E20" />
            <IKPI icon={TrendingUp} label="Total Returns" value={`Rs ${totalReturns.toLocaleString('en-IN')}`} color="#4CAF50" />
            <IKPI icon={Zap} label="Carbon Portfolio" value={`${totalCarbonPortfolio.toFixed(1)} tCO2e`} color="#8D6E63" />
            <IKPI icon={BarChart3} label="Avg IRR" value={`${avgIRR}%`} color="#F57C00" />
          </div>

          {/* ESG Metrics */}
          <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>ESG Impact Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-[#E8F5E9] rounded-lg">
                  <Zap className="w-8 h-8 text-[#1B5E20] mx-auto mb-2" strokeWidth={1.5} />
                  <p data-testid="esg-co2" className="text-2xl font-bold text-[#1B5E20]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {esgCO2} tons
                  </p>
                  <p className="text-xs text-[#758077] mt-1">CO2 Reduced</p>
                </div>
                <div className="text-center p-4 bg-[#FFF8E1] rounded-lg">
                  <Factory className="w-8 h-8 text-[#8D6E63] mx-auto mb-2" strokeWidth={1.5} />
                  <p data-testid="esg-waste" className="text-2xl font-bold text-[#8D6E63]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {(esgWaste / 1000).toFixed(0)}T
                  </p>
                  <p className="text-xs text-[#758077] mt-1">Waste Processed</p>
                </div>
                <div className="text-center p-4 bg-[#F1F8E9] rounded-lg">
                  <ShieldCheck className="w-8 h-8 text-[#4CAF50] mx-auto mb-2" strokeWidth={1.5} />
                  <p data-testid="esg-jobs" className="text-2xl font-bold text-[#4CAF50]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {esgJobs}
                  </p>
                  <p className="text-xs text-[#758077] mt-1">Jobs Created</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk + Portfolio chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Risk Score by Plant</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={investedPlants.map(p => ({ name: p.name.split(' ')[0], performance: p.performance, risk: p.riskScore === 'Low' ? 20 : p.riskScore === 'Medium' ? 55 : 85 }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#8D6E63" strokeOpacity={0.1} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#758077' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#758077' }} />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#4CAF50" name="Performance" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="risk" fill="#D32F2F" name="Risk Score" radius={[4, 4, 0, 0]} opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>Portfolio Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {portfolioData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={portfolioData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value"
                        label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}>
                        {portfolioData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={v => `Rs ${v.toLocaleString('en-IN')}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-[#758077] text-center py-10">No investments yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function IKPI({ icon: Icon, label, value, color }) {
  return (
    <Card className="border-[#8D6E63]/15 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
            <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#758077] uppercase tracking-wide">{label}</p>
            <p data-testid={`kpi-${label.toLowerCase().replace(/\s+/g, '-')}`} className="text-lg font-bold text-[#1A1C1A] mt-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InvestorNotifications() {
  const { currentUser, notifications, markNotificationRead } = useApp();
  const myNotifs = notifications.filter(n => n.userId === currentUser?.id);
  return (
    <div className="flex min-h-screen bg-[#F1F8E9]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Notifications" subtitle="Investment updates" />
        <main className="p-8 max-w-[1600px] mx-auto">
          <Card className="border-[#8D6E63]/15 bg-white shadow-sm">
            <CardContent className="p-0">
              {myNotifs.length === 0 ? (
                <p className="p-8 text-center text-sm text-[#758077]">No notifications</p>
              ) : (
                myNotifs.map(n => (
                  <button key={n.id} onClick={() => markNotificationRead(n.id)}
                    className={`w-full text-left px-6 py-4 border-b border-[#8D6E63]/10 hover:bg-[#F1F8E9]/50 transition-colors ${!n.read ? 'bg-[#E8F5E9]/30' : ''}`}>
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
