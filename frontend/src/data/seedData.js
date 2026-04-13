// Carbon credit factors per kg
export const CARBON_CREDIT_FACTORS = {
  stubble: 1.5 / 1000,
  cow_dung: 2.0 / 1000,
  biodegradable: 1.2 / 1000,
};

// Payment rates per kg (INR)
export const PAYMENT_RATES = {
  stubble: 2.5,
  cow_dung: 3.0,
  biodegradable: 1.8,
};

export const WASTE_TYPES = [
  { value: 'stubble', label: 'Stubble' },
  { value: 'cow_dung', label: 'Cow Dung' },
  { value: 'biodegradable', label: 'Biodegradable Waste' },
];

// CBG conversion factors
export const CBG_CONVERSION = {
  stubble: 0.065,
  cow_dung: 0.045,
  biodegradable: 0.055,
};

export const MANURE_CONVERSION = {
  stubble: 0.30,
  cow_dung: 0.40,
  biodegradable: 0.35,
};

// Demo users
export const DEMO_USERS = [
  { id: 'ward-1', name: 'Ramesh Kumar', role: 'ward', ward: 'Sundarpur', email: 'ramesh@ward.in', password: 'ward123' },
  { id: 'ward-2', name: 'Sita Devi', role: 'ward', ward: 'Gopalpur', email: 'sita@ward.in', password: 'ward123' },
  { id: 'ward-3', name: 'Arjun Singh', role: 'ward', ward: 'Laxmipur', email: 'arjun@ward.in', password: 'ward123' },
  { id: 'plant-1', name: 'GreenGas Industries', role: 'plant', plantId: 'plant-a', email: 'ops@greengas.in', password: 'plant123' },
  { id: 'plant-2', name: 'BioEnergy Corp', role: 'plant', plantId: 'plant-b', email: 'ops@bioenergy.in', password: 'plant123' },
  { id: 'investor-1', name: 'Priya Mehta', role: 'investor', email: 'priya@invest.in', password: 'invest123' },
  { id: 'investor-2', name: 'Vikram Rao', role: 'investor', email: 'vikram@invest.in', password: 'invest123' },
  { id: 'admin-1', name: 'Admin Panel', role: 'admin', email: 'admin@neo.in', password: 'admin123' },
];

// Demo plants
export const DEMO_PLANTS = [
  {
    id: 'plant-a',
    name: 'GreenGas Industries',
    location: 'Madhya Pradesh',
    capacity: 50000,
    currentUtilization: 72,
    roi: 14.5,
    totalInvestment: 2500000,
    riskScore: 'Low',
    co2Reduced: 185,
    wasteProcessed: 125000,
    jobsCreated: 45,
    performance: 88,
  },
  {
    id: 'plant-b',
    name: 'BioEnergy Corp',
    location: 'Uttar Pradesh',
    capacity: 35000,
    currentUtilization: 58,
    roi: 11.2,
    totalInvestment: 1800000,
    riskScore: 'Medium',
    co2Reduced: 120,
    wasteProcessed: 87000,
    jobsCreated: 32,
    performance: 75,
  },
  {
    id: 'plant-c',
    name: 'CircularPower Ltd',
    location: 'Rajasthan',
    capacity: 60000,
    currentUtilization: 85,
    roi: 16.8,
    totalInvestment: 3200000,
    riskScore: 'Low',
    co2Reduced: 240,
    wasteProcessed: 180000,
    jobsCreated: 58,
    performance: 92,
  },
  {
    id: 'plant-d',
    name: 'EcoFuel Systems',
    location: 'Gujarat',
    capacity: 40000,
    currentUtilization: 45,
    roi: 8.5,
    totalInvestment: 900000,
    riskScore: 'High',
    co2Reduced: 65,
    wasteProcessed: 42000,
    jobsCreated: 20,
    performance: 60,
  },
];

// Generate demo waste entries
const generateDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

