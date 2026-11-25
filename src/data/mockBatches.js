// Mandi Centers in Maharashtra & Madhya Pradesh (Key Onion Belts)
export const MANDI_CENTERS = [
  {
    id: 'MH-LSG-01',
    name: 'Lasalgaon APMC (Nashik)',
    nameMr: 'लासलगाव कृ.उ.बा.स. (नाशिक)',
    nameHi: 'लासलगांव एपीएमसी (नासिक)',
    state: 'Maharashtra',
    lat: 20.1472,
    lng: 74.2253,
    elevation: '578m ASL',
    officer: 'Insp. Rajesh V. Patil (ID: DOCA-MH-4429)',
    calibratedTrayId: 'TRAY-ARUCO-LSG-99',
    bufferQuota: '45,000 MT',
  },
  {
    id: 'MH-PMP-02',
    name: 'Pimpalgaon Baswant APMC',
    nameMr: 'पिंपळगाव बसवंत कृ.उ.बा.स.',
    nameHi: 'पिंपलगांव बसवंत एपीएमसी',
    state: 'Maharashtra',
    lat: 20.1714,
    lng: 73.9877,
    elevation: '592m ASL',
    officer: 'Insp. Sunita Deshmukh (ID: DOCA-MH-3810)',
    calibratedTrayId: 'TRAY-ARUCO-PMP-12',
    bufferQuota: '35,000 MT',
  },
  {
    id: 'MH-YEO-03',
    name: 'Yeola APMC (Nashik)',
    nameMr: 'येवला कृ.उ.बा.स.',
    nameHi: 'येवला एपीएमसी',
    state: 'Maharashtra',
    lat: 20.0422,
    lng: 74.4886,
    elevation: '540m ASL',
    officer: 'Insp. Amit Shinde (ID: DOCA-MH-5521)',
    calibratedTrayId: 'TRAY-ARUCO-YEO-04',
    bufferQuota: '28,000 MT',
  },
  {
    id: 'MP-NEEM-04',
    name: 'Neemuch Mandi (MP)',
    nameMr: 'नीमच कृ.उ.बा.स. (मध्य प्रदेश)',
    nameHi: 'नीमच मंडी (मध्य प्रदेश)',
    state: 'Madhya Pradesh',
    lat: 24.4647,
    lng: 74.8715,
    elevation: '452m ASL',
    officer: 'Insp. Vikas Verma (ID: DOCA-MP-1109)',
    calibratedTrayId: 'TRAY-ARUCO-NMC-77',
    bufferQuota: '22,000 MT',
  }
];

