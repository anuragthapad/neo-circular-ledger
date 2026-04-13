import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { WASTE_TYPES, CARBON_CREDIT_FACTORS, PAYMENT_RATES } from '../data/seedData';
import { Leaf, Zap, IndianRupee, Scale, Printer, Share2, TrendingUp } from 'lucide-react';

export default function ImpactReport() {
  const { currentUser, wasteEntries } = useApp();
  const reportRef = useRef(null);

  const myEntries = wasteEntries.filter(e => e.userId === currentUser?.id);
  const totalWaste = myEntries.reduce((s, e) => s + e.quantity, 0);
  const totalEarnings = myEntries.reduce((s, e) => s + e.payment, 0);
  const totalCredits = myEntries.reduce((s, e) => s + e.carbonCredits, 0);
  const paidCount = myEntries.filter(e => e.paymentStatus === 'paid').length;

  const wasteByType = WASTE_TYPES.map(wt => {
    const entries = myEntries.filter(e => e.wasteType === wt.value);
    return {
      type: wt.label,
      quantity: entries.reduce((s, e) => s + e.quantity, 0),
      credits: entries.reduce((s, e) => s + e.carbonCredits, 0),
      earnings: entries.reduce((s, e) => s + e.payment, 0),
    };
  }).filter(d => d.quantity > 0);

  const treesEquivalent = Math.round(totalCredits * 50);
  const carsOffRoad = (totalCredits * 2.3).toFixed(1);

  const handlePrint = () => window.print();
  const handleShare = async () => {
    const text = `${currentUser?.ward} Ward Impact Report\n\nTotal Waste Supplied: ${totalWaste.toLocaleString('en-IN')} kg\nCarbon Credits Earned: ${totalCredits.toFixed(2)} tCO2e\nEquivalent to ${treesEquivalent} trees planted\nTotal Earnings: Rs ${totalEarnings.toLocaleString('en-IN')}\n\n#NeoCircularLedger #CircularEconomy`;
    if (navigator.share) {
      try { await navigator.share({ title: 'My Impact Report', text }); }
      catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(text);
      alert('Impact report copied to clipboard!');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F1F8E9]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title="Impact Report" subtitle="Your environmental contribution" />
        <main className="p-8 max-w-[1600px] mx-auto">
          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              data-testid="print-report-btn"
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#1B5E20] text-white hover:bg-[#144A18] rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" strokeWidth={1.5} /> Print Report
            </button>
            <button
              data-testid="share-report-btn"
              onClick={handleShare}
              className="flex items-center gap-2 border border-[#1B5E20] text-[#1B5E20] hover:bg-[#1B5E20]/5 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" strokeWidth={1.5} /> Share
            </button>
          </div>

          {/* Report Card */}
          <div ref={reportRef} className="print:p-0">
            <Card className="border-[#8D6E63]/15 bg-white shadow-sm overflow-hidden">
              {/* Header Banner */}
              <div className="bg-[#1B5E20] px-8 py-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <img
                    src="https://static.prod-images.emergentagent.com/jobs/c0707fca-4c2c-4a27-88e9-2f13d304cd29/images/37731a694d031f17a413a75e9a9c2fd4f027c59f9a7d8bd26cb162d2d926f0da.png"
                    alt="" className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Leaf className="w-6 h-6 text-white" strokeWidth={1.5} />
                    </div>
                    <span className="text-lg font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      Neo Circular Ledger
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Environmental Impact Report
                  </h2>
                  <p className="text-white/70 text-sm">
                    {currentUser?.name} &mdash; {currentUser?.ward} Ward &mdash; Generated {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <CardContent className="p-8 space-y-8">
                {/* Key Impact Numbers */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <ImpactStat icon={Scale} label="Total Waste Supplied" value={`${totalWaste.toLocaleString('en-IN')} kg`} color="#4CAF50" />
                  <ImpactStat icon={Zap} label="Carbon Credits Earned" value={`${totalCredits.toFixed(2)} tCO2e`} color="#1B5E20" />
                  <ImpactStat icon={IndianRupee} label="Total Earnings" value={`Rs ${totalEarnings.toLocaleString('en-IN')}`} color="#8D6E63" />
                  <ImpactStat icon={TrendingUp} label="Entries Submitted" value={myEntries.length} color="#F57C00" />
                </div>

                {/* Environmental Equivalence */}
                <div>
                  <h3 className="text-lg font-bold text-[#1A1C1A] mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    What Your Impact Means
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#E8F5E9] rounded-lg p-5 border border-[#4CAF50]/20">
                      <div className="text-3xl font-bold text-[#1B5E20] mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {treesEquivalent}
                      </div>
                      <p className="text-sm text-[#4A554C]">Trees worth of CO2 absorption per year</p>
                    </div>
                    <div className="bg-[#FFF8E1] rounded-lg p-5 border border-[#F57C00]/20">
                      <div className="text-3xl font-bold text-[#8D6E63] mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {carsOffRoad}
                      </div>
                      <p className="text-sm text-[#4A554C]">Cars taken off the road for a year equivalent</p>
                    </div>
                  </div>
                </div>

                {/* Breakdown by Waste Type */}
                <div>
                  <h3 className="text-lg font-bold text-[#1A1C1A] mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Contribution Breakdown
                  </h3>
                  <div className="space-y-3">
                    {wasteByType.map(wt => (
                      <div key={wt.type} className="flex items-center gap-4 p-4 rounded-lg bg-[#F1F8E9]/50 border border-[#8D6E63]/10">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-[#1A1C1A]">{wt.type}</span>
                            <Badge className="bg-[#E8F5E9] text-[#1B5E20] border-0 text-xs">
                              {wt.credits.toFixed(2)} tCO2e
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-xs text-[#758077]">
                            <span>{wt.quantity.toLocaleString('en-IN')} kg supplied</span>
                            <span>Rs {wt.earnings.toLocaleString('en-IN')} earned</span>
                          </div>
                          <div className="mt-2 h-2 bg-[#E8F5E9] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#4CAF50] rounded-full"
                              style={{ width: `${Math.min(100, (wt.quantity / totalWaste) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-[#F1F8E9] rounded-lg p-5 border border-[#4CAF50]/20">
                  <h3 className="text-base font-bold text-[#1A1C1A] mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Payment Summary
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold text-[#2E7D32]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {paidCount}
                      </p>
                      <p className="text-xs text-[#758077]">Payments Received</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#F57C00]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {myEntries.length - paidCount}
                      </p>
                      <p className="text-xs text-[#758077]">Pending</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#1B5E20]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Rs {totalEarnings.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-[#758077]">Total Value</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t border-[#8D6E63]/10">
                  <p className="text-xs text-[#758077]">
                    This report is generated by Neo Circular Ledger. Data is based on entries submitted by {currentUser?.ward} Ward.
                  </p>
                  <p className="text-xs text-[#1B5E20] font-semibold mt-1">
                    Together, we build a circular future.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function ImpactStat({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-[#F1F8E9]/50 rounded-lg p-4 border border-[#8D6E63]/10 text-center">
      <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} strokeWidth={1.5} />
      <p className="text-xl font-bold text-[#1A1C1A]" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</p>
      <p className="text-xs text-[#758077] mt-1">{label}</p>
    </div>
  );
}