export const DEMO_WASTE_ENTRIES = [
  { id: 'we-1', userId: 'ward-1', wardName: 'Sundarpur', wasteType: 'stubble', quantity: 1200, payment: 3000, carbonCredits: 1.8, timestamp: generateDate(1), paymentStatus: 'paid' },
  { id: 'we-2', userId: 'ward-1', wardName: 'Sundarpur', wasteType: 'cow_dung', quantity: 800, payment: 2400, carbonCredits: 1.6, timestamp: generateDate(3), paymentStatus: 'paid' },
  { id: 'we-3', userId: 'ward-1', wardName: 'Sundarpur', wasteType: 'biodegradable', quantity: 500, payment: 900, carbonCredits: 0.6, timestamp: generateDate(7), paymentStatus: 'pending' },
  { id: 'we-4', userId: 'ward-2', wardName: 'Gopalpur', wasteType: 'stubble', quantity: 2000, payment: 5000, carbonCredits: 3.0, timestamp: generateDate(2), paymentStatus: 'paid' },
  { id: 'we-5', userId: 'ward-2', wardName: 'Gopalpur', wasteType: 'cow_dung', quantity: 1500, payment: 4500, carbonCredits: 3.0, timestamp: generateDate(5), paymentStatus: 'paid' },
  { id: 'we-6', userId: 'ward-3', wardName: 'Laxmipur', wasteType: 'biodegradable', quantity: 3000, payment: 5400, carbonCredits: 3.6, timestamp: generateDate(1), paymentStatus: 'pending' },
  { id: 'we-7', userId: 'ward-3', wardName: 'Laxmipur', wasteType: 'stubble', quantity: 1800, payment: 4500, carbonCredits: 2.7, timestamp: generateDate(4), paymentStatus: 'paid' },
  { id: 'we-8', userId: 'ward-1', wardName: 'Sundarpur', wasteType: 'cow_dung', quantity: 600, payment: 1800, carbonCredits: 1.2, timestamp: generateDate(10), paymentStatus: 'paid' },
  { id: 'we-9', userId: 'ward-2', wardName: 'Gopalpur', wasteType: 'biodegradable', quantity: 900, payment: 1620, carbonCredits: 1.08, timestamp: generateDate(8), paymentStatus: 'paid' },
  { id: 'we-10', userId: 'ward-3', wardName: 'Laxmipur', wasteType: 'cow_dung', quantity: 2200, payment: 6600, carbonCredits: 4.4, timestamp: generateDate(6), paymentStatus: 'paid' },
];

export const DEMO_PROCESSING_LOGS = [
  { id: 'pl-1', plantId: 'plant-a', wardName: 'Sundarpur', wasteType: 'stubble', wasteReceived: 1200, wasteProcessed: 1100, cbgOutput: 71.5, manureGenerated: 330, carbonCredits: 1.65, timestamp: generateDate(1) },
  { id: 'pl-2', plantId: 'plant-a', wardName: 'Gopalpur', wasteType: 'cow_dung', wasteReceived: 1500, wasteProcessed: 1400, cbgOutput: 63, manureGenerated: 560, carbonCredits: 2.8, timestamp: generateDate(2) },
  { id: 'pl-3', plantId: 'plant-a', wardName: 'Laxmipur', wasteType: 'biodegradable', wasteReceived: 3000, wasteProcessed: 2800, cbgOutput: 154, manureGenerated: 980, carbonCredits: 3.36, timestamp: generateDate(3) },
  { id: 'pl-4', plantId: 'plant-b', wardName: 'Sundarpur', wasteType: 'cow_dung', wasteReceived: 800, wasteProcessed: 750, cbgOutput: 33.75, manureGenerated: 300, carbonCredits: 1.5, timestamp: generateDate(2) },
  { id: 'pl-5', plantId: 'plant-b', wardName: 'Gopalpur', wasteType: 'stubble', wasteReceived: 2000, wasteProcessed: 1850, cbgOutput: 120.25, manureGenerated: 555, carbonCredits: 2.775, timestamp: generateDate(4) },
];

export const DEMO_INVESTMENTS = [
  { id: 'inv-1', investorId: 'investor-1', plantId: 'plant-a', plantName: 'GreenGas Industries', amount: 500000, returns: 72500, irr: 14.5, timestamp: generateDate(30) },
  { id: 'inv-2', investorId: 'investor-1', plantId: 'plant-c', plantName: 'CircularPower Ltd', amount: 750000, returns: 126000, irr: 16.8, timestamp: generateDate(45) },
  { id: 'inv-3', investorId: 'investor-2', plantId: 'plant-b', plantName: 'BioEnergy Corp', amount: 300000, returns: 33600, irr: 11.2, timestamp: generateDate(20) },
  { id: 'inv-4', investorId: 'investor-2', plantId: 'plant-a', plantName: 'GreenGas Industries', amount: 200000, returns: 29000, irr: 14.5, timestamp: generateDate(60) },
];

export const DEMO_NOTIFICATIONS = [
  { id: 'n-1', userId: 'ward-1', message: 'Payment of Rs 3,000 credited for stubble supply', type: 'payment', read: false, timestamp: generateDate(0) },
  { id: 'n-2', userId: 'ward-1', message: 'Supply schedule: Next collection on Monday', type: 'schedule', read: true, timestamp: generateDate(1) },
  { id: 'n-3', userId: 'plant-1', message: 'Capacity utilization dropped below 70%', type: 'alert', read: false, timestamp: generateDate(0) },
  { id: 'n-4', userId: 'investor-1', message: 'GreenGas Industries quarterly returns: Rs 72,500', type: 'investment', read: false, timestamp: generateDate(2) },
  { id: 'n-5', userId: 'admin-1', message: 'New ward registration: Laxmipur', type: 'system', read: true, timestamp: generateDate(3) },
  { id: 'n-6', userId: 'investor-2', message: 'BioEnergy Corp performance alert: ROI trending down', type: 'alert', read: false, timestamp: generateDate(1) },
  { id: 'n-7', userId: 'ward-2', message: 'Carbon credit milestone: 5 tons CO2e offset', type: 'achievement', read: false, timestamp: generateDate(0) },
  { id: 'n-8', userId: 'plant-2', message: 'New waste batch received from Gopalpur', type: 'supply', read: true, timestamp: generateDate(1) },
];
