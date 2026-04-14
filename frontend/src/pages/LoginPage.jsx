import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, Factory, TrendingUp, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const ROLE_INFO = [
  { role: 'ward', label: 'Village Ward', desc: 'Rural community biomass supplier', icon: Leaf, color: '#4CAF50', email: 'ramesh@ward.in', password: 'ward123' },
  { role: 'plant', label: 'CBG Plant Operator', desc: 'Biogas processing facility', icon: Factory, color: '#1B5E20', email: 'ops@greengas.in', password: 'plant123' },
  { role: 'investor', label: 'Investor', desc: 'Neo Circular Fund member', icon: TrendingUp, color: '#8D6E63', email: 'priya@invest.in', password: 'invest123' },
  { role: 'admin', label: 'Administrator', desc: 'System administrator', icon: ShieldCheck, color: '#1A1C1A', email: 'admin@neo.in', password: 'admin123' },
];

const ROLE_PATHS = { ward: '/ward', plant: '/plant', investor: '/investor', admin: '/admin' };

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      navigate(ROLE_PATHS[result.user.role] || '/');
    } else {
      setError(result.error);
    }
  };

  const quickLogin = (info) => {
    const result = login(info.email, info.password);
    if (result.success) navigate(ROLE_PATHS[result.user.role] || '/');
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1B5E20]">
        <img
          src="https://static.prod-images.emergentagent.com/jobs/c0707fca-4c2c-4a27-88e9-2f13d304cd29/images/37731a694d031f17a413a75e9a9c2fd4f027c59f9a7d8bd26cb162d2d926f0da.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <span
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Neo Circular Ledger
            </span>
          </div>

          <div className="max-w-md">
            <h1
              className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-6"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              A digital backbone for circular energy
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Connecting villages, plants, and investors through transparent data and climate impact.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  185+
                </p>
                <p className="text-xs text-white/70 mt-1">Tons CO2 Offset</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  12K+
                </p>
                <p className="text-xs text-white/70 mt-1">Waste Processed (kg)</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Rs 25L+
                </p>
                <p className="text-xs text-white/70 mt-1">Invested</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/40">
            Powered by circular economy principles
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-[#F1F8E9] p-8">
        <div className="w-full max-w-md">
          {/* Mobile Brand */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-lg bg-[#1B5E20] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <span
              className="text-lg font-bold text-[#1A1C1A]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Neo Circular Ledger
            </span>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-bold text-[#1A1C1A] tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Welcome back
          </h2>
          <p className="text-sm text-[#758077] mt-2 mb-8">
            Sign in to your role-based dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1.5 block">
                Email
              </label>
              <input
                data-testid="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.in"
                className="w-full border border-[#8D6E63]/30 rounded-md px-3 py-2.5 bg-white text-[#1A1C1A] placeholder:text-[#758077] focus:ring-2 focus:ring-[#1B5E20]/50 focus:border-[#1B5E20] transition-colors text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.15em] uppercase font-semibold text-[#4A554C] mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  data-testid="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border border-[#8D6E63]/30 rounded-md px-3 py-2.5 bg-white text-[#1A1C1A] placeholder:text-[#758077] focus:ring-2 focus:ring-[#1B5E20]/50 focus:border-[#1B5E20] transition-colors text-sm pr-10"
                  required
                />
                <button
                  type="button"
                  data-testid="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#758077] hover:text-[#4A554C]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p data-testid="login-error" className="text-sm text-[#D32F2F] font-medium">
                {error}
              </p>
            )}

            <button
              data-testid="login-submit"
              type="submit"
              className="w-full bg-[#1B5E20] text-white hover:bg-[#144A18] rounded-md px-4 py-2.5 font-medium tracking-wide shadow-sm transition-colors text-sm"
            >
              Sign In
            </button>
          </form>

          {/* Quick Access Cards */}
          <div className="mt-10 p-4 bg-gradient-to-r from-[#8D6E63]/5 to-transparent rounded-lg border border-[#8D6E63]/20">
            <p className="text-sm tracking-[0.15em] uppercase font-bold text-[#8D6E63] mb-3 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#8D6E63] animate-pulse"></span>
              Quick Access — Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ROLE_INFO.map(info => {
                const Icon = info.icon;
                return (
                  <Card
                    key={info.role}
                    data-testid={`quick-login-${info.role}`}
                    className="cursor-pointer border-[#8D6E63]/15 hover:-translate-y-0.5 hover:shadow-md hover:border-[#8D6E63]/30 transition-all duration-200 bg-white"
                    onClick={() => quickLogin(info)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4" style={{ color: info.color }} strokeWidth={1.5} />
                        <span className="text-sm font-semibold text-[#1A1C1A]">{info.label}</span>
                      </div>
                      <p className="text-[11px] text-[#758077]">{info.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