// Presets representing real-world Mandi buffer procurement batches
export const PRESET_BATCHES = [
  {
    id: 'BATCH-2026-A4',
    name: 'Batch #2026-A4 (Grade A Dominant)',
    farmer: 'Kailash Shivaji Sanap',
    village: 'Khedgaon, Niphad, Nashik',
    aadhaarMasked: 'XXXX-XXXX-8921',
    cropType: 'Rabi Late (Red Garwa)',
    bags: 80,
    quintals: 40.0,
    trayDimensionsMm: { width: 500, height: 400 },
    arucoMarkerSizeMm: 45.0, // Calibrated ArUco marker side in mm
    note: 'Premium dry winter stock with high sound bulb ratio, strictly above 45mm.',
    onions: [
      { id: 1, x: 80, y: 75, diamX: 54.2, diamY: 52.8, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 2, x: 155, y: 70, diamX: 58.6, diamY: 56.4, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 3, x: 235, y: 80, diamX: 49.8, diamY: 48.2, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 4, x: 315, y: 72, diamX: 52.1, diamY: 51.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 5, x: 395, y: 78, diamX: 62.4, diamY: 59.8, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      
      { id: 6, x: 75, y: 145, diamX: 47.5, diamY: 46.1, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 7, x: 145, y: 140, diamX: 53.0, diamY: 51.5, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 8, x: 225, y: 148, diamX: 55.4, diamY: 54.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 9, x: 305, y: 138, diamX: 41.2, diamY: 39.8, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' }, // URS
      { id: 10, x: 385, y: 142, diamX: 51.8, diamY: 50.2, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' },
      
      { id: 11, x: 85, y: 215, diamX: 56.0, diamY: 54.8, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 12, x: 160, y: 210, diamX: 43.5, diamY: 42.1, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' }, // URS
      { id: 13, x: 240, y: 218, diamX: 59.2, diamY: 57.5, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 14, x: 320, y: 212, diamX: 48.7, diamY: 47.9, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 15, x: 400, y: 215, diamX: 53.4, diamY: 52.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      
      { id: 16, x: 70, y: 285, diamX: 42.0, diamY: 41.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' }, // URS
      { id: 17, x: 150, y: 280, diamX: 51.2, diamY: 49.8, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 18, x: 230, y: 290, diamX: 46.8, diamY: 45.4, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 19, x: 310, y: 282, diamX: 57.8, diamY: 56.1, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 20, x: 390, y: 285, diamX: 33.4, diamY: 32.8, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' }, // Reject (under 35mm)
      
      { id: 21, x: 80, y: 345, diamX: 50.4, diamY: 49.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 22, x: 165, y: 340, diamX: 54.9, diamY: 53.2, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 23, x: 245, y: 348, diamX: 40.8, diamY: 39.5, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' }, // URS
      { id: 24, x: 325, y: 342, diamX: 52.6, diamY: 51.2, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 25, x: 405, y: 346, diamX: 49.1, diamY: 47.9, defect: 'cut', defectPct: 4.5, rot: 0, sprout: 0, skinColor: '#78350f' }, // URS due to minor cut
    ]
  },
  {
    id: 'BATCH-2026-B2',
    name: 'Batch #2026-B2 (Mixed Lot with URS & Moisture Sprouting)',
    farmer: 'Bhausaheb Dnyaneshwar Baste',
    village: 'Vinchur, Yeola, Nashik',
    aadhaarMasked: 'XXXX-XXXX-4102',
    cropType: 'Rabi Normal (Gavran)',
    bags: 65,
    quintals: 32.5,
    trayDimensionsMm: { width: 500, height: 400 },
    arucoMarkerSizeMm: 45.0,
    note: 'Slightly high moisture lot with premature sprouts and 35-45mm URS distribution.',
    onions: [
      { id: 1, x: 85, y: 75, diamX: 44.0, diamY: 42.8, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 2, x: 160, y: 70, diamX: 42.5, diamY: 41.2, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 3, x: 238, y: 80, diamX: 51.4, diamY: 50.1, defect: 'sprout', defectPct: 8.2, rot: 0, sprout: 1, sproutLengthMm: 7.4, skinColor: '#78350f' },
      { id: 4, x: 312, y: 74, diamX: 38.6, diamY: 37.5, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 5, x: 390, y: 80, diamX: 47.8, diamY: 46.2, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      
      { id: 6, x: 78, y: 142, diamX: 39.8, diamY: 38.4, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 7, x: 152, y: 138, diamX: 46.5, diamY: 45.1, defect: 'sprout', defectPct: 6.0, rot: 0, sprout: 1, sproutLengthMm: 5.1, skinColor: '#b45309' },
      { id: 8, x: 228, y: 145, diamX: 43.2, diamY: 42.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 9, x: 308, y: 140, diamX: 56.4, diamY: 55.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 10, x: 386, y: 144, diamX: 41.0, diamY: 39.8, defect: 'mould', defectPct: 7.8, rot: 1, sprout: 0, skinColor: '#b45309' }, // Mould reject
      
      { id: 11, x: 82, y: 212, diamX: 48.2, diamY: 47.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 12, x: 158, y: 208, diamX: 37.5, diamY: 36.2, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 13, x: 236, y: 215, diamX: 50.8, diamY: 49.5, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 14, x: 315, y: 210, diamX: 31.8, diamY: 30.5, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' }, // Reject <35mm
      { id: 15, x: 395, y: 214, diamX: 44.5, diamY: 43.1, defect: 'cut', defectPct: 5.2, rot: 0, sprout: 0, skinColor: '#78350f' },
      
      { id: 16, x: 74, y: 282, diamX: 52.3, diamY: 51.1, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 17, x: 150, y: 278, diamX: 41.9, diamY: 40.5, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 18, x: 230, y: 286, diamX: 36.2, diamY: 35.0, defect: 'sprout', defectPct: 9.1, rot: 0, sprout: 1, sproutLengthMm: 9.0, skinColor: '#78350f' },
      { id: 19, x: 310, y: 280, diamX: 49.5, diamY: 48.2, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 20, x: 390, y: 284, diamX: 43.8, diamY: 42.4, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      
      { id: 21, x: 80, y: 344, diamX: 45.8, diamY: 44.2, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 22, x: 162, y: 340, diamX: 38.2, diamY: 37.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 23, x: 242, y: 346, diamX: 53.6, diamY: 52.2, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 24, x: 322, y: 340, diamX: 42.1, diamY: 41.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 25, x: 402, y: 345, diamX: 34.0, diamY: 33.1, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' }, // Reject <35mm
    ]
  },
  {
    id: 'BATCH-2026-C1',
    name: 'Batch #2026-C1 (Kharif Stock - High Mould & Mechanical Cuts)',
    farmer: 'Rajendra Anandrao Borse',
    village: 'Saundane, Malegaon, Nashik',
    aadhaarMasked: 'XXXX-XXXX-6539',
    cropType: 'Early Kharif (Pol)',
    bags: 50,
    quintals: 25.0,
    trayDimensionsMm: { width: 500, height: 400 },
    arucoMarkerSizeMm: 45.0,
    note: 'Weather-affected lot with heavy Aspergillus niger black mould and handling bruised necks.',
    onions: [
      { id: 1, x: 85, y: 75, diamX: 49.0, diamY: 47.5, defect: 'mould', defectPct: 18.5, rot: 1, sprout: 0, skinColor: '#78350f' },
      { id: 2, x: 160, y: 70, diamX: 41.2, diamY: 40.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 3, x: 238, y: 80, diamX: 33.5, diamY: 32.1, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 4, x: 312, y: 74, diamX: 47.6, diamY: 46.0, defect: 'cut', defectPct: 12.0, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 5, x: 390, y: 80, diamX: 38.0, diamY: 36.8, defect: 'mould', defectPct: 14.2, rot: 1, sprout: 0, skinColor: '#b45309' },
      
      { id: 6, x: 78, y: 142, diamX: 52.0, diamY: 50.4, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 7, x: 152, y: 138, diamX: 32.0, diamY: 31.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' }, // Reject <35mm
      { id: 8, x: 228, y: 145, diamX: 43.0, diamY: 41.5, defect: 'mould', defectPct: 22.0, rot: 1, sprout: 0, skinColor: '#b45309' }, // Mould reject
      { id: 9, x: 308, y: 140, diamX: 46.2, diamY: 44.8, defect: 'sprout', defectPct: 15.0, rot: 0, sprout: 1, sproutLengthMm: 12.0, skinColor: '#9a3412' },
      { id: 10, x: 386, y: 144, diamX: 39.5, diamY: 38.0, defect: 'cut', defectPct: 9.5, rot: 0, sprout: 0, skinColor: '#78350f' },
      
      { id: 11, x: 82, y: 212, diamX: 44.0, diamY: 42.5, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 12, x: 158, y: 208, diamX: 48.0, diamY: 46.8, defect: 'mould', defectPct: 16.0, rot: 1, sprout: 0, skinColor: '#9a3412' },
      { id: 13, x: 236, y: 215, diamX: 31.2, diamY: 30.1, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' }, // Reject
      { id: 14, x: 315, y: 210, diamX: 42.8, diamY: 41.2, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 15, x: 395, y: 214, diamX: 55.0, diamY: 53.5, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      
      { id: 16, x: 74, y: 282, diamX: 37.0, diamY: 35.8, defect: 'cut', defectPct: 11.2, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 17, x: 150, y: 278, diamX: 46.5, diamY: 45.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 18, x: 230, y: 286, diamX: 34.5, diamY: 33.2, defect: 'mould', defectPct: 8.5, rot: 1, sprout: 0, skinColor: '#9a3412' },
      { id: 19, x: 310, y: 280, diamX: 48.9, diamY: 47.1, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#78350f' },
      { id: 20, x: 390, y: 284, diamX: 41.4, diamY: 40.2, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      
      { id: 21, x: 80, y: 344, diamX: 30.5, diamY: 29.8, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' }, // Reject
      { id: 22, x: 162, y: 340, diamX: 43.8, diamY: 42.5, defect: 'sprout', defectPct: 11.0, rot: 0, sprout: 1, sproutLengthMm: 8.4, skinColor: '#78350f' },
      { id: 23, x: 242, y: 346, diamX: 40.2, diamY: 39.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#b45309' },
      { id: 24, x: 322, y: 340, diamX: 49.5, diamY: 48.0, defect: 'none', defectPct: 0, rot: 0, sprout: 0, skinColor: '#9a3412' },
      { id: 25, x: 402, y: 345, diamX: 33.0, diamY: 31.8, defect: 'cut', defectPct: 14.0, rot: 0, sprout: 0, skinColor: '#78350f' },
    ]
  }
];

// Offline sync queue mock data (pre-cached lots stored in device SQLite)
export const INITIAL_OFFLINE_QUEUE = [
  {
    lotId: 'LOT-2026-LSG-0814',
    farmerName: 'Kailash Shivaji Sanap',
    village: 'Khedgaon, Niphad',
    bags: 80,
    quintals: 40.0,
    timestamp: '2026-09-30 11:24 IST',
    gradeAPct: 68.0,
    ursPct: 24.0,
    rejectPct: 8.0,
    avgDiameterMm: 50.8,
    status: 'pending', // 'pending' or 'synced'
    syncTxHash: null,
    dqcHash: '0x8f4b2a9e31d4c82b09ff7c24a64bb193e22aa4d1'
  },
  {
    lotId: 'LOT-2026-LSG-0811',
    farmerName: 'Rameshwar Vitthal Gite',
    village: 'Panchale, Sinnar',
    bags: 110,
    quintals: 55.0,
    timestamp: '2026-09-30 09:45 IST',
    gradeAPct: 74.5,
    ursPct: 20.0,
    rejectPct: 5.5,
    avgDiameterMm: 52.3,
    status: 'synced',
    syncTxHash: '0x3c99a410f92b77c51e04db14902188',
    dqcHash: '0x17ae289cc09ff8217db554109faecb12'
  },
  {
    lotId: 'LOT-2026-LSG-0809',
    farmerName: 'Dnyandev Balu Kadam',
    village: 'Kotamgaon, Yeola',
    bags: 45,
    quintals: 22.5,
    timestamp: '2026-09-29 16:30 IST',
    gradeAPct: 61.2,
    ursPct: 28.5,
    rejectPct: 10.3,
    avgDiameterMm: 46.4,
    status: 'synced',
    syncTxHash: '0x99ea114b09c878f230daec90812975',
    dqcHash: '0x498ff02a9b233a1e94471cd6bb409210'
  }
];
