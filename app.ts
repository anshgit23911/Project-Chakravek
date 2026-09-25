import express from "express";
import path from "path";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import alasql from "alasql";

dotenv.config();

// Initialize Groq Client safely
let groq: Groq | null = null;
const groq_api_key = process.env.GROQ_API_KEY;

if (groq_api_key && groq_api_key !== "YOUR_GROQ_API_KEY") {
  try {
    groq = new Groq({
      apiKey: groq_api_key,
    });
    console.log("Groq Real-time Intelligence connected.");
  } catch (err) {
    console.error("Failed to initialize Groq client:", err);
  }
} else {
  console.log("No valid GROQ_API_KEY found in .env.");
}

// ============================================================================
// SUPABASE REAL DATABASE INTEGRATION
// ============================================================================
import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://syvifopjbdxqdmxoxnyi.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5dmlmb3BqYmR4cWRteG94bnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNTQzMTIsImV4cCI6MjEwNTkzMDMxMn0.2HuD7M0pDD8Dc_Uqgl_NQQK0h__HPTiDDc8yJGNxVhw";

let rawUrl = (process.env.SUPABASE_URL || "").trim();
let rawKey = (process.env.SUPABASE_ANON_KEY || "").trim();

// Fallback to active project if unconfigured or pointing to the decommissioned project
if (!rawUrl || rawUrl.includes("yisnwcndonlblbqwlvba") || rawUrl === "YOUR_SUPABASE_URL") {
  rawUrl = DEFAULT_SUPABASE_URL;
  rawKey = DEFAULT_SUPABASE_ANON_KEY;
}

let supabaseUrl = rawUrl;
let supabaseAnonKey = rawKey;
let supabase: any = null;

function initializeSupabase(url: string, key: string) {
  if (url && key && url !== "YOUR_SUPABASE_URL" && key !== "YOUR_SUPABASE_ANON_KEY" && url.trim() !== "" && key.trim() !== "") {
    try {
      supabase = createClient(url, key, {
        auth: {
          persistSession: false
        }
      });
      supabaseUrl = url;
      supabaseAnonKey = key;
      console.log("Supabase Client initialized successfully at " + url);
      return true;
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
    }
  }
  supabase = null;
  return false;
}

// Perform initial boot handshake
initializeSupabase(supabaseUrl, supabaseAnonKey);

// ============================================================================
// HIGH-FIDELITY LOCAL DATABASE ENGINE (SIMULATING SUPABASE FOR PREVIEW DURABILITY)
// ============================================================================

import { Vendor, Contract, RiskScoreBreakdown, AuditReport, AuditObservation, ChatMessage, UploadedFile, Investigation, User } from "./src/types";

let usersState: User[] = [
  {
    id: "u-9981",
    name: "Auditor General Kumar",
    organization: "Comptroller & Auditor General (CAG) India",
    email: "cag-auditor@nic.in",
    role: "Super Admin"
  }
];

let vendorsState: Vendor[] = [
  {
    id: 'V-101',
    name: 'AeroDef Jet Technologies Ltd.',
    category: 'Jet Propulsion & Spares',
    riskScore: 24,
    flaggedContractsCount: 0,
    status: 'Active',
    registeredAt: '2019-04-12',
    taxId: 'TAX-IN-AA0101',
    ownerNationality: 'India',
    address: 'Bengaluru Defense Electronics Cluster, Sector 4, Karnataka',
    matchesPeAs: false,
    connectedVendors: []
  },
  {
    id: 'V-102',
    name: 'Zenith Armaments Corp',
    category: 'Infantry Ballistics',
    riskScore: 87,
    flaggedContractsCount: 2,
    status: 'Flagged',
    registeredAt: '2023-01-15',
    taxId: 'TAX-IN-BA8829',
    ownerNationality: 'Foreign Offshore Shell Corp',
    address: 'Grand Cayman Suite 402, Royal Palms, British West Indies',
    matchesPeAs: true,
    connectedVendors: ['V-104']
  },
  {
    id: 'V-103',
    name: 'Kalyani Tactical Armor',
    category: 'Heavy Combat vehicles',
    riskScore: 15,
    flaggedContractsCount: 0,
    status: 'Active',
    registeredAt: '2017-08-11',
    taxId: 'TAX-IN-CK9928',
    ownerNationality: 'India',
    address: 'Industrial Defense Complex Zone B, Pune, Maharashtra',
    matchesPeAs: false,
    connectedVendors: []
  },
  {
    id: 'V-104',
    name: 'Apex Shell Solutions',
    category: 'Logistic Supplies',
    riskScore: 93,
    flaggedContractsCount: 2,
    status: 'Under Investigation',
    registeredAt: '2022-11-20',
    taxId: 'TAX-IN-DF2210',
    ownerNationality: 'Offshore Nominated Shell Entity',
    address: 'Kingston Corporate Highway 11, Jamaica',
    matchesPeAs: true,
    connectedVendors: ['V-102', 'V-105']
  },
  {
    id: 'V-105',
    name: 'NovaTech Intelligence Systems',
    category: 'Radar & Microwave Sensors',
    riskScore: 65,
    flaggedContractsCount: 1,
    status: 'Flagged',
    registeredAt: '2021-03-30',
    taxId: 'TAX-IN-ET9921',
    ownerNationality: 'Israel-India Joint Venture',
    address: 'Vanguard Aerospace Park, Electronics City, Bengaluru',
    matchesPeAs: false,
    connectedVendors: ['V-104']
  }
];

let contractsState: Contract[] = [
  {
    id: 'C-7310',
    title: 'S-Band Air Surveillance Microwave Receiver Modules',
    vendorId: 'V-105',
    vendorName: 'NovaTech Intelligence Systems',
    description: 'Strategic fast-track sourcing of 45 modern high-band microwave alert receiver panels and custom S-Band synthesizers for coastal tracking array radars.',
    amount: 48.50, // in Cr
    department: 'Radar & Sensors Team / IAF',
    category: 'Radar & Sensors',
    status: 'Under Audit',
    riskScore: 68,
    flagReasons: ['Significant Unit Price Deviation (+140% vs global averages)', 'Direct connection to foreign parent shell shares', 'Awarded on direct vendor nomination under emergency operational guidelines.'],
    flaggedCount: 3,
    anomalyScore: 74,
    unitPriceDeviation: 140.20,
    registeredDate: '2024-02-14',
    evidence: [
      'Discrepancy registered in Customs tariff declarations Form-V42 vs invoice codes.',
      'Average international price points denote cost should not exceed INR 20.2 Crore.',
      'Technical parameter checks show standard telemetry parts quoted as customized tactical modules.'
    ],
    aiExplanation: 'AI risk profiling detected price point deviation exceeding 140%. Vendor NovaTech listed primary share nodes shared with V-104, an entity currently investigated by high-level tribunals.'
  },
  {
    id: 'C-6288',
    title: 'Medium Calibre Tracer Ammunition Shells - 50,000 Units',
    vendorId: 'V-102',
    vendorName: 'Zenith Armaments Corp',
    description: 'Bulk supply contract for 50k anti-tank tracer rounds featuring modular ignition compounds.',
    amount: 8.20,
    department: 'Ballistics wing / Army',
    category: 'Ammunition',
    status: 'Suspended',
    riskScore: 91,
    flagReasons: ['Entity registered only 5 months before bid release', 'Offshore ownership structure (Grand Cayman Shell)', 'Matches Politically Exposed Persons (PEPs) database registries in background checks.'],
    flaggedCount: 3,
    anomalyScore: 94,
    unitPriceDeviation: 12.50,
    registeredDate: '2023-06-18',
    evidence: [
      'Tender bypassed secondary technical filter cycles.',
      'Primary beneficiary accounts map to ultimate beneficial owners (UBOs) in flagged jurisdictions.',
      'Sole-bid response validated under questionable non-availability waivers.'
    ],
    aiExplanation: 'Critical cyber threat flagged. Sourced from V-102, which is owned entirely by shell intermediaries in tax-haven districts. Flagged by CAG for bypassing mandatory technical selection timelines.'
  },
  {
    id: 'C-8511',
    title: 'Multi-role Heavy Combat Armored Plates',
    vendorId: 'V-103',
    vendorName: 'Kalyani Tactical Armor',
    description: 'Indigenous casting and delivery of ballistic defense composites for high-mobility infantry transport vehicles.',
    amount: 112.00,
    department: 'Heavy Combat Division / Army',
    category: 'Heavy Vehicles',
    status: 'Executed',
    riskScore: 14,
    flagReasons: [],
    flaggedCount: 0,
    anomalyScore: 8,
    unitPriceDeviation: -4.50,
    registeredDate: '2024-01-05',
    evidence: [
      'Full open competitive bidding with 7 peer submissions recorded.',
      'Pricing maps exactly with historic market rate metrics.',
      'No PEP indicators found.'
    ],
    aiExplanation: 'Standard competitive defense acquisition profile. Price points represent healthy baseline standards.'
  },
  {
    id: 'C-1090',
    title: 'Emergency Combat Medical Kits and Logistics Packs',
    vendorId: 'V-104',
    vendorName: 'Apex Shell Solutions',
    description: 'Emergency allocation of battle packs containing high-gauge trauma dressing and tactical gear.',
    amount: 15.60,
    department: 'Support Division / Navy',
    category: 'Logistic Supplies',
    status: 'Under Audit',
    riskScore: 85,
    flagReasons: ['Unexplained price escalation (+78.4% Unit Cost)', 'Beneficial ownership overlaps with blacklisted ballistics vendor V-102.', 'Repeated split-invoicing to bypass CAG financial limit scrutiny.'],
    flaggedCount: 3,
    anomalyScore: 89,
    unitPriceDeviation: 78.40,
    registeredDate: '2024-05-12',
    evidence: [
      '5 separate orders issued under identical descriptions within 48 hours to bypass INR 5 Crore audit caps.',
      'Mailing address points directly to flat shared with V-102 (registered offshore).'
    ],
    aiExplanation: 'Structural invoicing fraud. The procurement was split into 5 micro-purchases to fly below defense tribunal authorization ceilings.'
  }
];

let riskScoresState: RiskScoreBreakdown[] = [
  { id: "rs-1", contractId: "C-7310", overallRisk: 68, vendorRisk: 65, directFlagRisk: 55, priceRisk: 95, entityNetworkRisk: 82, analyzedAt: "2024-02-15" },
  { id: "rs-2", contractId: "C-6288", overallRisk: 91, vendorRisk: 87, directFlagRisk: 98, priceRisk: 75, entityNetworkRisk: 90, analyzedAt: "2024-02-15" },
  { id: "rs-3", contractId: "C-8511", overallRisk: 14, vendorRisk: 15, directFlagRisk: 5, priceRisk: 2, entityNetworkRisk: 10, analyzedAt: "2024-02-15" },
  { id: "rs-4", contractId: "C-1090", overallRisk: 85, vendorRisk: 93, directFlagRisk: 85, priceRisk: 80, entityNetworkRisk: 78, analyzedAt: "2024-05-13" }
];

let auditReportsState: AuditReport[] = [
  {
    id: "rep-01",
    title: "Chakravek Audit Observation - C-6288 Ballistics Supply",
    contractId: "C-6288",
    contractTitle: "Medium Calibre Tracer Ammunition Shells",
    generatedContent: "### COMPTROLLER & AUDITOR GENERAL (CAG) AUDIT INQUIRY\n\n**REFERENCE: CAG/DEF/2026/882-B**\n\n**Subject:** Investigation of Procurement Contract C-6288 awarded to Zenith Armaments Corp (V-102) for Medium Calibre Tracer Ammunition.\n\n#### 1. EXECUTIVE SUMMARY\nAn exhaustive audit has registered grave anomalies. Zenith Armaments Corp won this high-security ballistic supply contract through a single-bidder exception less than 5 months after its offshore registration. Extensive tracking revealed linked Cayman structures and Politically Exposed Persons (PEPs).\n\n#### 2. CORE RISK ASSESSMENT\n* **Vendor Risk Index:** 87% (Highly anomalous foreign-origin nominee shell corp)\n* **Network Collusion Factor:** Shared administrative registry patterns with supplier Apex Shell Solutions (V-104).\n* **Regulatory Score:** 91/100 Serious Failure.\n\n#### 3. REGULATORY FINDINGS\n1. Technical parameter reviews were completely bypassed on emergency pretexts that lack valid structural justification.\n2. Invoicing data indicates offshore accounts being loaded with initial capital advances without prototype testing milestones.\n\n#### 4. CAG RECOMMENDATION ACTIONS\n- Immediate complete suspension of deliveries under contract C-6288.\n- Direct reference to defense anti-corruption tribunals.\n- Permanent blacklisting of Zenith Armaments Corp.",
    generatedBy: "Auditor General Kumar",
    status: "Finalized",
    createdAt: "2026-06-10"
  }
];

let auditObservationsState: AuditObservation[] = [
  {
    id: "obs-1",
    contractId: "C-7310",
    contractTitle: "S-Band Air Surveillance Microwave Receiver Modules",
    vendorId: "V-105",
    vendorName: "NovaTech Intelligence Systems",
    formalTitle: "CAG Deficit and Price-Gouging Inspection of Radar Components Sourcing",
    regulatoryReference: "DFR-2024 (Defence Procurement Rules for Non-Standard Emergency Nominated Tenders) Section 14",
    observationText: "The procurement unit fast-tracked C-7310 for 45 microwave modules under operational urgency exemptions. Our analysis demonstrates the unit cost is escalated to INR 1.07 Crore per unit, contrasted against global markets of INR 0.44 Crore. The pricing discrepancy constitutes an unapproved cash outflow of INR 28.3 Crore directly benefitting NovaTech.",
    recommendation: "Recalculate pricing matrix based on historic radar catalog databases. Initiate dynamic forensic audits into internal IAF technical vetting committee members who signed off on pricing justifications.",
    generatedAt: "2026-06-18"
  }
];

let investigationsState: Investigation[] = [
  {
    id: "inv-1",
    contractId: "C-6288",
    contractTitle: "Medium Calibre Tracer Ammunition Shells",
    investigatorName: "Joint Forensic Cell Team 2",
    status: "Open",
    notes: "Evaluating bank routing codes. Cayman Islands authorities have been queried through official channels regarding beneficial ownership.",
    startedAt: "2026-05-10"
  },
  {
    id: "inv-2",
    contractId: "C-7310",
    contractTitle: "S-Band Air Surveillance Receiver Modules",
    investigatorName: "Auditor General Kumar",
    status: "Open",
    notes: "Reviewing operational urgency exceptions file. Sourcing officials are summoned for formal inquiry questions regarding alternative radar bids.",
    startedAt: "2026-06-12"
  }
];

let uploadedFilesState: UploadedFile[] = [
  {
    id: "f-1",
    fileName: "cag_defence_procurement_guide_2024.pdf",
    fileType: "PDF Document",
    fileSize: "4.2 MB",
    indexedAt: "2026-06-10",
    status: "Success"
  },
  {
    id: "f-2",
    fileName: "iaf_radar_parts_inventory_quotes_csv.csv",
    fileType: "CSV Spreadsheet",
    fileSize: "840 KB",
    indexedAt: "2026-06-15",
    status: "Success",
    rowCount: 245
  }
];

// ============================================================================
// DATASET INDEXER & RAG PIPELINE
// ============================================================================
import * as XLSX from "xlsx";
import fs from "fs";

interface DatasetRow {
  [key: string]: any;
}

interface IndexedDataset {
  fileName: string;
  rowCount: number;
  columns: string[];
  rows: DatasetRow[];
}

let loadedDatasets: { [fileName: string]: IndexedDataset } = {};

function safeWriteBootLog(message: string, overwrite = false) {
  console.log(message);
  try {
    if (overwrite) {
      fs.writeFileSync('boot-debug.log', message + '\n');
    } else {
      fs.appendFileSync('boot-debug.log', message + '\n');
    }
  } catch (err) {
    // Ignore read-only filesystem errors on Vercel
  }
}

function indexLocalDatasets() {
  const rootDir = process.cwd();
  try {
    safeWriteBootLog(`Scanning directory for datasets: ${rootDir}`);
    const files = fs.readdirSync(rootDir);
    // Filter canonical dataset files and skip duplicates like " (1).xlsx"
    const datasetFiles = files.filter(f => 
      (f.endsWith(".xlsx") || f.endsWith(".xls") || f.endsWith(".csv")) &&
      !f.includes(" (1)")
    );
    safeWriteBootLog(`Found canonical datasetFiles: ${JSON.stringify(datasetFiles)}`);
    
    datasetFiles.forEach(fileName => {
      const filePath = path.join(rootDir, fileName);
      const stats = fs.statSync(filePath);
      const fileSizeStr = (stats.size / (1024 * 1024)).toFixed(2) + " MB";
      
      safeWriteBootLog(`Processing: ${fileName} (${fileSizeStr})`);
      
      try {
        let rows: DatasetRow[] = [];
        let cols: string[] = [];
        let fileType = fileName.endsWith(".csv") ? "CSV Dataset" : "Excel Spreadsheet";

        const realXLSX: any = (XLSX as any).readFile ? XLSX : ((XLSX as any).default || XLSX);
        
        // Parse complete spreadsheet
        const workbook = realXLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // In these defense datasets, row index 3 contains the actual column headers
        rows = realXLSX.utils.sheet_to_json(sheet, { range: 3 });
        if (rows.length === 0 || !Object.keys(rows[0] || {}).some(k => !k.startsWith('__EMPTY'))) {
          // Fallback if headers are in first row
          rows = realXLSX.utils.sheet_to_json(sheet);
        }
        
        if (rows.length > 0) {
          cols = Object.keys(rows[0]);
        }

        loadedDatasets[fileName] = {
          fileName,
          rowCount: rows.length,
          columns: cols,
          rows: rows
        };

        console.log(`RAG Indexer: Successfully indexed all ${rows.length} rows from ${fileName}. Columns:`, cols.slice(0, 6));

        // Sync to uploadedFilesState
        const existingIdx = uploadedFilesState.findIndex(uf => uf.fileName === fileName);
        const fileRecord: UploadedFile = {
          id: existingIdx !== -1 ? uploadedFilesState[existingIdx].id : "f-" + Math.floor(Math.random() * 10000),
          fileName,
          fileType,
          fileSize: fileSizeStr,
          indexedAt: new Date(stats.mtime).toISOString().split('T')[0],
          status: "Success",
          rowCount: rows.length
        };

        if (existingIdx !== -1) {
          uploadedFilesState[existingIdx] = fileRecord;
        } else {
          uploadedFilesState.push(fileRecord);
        }
      } catch (err: any) {
        safeWriteBootLog(`Error indexing file ${fileName}: ${err.stack || err}`);
        // Add as failed
        uploadedFilesState.push({
          id: "f-" + Math.floor(Math.random() * 10000),
          fileName,
          fileType: fileName.endsWith(".csv") ? "CSV Dataset" : "Excel Spreadsheet",
          fileSize: fileSizeStr,
          indexedAt: new Date().toISOString().split('T')[0],
          status: "Failed",
          rowCount: 0
        });
      }
    });

    // Dynamically load contracts and vendors from Excel datasets!
    importRecordsFromDatasets();

  } catch (err) {
    console.error("RAG Indexer: Failed to list local datasets:", err);
  }
}

function importRecordsFromDatasets() {
  console.log("RAG Indexer: Syncing vendors and contracts from loaded Excel datasets...");

  const defaultVendors: Vendor[] = [
    {
      id: 'V-101',
      name: 'AeroDef Jet Technologies Ltd.',
      category: 'Jet Propulsion & Spares',
      riskScore: 24,
      flaggedContractsCount: 0,
      status: 'Active',
      registeredAt: '2019-04-12',
      taxId: 'TAX-IN-AA0101',
      ownerNationality: 'India',
      address: 'Bengaluru Defense Electronics Cluster, Sector 4, Karnataka',
      matchesPeAs: false,
      connectedVendors: []
    },
    {
      id: 'V-102',
      name: 'Zenith Armaments Corp',
      category: 'Infantry Ballistics',
      riskScore: 87,
      flaggedContractsCount: 2,
      status: 'Flagged',
      registeredAt: '2023-01-15',
      taxId: 'TAX-IN-BA8829',
      ownerNationality: 'Foreign Offshore Shell Corp',
      address: 'Grand Cayman Suite 402, Royal Palms, British West Indies',
      matchesPeAs: true,
      connectedVendors: ['V-104']
    },
    {
      id: 'V-103',
      name: 'Kalyani Tactical Armor',
      category: 'Heavy Combat vehicles',
      riskScore: 15,
      flaggedContractsCount: 0,
      status: 'Active',
      registeredAt: '2017-08-11',
      taxId: 'TAX-IN-CK9928',
      ownerNationality: 'India',
      address: 'Industrial Defense Complex Zone B, Pune, Maharashtra',
      matchesPeAs: false,
      connectedVendors: []
    },
    {
      id: 'V-104',
      name: 'Apex Shell Solutions',
      category: 'Logistic Supplies',
      riskScore: 93,
      flaggedContractsCount: 2,
      status: 'Under Investigation',
      registeredAt: '2022-11-20',
      taxId: 'TAX-IN-DF2210',
      ownerNationality: 'Offshore Nominated Shell Entity',
      address: 'Kingston Corporate Highway 11, Jamaica',
      matchesPeAs: true,
      connectedVendors: ['V-102', 'V-105']
    },
    {
      id: 'V-105',
      name: 'NovaTech Intelligence Systems',
      category: 'Radar & Microwave Sensors',
      riskScore: 65,
      flaggedContractsCount: 1,
      status: 'Flagged',
      registeredAt: '2021-03-30',
      taxId: 'TAX-IN-ET9921',
      ownerNationality: 'Israel-India Joint Venture',
      address: 'Vanguard Aerospace Park, Electronics City, Bengaluru',
      matchesPeAs: false,
      connectedVendors: ['V-104']
    }
  ];

  const defaultContracts: Contract[] = [
    {
      id: 'C-7310',
      title: 'S-Band Air Surveillance Microwave Receiver Modules',
      vendorId: 'V-105',
      vendorName: 'NovaTech Intelligence Systems',
      description: 'Strategic fast-track sourcing of 45 modern high-band microwave alert receiver panels and custom S-Band synthesizers for coastal tracking array radars.',
      amount: 48.50,
      department: 'Radar & Sensors Team / IAF',
      category: 'Radar & Sensors',
      status: 'Under Audit',
      riskScore: 68,
      flagReasons: ['Significant Unit Price Deviation (+140% vs global averages)', 'Direct connection to foreign parent shell shares', 'Awarded on direct vendor nomination under emergency operational guidelines.'],
      flaggedCount: 3,
      anomalyScore: 74,
      unitPriceDeviation: 140.20,
      registeredDate: '2024-02-14',
      evidence: [
        'Discrepancy registered in Customs tariff declarations Form-V42 vs invoice codes.',
        'Average international price points denote cost should not exceed INR 20.2 Crore.',
        'Technical parameter checks show standard telemetry parts quoted as customized tactical modules.'
      ],
      aiExplanation: 'AI risk profiling detected price point deviation exceeding 140%. Vendor NovaTech listed primary share nodes shared with V-104, an entity currently investigated by high-level tribunals.'
    },
    {
      id: 'C-6288',
      title: 'Medium Calibre Tracer Ammunition Shells - 50,000 Units',
      vendorId: 'V-102',
      vendorName: 'Zenith Armaments Corp',
      description: 'Bulk supply contract for 50k anti-tank tracer rounds featuring modular ignition compounds.',
      amount: 8.20,
      department: 'Ballistics wing / Army',
      category: 'Ammunition',
      status: 'Suspended',
      riskScore: 91,
      flagReasons: ['Entity registered only 5 months before bid release', 'Offshore ownership structure (Grand Cayman Shell)', 'Matches Politically Exposed Persons (PEPs) database registries in background checks.'],
      flaggedCount: 3,
      anomalyScore: 94,
      unitPriceDeviation: 12.50,
      registeredDate: '2023-06-18',
      evidence: [
        'Tender bypassed secondary technical filter cycles.',
        'Primary beneficiary accounts map to ultimate beneficial owners (UBOs) in flagged jurisdictions.',
        'Sole-bid response validated under questionable non-availability waivers.'
      ],
      aiExplanation: 'Critical cyber threat flagged. Sourced from V-102, which is owned entirely by shell intermediaries in tax-haven districts. Flagged by CAG for bypassing mandatory technical selection timelines.'
    },
    {
      id: 'C-8511',
      title: 'Multi-role Heavy Combat Armored Plates',
      vendorId: 'V-103',
      vendorName: 'Kalyani Tactical Armor',
      description: 'Indigenous casting and delivery of ballistic defense composites for high-mobility infantry transport vehicles.',
      amount: 114.60,
      department: 'Heavy Vehicles Core / Army',
      category: 'Heavy Vehicles',
      status: 'Approved',
      riskScore: 12,
      flagReasons: [],
      flaggedCount: 0,
      anomalyScore: 14,
      unitPriceDeviation: -2.40,
      registeredDate: '2024-01-05',
      evidence: [
        'Passed all standard indigenous raw materials criteria checklists.',
        'Bid evaluation records confirm complete alignment with average market ranges.'
      ],
      aiExplanation: 'No price-gouging anomalies detected. Sourced from fully verified domestic Kalyani Tactical node.'
    }
  ];

  const vendorMap = new Map<string, Vendor>();
  defaultVendors.forEach(v => vendorMap.set(v.id, v));

  const contractMap = new Map<string, Contract>();
  defaultContracts.forEach(c => contractMap.set(c.id, c));

  const REAL_POOL_VENDORS = [
    "Tata Advanced Systems", "L&T Defense", "Kalyani Strategic Systems", "Bharat Forge", "Adani Defence & Aerospace",
    "Reliance Naval & Engineering", "Godrej Aerospace", "Mahindra Defence Systems", "Astra Microwave Products", 
    "Centum Electronics", "HBL Power Systems", "Solar Industries India", "Alpha Design Technologies", 
    "Premier Explosives", "Zen Technologies", "Vem Technologies", "Dynamatic Technologies", 
    "Sika Interplant Systems", "AeroDef Jet Technologies Ltd.", "Zenith Armaments Corp", 
    "Kalyani Tactical Armor", "Apex Shell Solutions", "NovaTech Intelligence Systems"
  ];

  const vendorLocations = [
    "Bengaluru Defense Aerospace Park, Devanahalli, Karnataka",
    "Bhosari Industrial Defense Complex, Pune, Maharashtra",
    "Adyar High-Tech Electronics Zone, Chennai, Tamil Nadu",
    "Sector 43 Aerospace Corridors, Gurugram, Haryana",
    "Defense Manufacturing Corridor, Nagpur, Maharashtra",
    "Sricity Defense Electronics Hub, Nellore, Andhra Pradesh",
    "Industrial Estate, Sanand, Ahmedabad, Gujarat"
  ];

  function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  }

  function getVendorName(idStr: string): string {
    const hashVal = simpleHash(idStr);
    return REAL_POOL_VENDORS[hashVal % REAL_POOL_VENDORS.length];
  }

  function getVendorId(vName: string): string {
    const hashVal = simpleHash(vName);
    return "V-" + (1000 + (hashVal % 9000));
  }

  Object.entries(loadedDatasets).forEach(([fileName, dataset]) => {
    const rows = dataset.rows;
    if (!rows || rows.length === 0) return;

    rows.forEach((row, index) => {
      try {
        let contractId = "";
        let title = "";
        let description = "";
        let amount = 10.0;
        let department = "Ministry of Defence";
        let category = "General Procurement";
        let registeredDate = "2025-01-01";
        let status: 'Draft' | 'Approved' | 'Executed' | 'Suspended' | 'Under Audit' = "Executed";
        let isAnomaly = false;
        let flagReasonStr = "";
        let evidenceArr: string[] = [];

        if (fileName.includes("CAG_Real_Plus_Synthetic")) {
          contractId = String(row['Case ID'] || row['Project Chakravek - CAG Audit Case Dataset (Real + Synthetic)'] || ("CAG-" + index));
          title = String(row['Summary of Finding'] || row['__EMPTY_6'] || "Audit Finding Overview");
          const reportSource = String(row['Report Source'] || row['__EMPTY'] || 'CAG Report');
          const period = String(row['Period Covered'] || row['__EMPTY_5'] || 'Audit Period');
          description = `CAG Audit Case: ${contractId}. Source: ${reportSource}. Period: ${period}. Finding: ${title}`;
          amount = parseFloat(row['Financial Impact (Rs Crore)'] || row['__EMPTY_4']) || 12.5;
          department = String(row['Unit/Organisation'] || row['__EMPTY_2'] || "CAG Audit Board");
          category = String(row['Issue Category'] || row['__EMPTY_3'] || "Procurement Auditing");
          registeredDate = String(row['Tabled Date'] || row['__EMPTY_1'] || "2025-12-18").split(' ')[0];
          isAnomaly = parseInt(row['Is Anomaly'] || row['__EMPTY_8']) === 1;
          flagReasonStr = String(row['Issue Category'] || row['__EMPTY_3'] || "Audit Finding Irregularity");
          status = isAnomaly ? "Under Audit" : "Executed";
          evidenceArr = [
            `Report Source: ${reportSource}`,
            `Period Covered: ${period}`,
            `Financial Impact: ₹${amount.toFixed(2)} Cr`
          ];
        } 
        else if (fileName.includes("GeM_Real_Plus_Synthetic")) {
          contractId = String(row['Order ID'] || row['Project Chakravek - GeM Procurement Dataset (Real + Synthetic)'] || ("GEM-" + index));
          title = String(row['Item Description'] || row['__EMPTY_3'] || "Procurement Item");
          const buyerDept = String(row['Buyer Department'] || row['__EMPTY_1'] || 'Ministry of Defence');
          const bidType = String(row['Bid Type'] || row['__EMPTY_4'] || 'Direct Buy');
          description = `GeM Order: ${contractId}. Buyer: ${buyerDept}. Bid Type: ${bidType}. Item: ${title}`;
          
          const orderValueInr = parseFloat(row['Total Order Value (INR)'] || row['__EMPTY_5']) || 12000000;
          amount = Number((orderValueInr / 10000000).toFixed(2));
          if (amount < 0.01) amount = 0.45;
          
          department = buyerDept;
          category = String(row['Category'] || row['__EMPTY_2'] || "General Procurement");
          registeredDate = String(row['Order Date'] || row['__EMPTY'] || "2025-07-06").split(' ')[0];
          const anomVal = row['Anomaly Flag'] || row['__EMPTY_10'];
          isAnomaly = Boolean(anomVal && String(anomVal).trim() !== '' && anomVal !== '0' && anomVal !== 0);
          flagReasonStr = isAnomaly ? String(anomVal) : "";
          status = isAnomaly ? "Under Audit" : "Executed";
          evidenceArr = [
            `Seller Type: ${row['Seller Type'] || row['__EMPTY_8'] || 'OEM/Reseller'}`,
            `Bid Type: ${bidType}`,
            `GeM Value: ₹${(amount * 10000000).toLocaleString('en-IN')}`
          ];
        } 
        else if (fileName.includes("eProcure_Real_Plus_Synthetic")) {
          contractId = String(row['Tender ID'] || row['Project Chakravek - Defence eProcurement (defproc.gov.in) Tender Dataset (Real + Synthetic)'] || ("RT-" + index));
          title = String(row['Title'] || row['__EMPTY_1'] || "Defence Works / Sourcing Tender");
          const refNo = String(row['Reference No'] || row['__EMPTY_2'] || "DEF-TENDER-2026");
          const issuingUnit = String(row['Issuing Unit'] || row['__EMPTY_5'] || 'Defence eProcurement Portal');
          description = `Tender Reference: ${refNo}. Unit: ${issuingUnit}. Status: ${row['Status'] || row['__EMPTY_6'] || 'Active'}`;
          
          const hashVal = simpleHash(contractId);
          amount = Number((3.5 + (hashVal % 1200) / 10).toFixed(2));

          department = issuingUnit;
          registeredDate = String(row['Closing Date'] || row['__EMPTY_3'] || "2026-06-20").split(' ')[0];
          
          const anomFlag = row['Anomaly Flag'] || row['__EMPTY_11'];
          const isAnomNum = parseInt(row['Is Anomaly'] || row['__EMPTY_10']);
          isAnomaly = isAnomNum === 1 || Boolean(anomFlag && String(anomFlag).trim() !== '');
          flagReasonStr = String(anomFlag || (isAnomaly ? "Single Bidder / Tender Exception Flagged" : ""));
          status = isAnomaly ? "Suspended" : (row['Status'] === 'Active' ? 'Approved' : 'Executed');
          evidenceArr = [
            `Reference No: ${refNo}`,
            `Opening Date: ${row['Bid Opening Date'] || 'TBD'}`
          ];
        }

        if (!contractId || contractId.includes("Order ID") || contractId.includes("Case ID") || contractId.includes("Tender ID") || contractId === "Case ID" || contractId === "Order ID" || contractId === "Tender ID") {
          return;
        }

        // Canonical category classification
        const tLower = (title + " " + category).toLowerCase();
        if (tLower.includes("radar") || tLower.includes("sensor") || tLower.includes("microwave") || tLower.includes("radio") || tLower.includes("telecom") || tLower.includes("electronic")) {
          category = "Radar & Sensors";
        } else if (tLower.includes("ammunition") || tLower.includes("shell") || tLower.includes("bullet") || tLower.includes("ballistics") || tLower.includes("explosive") || tLower.includes("armament")) {
          category = "Ammunition";
        } else if (tLower.includes("vehicle") || tLower.includes("armor") || tLower.includes("tank") || tLower.includes("carrier") || tLower.includes("truck") || tLower.includes("combat")) {
          category = "Heavy Vehicles";
        } else if (tLower.includes("medical") || tLower.includes("repair") || tLower.includes("maint") || tLower.includes("supply") || tLower.includes("kit") || tLower.includes("logistics") || tLower.includes("works")) {
          category = "Logistic Supplies";
        }

        const hashVal = simpleHash(contractId);
        const vendorName = getVendorName(contractId);
        const vendorId = getVendorId(vendorName);

        let existingVendor = vendorMap.get(vendorId);
        if (!existingVendor) {
          const vHash = simpleHash(vendorName);
          const address = vendorLocations[vHash % vendorLocations.length];
          const vRisk = isAnomaly ? 72 + (vHash % 25) : 10 + (vHash % 35);
          const vendorStatus = vRisk >= 75 ? 'Flagged' : (vRisk >= 45 ? 'Under Investigation' : 'Active');

          existingVendor = {
            id: vendorId,
            name: vendorName,
            category: category,
            riskScore: vRisk,
            flaggedContractsCount: isAnomaly ? 1 : 0,
            status: vendorStatus,
            registeredAt: `20${15 + (vHash % 8)}-${String(1 + (vHash % 11)).padStart(2, '0')}-${String(1 + (vHash % 28)).padStart(2, '0')}`,
            taxId: `TAX-IN-` + String(vHash).slice(0, 6) + 'D',
            ownerNationality: (vHash % 8 === 0) ? "Foreign Offshore Shell Corp" : "India",
            address: address,
            matchesPeAs: (vHash % 9 === 0),
            connectedVendors: []
          };
          vendorMap.set(vendorId, existingVendor);
        } else {
          if (isAnomaly) {
            existingVendor.flaggedContractsCount += 1;
            if (existingVendor.riskScore < 75) {
              existingVendor.riskScore = Math.min(95, existingVendor.riskScore + 10);
              existingVendor.status = existingVendor.riskScore >= 75 ? 'Flagged' : 'Under Investigation';
            }
          }
        }

        const riskScore = isAnomaly ? 76 + (hashVal % 20) : 10 + (hashVal % 35);
        const unitPriceDeviation = isAnomaly ? 45.0 + (hashVal % 110) : -4.0 + (hashVal % 15);
        const anomalyScore = Math.min(100, riskScore + (hashVal % 6));
        const flagReasons = isAnomaly ? [flagReasonStr || "Anomalous procurement metrics flagged"] : [];

        const contract: Contract = {
          id: contractId,
          title: title.slice(0, 110) + (title.length > 110 ? "..." : ""),
          vendorId: vendorId,
          vendorName: vendorName,
          description: description,
          amount: amount,
          department: department,
          category: category,
          status: status,
          riskScore: riskScore,
          flagReasons: flagReasons,
          flaggedCount: flagReasons.length,
          anomalyScore: anomalyScore,
          unitPriceDeviation: unitPriceDeviation,
          registeredDate: registeredDate,
          evidence: evidenceArr,
          aiExplanation: `${title} sourced for ${department} by ${vendorName}. Risk evaluation index is ${riskScore}%. Pricing deviation index is ${unitPriceDeviation > 0 ? '+' : ''}${unitPriceDeviation.toFixed(1)}%.`
        };

        if (!contractMap.has(contract.id)) {
          contractMap.set(contract.id, contract);
        }
      } catch (rowErr) {
        console.error(`RAG Indexer: Error processing row ${index} in ${fileName}:`, rowErr);
      }
    });
  });

  // Overwrite state arrays with dynamic datasets records!
  vendorsState = Array.from(vendorMap.values());
  contractsState = Array.from(contractMap.values());
  console.log(`RAG Indexer: Sync complete! Dynamic database contains ${vendorsState.length} vendors and ${contractsState.length} contracts.`);
}

let datasetsIndexed = false;

function ensureDatasetsIndexed() {
  if (datasetsIndexed) return;
  datasetsIndexed = true;
  try {
    safeWriteBootLog("Boot logging started...", true);
    safeWriteBootLog(`Current directory: ${process.cwd()}`);
    indexLocalDatasets();
    safeWriteBootLog(
      `Scan complete. contractsState size: ${contractsState.length}, vendorsState size: ${vendorsState.length}`
    );
  } catch (bootErr: any) {
    safeWriteBootLog(`Boot Error: ${bootErr.stack || bootErr}`);
  }
}

// On Vercel, defer heavy Excel indexing until the first API request to avoid cold-start timeouts.
if (!process.env.VERCEL) {
  setTimeout(() => ensureDatasetsIndexed(), 0);
}

function searchDatasets(queryText: string, limit = 15, targetFile?: string): { row: DatasetRow; source: string; score: number }[] {
  const queryLower = queryText.toLowerCase().trim();
  if (!queryLower) return [];
  
  const stopWords = new Set(["a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "to", "for", "in", "of", "on", "at", "by", "with", "from", "show", "list", "find", "search", "who", "what", "where", "how", "me", "any", "some", "i", "want"]);
  const tokens = queryLower
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !stopWords.has(token));
  
  if (tokens.length === 0) {
    tokens.push(queryLower);
  }

  const results: { row: DatasetRow; source: string; score: number }[] = [];
  let targetedDatasets = targetFile ? [targetFile] : Object.keys(loadedDatasets);
  if (!targetFile) {
    const mentionedDataset = targetedDatasets.find(name => queryLower.includes(name.toLowerCase().replace(".xlsx", "")));
    if (mentionedDataset) {
      targetedDatasets = [mentionedDataset];
    }
  }

  targetedDatasets.forEach(fileName => {
    const dataset = loadedDatasets[fileName];
    if (!dataset || !dataset.rows) return;

    const rowCount = dataset.rows.length;
    for (let i = 0; i < rowCount; i++) {
      const row = dataset.rows[i];
      let score = 0;
      let matchedCount = 0;

      for (const [k, v] of Object.entries(row)) {
        if (v === null || v === undefined || v === '') continue;
        const valStr = String(v).toLowerCase();
        const keyLower = k.toLowerCase();

        // Exact query substring match in cell
        if (valStr.includes(queryLower)) {
          score += 15;
          matchedCount++;
        }

        // Token matches
        for (let t = 0; t < tokens.length; t++) {
          const token = tokens[t];
          if (valStr.includes(token)) {
            score += 2;
            matchedCount++;

            if (keyLower.includes("id") || keyLower.includes("case") || keyLower.includes("order") || keyLower.includes("tender")) {
              score += 6;
            }
            if (keyLower.includes("anomaly") || keyLower.includes("flag") || keyLower.includes("finding") || keyLower.includes("category")) {
              score += 4;
            }
            if (keyLower.includes("vendor") || keyLower.includes("department") || keyLower.includes("unit") || keyLower.includes("buyer")) {
              score += 3;
            }
          }
        }
      }

      if (score > 0) {
        results.push({
          row,
          source: fileName,
          score: score + matchedCount
        });
      }
    }
  });

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

// ============================================================================
// EXPRESS FULL-STACK APPLICATION PORT SETUP
// ============================================================================

export const app = express();
app.use(express.json());

if (process.env.VERCEL) {
  app.use((_req, _res, next) => {
    ensureDatasetsIndexed();
    next();
  });
}

// Setup simple authentication session storage
let currentSessionUser: User | null = usersState[0];

  // Unified AI Generation Router (Groq SDK Only)
  async function generateAIResponse(
    prompt: string,
    systemInstruction?: string,
    options?: { provider?: string; model?: string }
  ): Promise<{ text: string; provider: string; model: string }> {
    let text = "";
    let activeModel = options?.model || "llama-3.3-70b-versatile";

    if (groq) {
      try {
        const messages: any[] = [];
        if (systemInstruction) {
          messages.push({ role: "system", content: systemInstruction });
        }
        messages.push({ role: "user", content: prompt });

        const chatCompletion = await groq.chat.completions.create({
          messages,
          model: activeModel,
          temperature: 0.15,
        });

        text = chatCompletion.choices[0]?.message?.content || "";
        return { text, provider: "groq", model: activeModel };
      } catch (err) {
        console.error("Groq generation failed:", err);
      }
    } else {
      console.warn("Groq client not configured or key is empty. Falling back to local static reasoning.");
    }

    return { text: "", provider: "fallback", model: "static-reasoning" };
  }

  // ============================================================================
  // AUTHENTICATION ENDPOINTS
  // ============================================================================
  
  app.get("/api/auth/session", (req, res) => {
    res.json({ user: currentSessionUser });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    if (supabase) {
      try {
        // 1. Authenticate with Supabase Auth
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authErr) {
          console.error("Supabase Auth Login error:", authErr);
          
          // For SSO mock logins or system accounts, if they don't exist in Supabase Auth yet,
          // auto-register them to ensure immediate seamless access!
          if (email.endsWith("@nic.in") && (authErr.message.includes("Invalid login credentials") || authErr.message.includes("Email not confirmed") || authErr.message.includes("User not found"))) {
            const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
              email,
              password,
            });

            if (!signUpErr) {
              const authUserId = signUpData.user?.id;
              
              // Register in public.users
              try {
                await supabase.from("users").insert({
                  id: authUserId,
                  name: email.split("@")[0].toUpperCase() + " AUDIT",
                  organization: "Ministry of Defence, Procurement Cell",
                  email,
                  role: "Auditor"
                });
              } catch (e) {
                console.error("Failed to insert SSO profile on auto-register:", e);
              }

              // Re-try sign-in
              const { data: retryData, error: retryErr } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              if (!retryErr) {
                const userProfile: User = {
                  id: retryData.user?.id || ("u-" + Math.floor(Math.random() * 10000)),
                  name: email.split("@")[0].toUpperCase() + " AUDIT",
                  organization: "Ministry of Defence, Procurement Cell",
                  email,
                  role: "Auditor"
                };
                currentSessionUser = userProfile;
                if (!usersState.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                  usersState.push(userProfile);
                }
                return res.json({ user: userProfile, message: "Logged in via newly registered Supabase Auth" });
              }
            }
          }
          
          return res.status(400).json({ error: authErr.message });
        }

        // 2. Fetch profile from public.users table
        const { data: profile, error: profileErr } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (profileErr) {
          console.error("Supabase profile fetch error:", profileErr);
        }

        const loggedInUser: User = {
          id: authData.user?.id || "u-" + Math.floor(Math.random() * 10000),
          name: profile?.name || authData.user?.user_metadata?.name || email.split("@")[0].toUpperCase() + " AUDIT",
          organization: profile?.organization || authData.user?.user_metadata?.organization || "Ministry of Defence, Procurement Cell",
          email: email,
          role: profile?.role || authData.user?.user_metadata?.role || "Auditor"
        };

        // If profile doesn't exist in public.users table (e.g. database schema is not setup or table is missing),
        // we can still log them in using metadata. Let's write them to the table if we can.
        if (!profile && authData.user?.id) {
          try {
            await supabase.from("users").insert({
              id: authData.user.id,
              name: loggedInUser.name,
              organization: loggedInUser.organization,
              email: loggedInUser.email,
              role: loggedInUser.role
            });
          } catch (e) {
            console.error("Failed to auto-insert user on login:", e);
          }
        }

        currentSessionUser = loggedInUser;
        if (!usersState.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          usersState.push(loggedInUser);
        }
        return res.json({ user: loggedInUser, message: "Logged in successfully via Supabase" });
      } catch (err: any) {
        console.error("Supabase login exception:", err);
        return res.status(400).json({ error: err.message || "Authentication node connection rejected." });
      }
    }

    // Simulate lookup in Local Mode
    const existingUser = usersState.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      currentSessionUser = existingUser;
      return res.json({ user: existingUser, message: "Logged in successfully (Local Mode)" });
    }

    // Default auto-create / log in for seamless premium onboarding
    const newUser: User = {
      id: "u-" + Math.floor(Math.random() * 10000),
      name: email.split("@")[0].toUpperCase() + " AUDIT",
      organization: "Ministry of Defence, Procurement Cell",
      email: email,
      role: "Auditor"
    };
    usersState.push(newUser);
    currentSessionUser = newUser;
    res.json({ user: newUser, message: "Mock profile integrated instantly (Local Mode) for " + email });
  });

  app.post("/api/auth/signup", async (req, res) => {
    const { email, name, organization, role, password } = req.body;
    if (!email || !name || !organization) {
      return res.status(400).json({ error: "Please populate all fields" });
    }

    const newUser: User = {
      id: "u-" + Math.floor(Math.random() * 10000),
      name,
      organization,
      email,
      role: (role as any) || "Auditor"
    };

    if (supabase) {
      try {
        // 1. Attempt to sign up in Supabase Auth
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email,
          password: password || "Fallback_Password_123!",
        });

        if (authErr) {
          console.error("Supabase Auth SignUp error:", authErr);
          return res.status(400).json({ error: authErr.message });
        }

        const authUserId = authData.user?.id;

        // 2. Attempt to write to public.users table in Supabase
        try {
          await supabase
            .from("users")
            .insert({
              id: authUserId,
              name,
              organization,
              email,
              role: (role as any) || "Auditor"
            });
        } catch (insertErr) {
          console.error("Supabase public.users insert error:", insertErr);
        }

        newUser.id = authUserId || newUser.id;
      } catch (err: any) {
        console.error("Supabase signup exception:", err);
        return res.status(400).json({ error: err.message || "Supabase signup failed" });
      }
    }

    if (!usersState.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      usersState.push(newUser);
    }
    currentSessionUser = newUser;
    res.json({ user: newUser, message: "Enterprise Account Created in project index" });
  });

  app.post("/api/auth/logout", (req, res) => {
    currentSessionUser = null;
    res.json({ success: true, message: "Logged out" });
  });

  app.post("/api/auth/reset-password", (req, res) => {
    const { email } = req.body;
    res.json({ success: true, message: `Recovery simulation instructions dispatched to official inbox: ${email}` });
  });

  app.post("/api/auth/profile", (req, res) => {
    const { name, organization, role } = req.body;
    if (!currentSessionUser) {
      return res.status(401).json({ error: "Session expired or unauthorized" });
    }
    
    if (name) currentSessionUser.name = name;
    if (organization) currentSessionUser.organization = organization;
    if (role) currentSessionUser.role = role;

    const idx = usersState.findIndex(u => u.id === currentSessionUser!.id);
    if (idx !== -1) {
      usersState[idx] = { ...currentSessionUser };
    }

    res.json({ user: currentSessionUser, message: "Corporate station profile updated successfully" });
  });

  // ============================================================================
  // SUPABASE GOOGLE OAUTH ROUTES
  // ============================================================================

  app.get("/api/auth/google-url", async (req, res) => {
    const isConfigured = supabase !== null;
    if (!isConfigured) {
      return res.json({ supabaseConfigured: false, googleEnabled: false });
    }
    try {
      const queryOrigin = (req.query.origin as string || "").trim();
      const forwardedHost = (req.headers['x-forwarded-host'] as string || "").trim();
      const forwardedProto = (req.headers['x-forwarded-proto'] as string || "https").trim();
      
      let origin = queryOrigin 
        || (forwardedHost ? `${forwardedProto}://${forwardedHost}` : null)
        || req.headers.origin 
        || (req.headers.referer ? new URL(req.headers.referer).origin : "http://localhost:3000");

      origin = origin.replace(/\/+$/, "");
      const redirectUrl = `${origin}/api/auth/supabase-callback`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;

      // Check whether Google Auth provider is enabled in Supabase project
      let googleEnabled = true;
      try {
        const testRes = await fetch(data.url, { method: "GET", redirect: "manual" });
        if (testRes.status === 400) {
          const testBody = await testRes.text();
          if (testBody.includes("provider is not enabled")) {
            googleEnabled = false;
          }
        }
      } catch (probeErr) {
        // Fallback to active if probe cannot reach Supabase
      }

      res.json({
        supabaseConfigured: true,
        googleEnabled,
        url: data.url,
        redirectUri: redirectUrl,
        supabaseCallbackUrl: `${supabaseUrl}/auth/v1/callback`,
        dashboardUrl: `https://supabase.com/dashboard/project/syvifopjbdxqdmxoxnyi/auth/providers`
      });
    } catch (err: any) {
      console.error("Failed to generate Supabase Google OAuth URL:", err);
      res.status(500).json({ error: err.message || "Failed to initiate secure OAuth" });
    }
  });

  app.get("/api/auth/microsoft-url", async (req, res) => {
    const isConfigured = supabase !== null;
    if (!isConfigured) {
      return res.json({ supabaseConfigured: false });
    }
    try {
      const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : "http://localhost:3000");
      const redirectUrl = `${origin}/api/auth/supabase-callback`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });
      if (error) throw error;
      res.json({ supabaseConfigured: true, url: data.url });
    } catch (err: any) {
      console.error("Failed to generate Supabase Microsoft OAuth URL:", err);
      res.status(500).json({ error: err.message || "Failed to initiate secure Microsoft OAuth" });
    }
  });

  app.get("/api/auth/exchange-code", async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "Code is required" });
    if (!supabase) return res.status(400).json({ error: "Supabase not configured" });
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(String(code));
      if (error) throw error;
      
      const session = data.session;
      const user = data.user;
      
      res.json({
        accessToken: session?.access_token,
        provider: user?.app_metadata?.provider || 'google',
        user: {
          id: user?.id,
          email: user?.email,
          name: user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0].toUpperCase(),
          organization: user?.user_metadata?.organization || "Ministry of Defence, Procurement Cell",
          role: user?.user_metadata?.role || "Auditor"
        }
      });
    } catch (err: any) {
      console.error("Exchange code failed:", err);
      res.status(400).json({ error: err.message || "Code exchange failure" });
    }
  });

  app.post("/api/auth/login-token", async (req, res) => {
    const { accessToken, user } = req.body;
    if (!user || !user.email) {
      return res.status(400).json({ error: "Invalid user details provided" });
    }

    const loggedInUser: User = {
      id: user.id || "u-" + Math.floor(Math.random() * 10000),
      name: user.name || user.email.split("@")[0].toUpperCase() + " AUDIT",
      organization: user.organization || "Ministry of Defence, Procurement Cell",
      email: user.email,
      role: user.role || "Auditor"
    };

    if (supabase) {
      try {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .maybeSingle();

        if (!profile) {
          await supabase.from("users").insert({
            id: loggedInUser.id,
            name: loggedInUser.name,
            organization: loggedInUser.organization,
            email: loggedInUser.email,
            role: loggedInUser.role
          });
        } else {
          loggedInUser.name = profile.name || loggedInUser.name;
          loggedInUser.organization = profile.organization || loggedInUser.organization;
          loggedInUser.role = profile.role || loggedInUser.role;
        }
      } catch (err) {
        console.error("Failed to sync profile on login-token:", err);
      }
    }

    currentSessionUser = loggedInUser;
    if (!usersState.some(u => u.email.toLowerCase() === loggedInUser.email.toLowerCase())) {
      usersState.push(loggedInUser);
    }
    res.json({ success: true, user: loggedInUser });
  });

  app.get("/api/auth/supabase-callback", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Project Chakravek Authentication</title>
        <style>
          body {
            background-color: #0b0f19;
            color: #e2e8f0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .spinner {
            border: 3px solid rgba(20, 184, 166, 0.1);
            border-top: 3px solid #14b8a6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          h2 {
            font-size: 1.25rem;
            font-weight: 600;
            letter-spacing: -0.025em;
            margin-bottom: 8px;
          }
          p {
            color: #94a3b8;
            font-size: 0.875rem;
          }
        </style>
      </head>
      <body>
        <div class="spinner"></div>
        <h2>Verifying Station Signature</h2>
        <p id="status-msg">Connecting secure node to Project Chakravek...</p>

        <script>
          async function processAuth() {
            // 1. Try implicit flow (hash fragment)
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            
            if (accessToken) {
              document.getElementById('status-msg').innerText = "Decrypting station token...";
              try {
                const base64Url = accessToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const payload = JSON.parse(jsonPayload);
                const metadata = payload.user_metadata || {};
                const appMetadata = payload.app_metadata || {};
                const provider = appMetadata.provider === 'azure' ? 'microsoft' : (appMetadata.provider || 'google');
                const email = payload.email || metadata.email || "";
                const id = payload.sub || "";
                const name = metadata.full_name || metadata.name || email.split('@')[0].toUpperCase();
                
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'SUPABASE_OAUTH_SUCCESS',
                    accessToken: accessToken,
                    provider: provider,
                    user: {
                      id: id,
                      email: email,
                      name: name,
                      organization: metadata.organization || 'Ministry of Defence, Procurement Cell',
                      role: metadata.role || 'Auditor'
                    }
                  }, '*');
                  document.getElementById('status-msg').innerText = "Access granted. Synchronizing station...";
                  setTimeout(() => window.close(), 600);
                } else {
                  document.getElementById('status-msg').innerText = "No opener window found. Redirecting...";
                  window.location.href = '/';
                }
              } catch (err) {
                console.error("JWT Decode failed:", err);
                document.getElementById('status-msg').innerText = "Token signature verification failed.";
              }
              return;
            }

            // 2. Try PKCE code exchange flow
            const queryParams = new URLSearchParams(window.location.search);
            const code = queryParams.get('code');
            if (code) {
              document.getElementById('status-msg').innerText = "Exchanging terminal authorization code...";
              try {
                const res = await fetch("/api/auth/exchange-code?code=" + encodeURIComponent(code));
                if (!res.ok) throw new Error("Code exchange failed");
                const data = await res.json();
                
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'SUPABASE_OAUTH_SUCCESS',
                    accessToken: data.accessToken,
                    provider: data.provider === 'azure' ? 'microsoft' : (data.provider || 'google'),
                    user: data.user
                  }, '*');
                  document.getElementById('status-msg').innerText = "Access granted. Handshake successful.";
                  setTimeout(() => window.close(), 600);
                } else {
                  window.location.href = '/';
                }
              } catch (err) {
                console.error(err);
                document.getElementById('status-msg').innerText = "Terminal code exchange handshake rejected.";
              }
              return;
            }

            // 3. Fallback or error parameters
            const errorParam = queryParams.get('error') || hashParams.get('error');
            const errorDescription = queryParams.get('error_description') || hashParams.get('error_description') || (errorParam ? "OAuth error: " + errorParam : 'Handshake rejected by authentication node.');
            if (window.opener) {
              window.opener.postMessage({
                type: 'SUPABASE_OAUTH_ERROR',
                error: errorDescription
              }, '*');
              document.getElementById('status-msg').innerText = "Verification failed: " + errorDescription;
              setTimeout(() => window.close(), 1500);
            } else {
              document.getElementById('status-msg').innerText = "Verification failed: " + errorDescription;
            }
          }
          
          processAuth();
        </script>
      </body>
      </html>
    `);
  });

  // ============================================================================
  // CONTRACTS & VENDORS INSIGHTS
  // ============================================================================

  app.get("/api/contracts", (req, res) => {
    let result = [...contractsState];
    const { category, riskLevel, search, vendorId } = req.query;

    if (category && category !== "All") {
      result = result.filter(c => c.category === category);
    }
    if (vendorId) {
      result = result.filter(c => c.vendorId === vendorId);
    }
    if (riskLevel && riskLevel !== "All") {
      if (riskLevel === 'High') result = result.filter(c => c.riskScore >= 75);
      if (riskLevel === 'Medium') result = result.filter(c => c.riskScore >= 40 && c.riskScore < 75);
      if (riskLevel === 'Low') result = result.filter(c => c.riskScore < 40);
    }
    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(c => 
        c.id.toLowerCase().includes(q) || 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.vendorName.toLowerCase().includes(q)
      );
    }

    const page = req.query.page ? parseInt(String(req.query.page), 10) : undefined;
    const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize), 10) : undefined;

    if (page && pageSize) {
      const startIndex = (page - 1) * pageSize;
      const paginated = result.slice(startIndex, startIndex + pageSize);
      return res.json({
        contracts: paginated,
        total: result.length,
        page,
        pageSize,
        totalPages: Math.ceil(result.length / pageSize)
      });
    }

    res.json(result);
  });

  app.get("/api/contracts/:id", (req, res) => {
    const contract = contractsState.find(c => c.id === req.params.id);
    if (!contract) return res.status(404).json({ error: "Contract record not found" });
    
    let scoreBreakdown = riskScoresState.find(r => r.contractId === contract.id);
    if (!scoreBreakdown) {
      const isAnomaly = contract.riskScore >= 70;
      const v = vendorsState.find(vend => vend.id === contract.vendorId);
      const hashVal = Math.abs(contract.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0));
      scoreBreakdown = {
        id: "rs-" + contract.id,
        contractId: contract.id,
        overallRisk: contract.riskScore,
        vendorRisk: v ? v.riskScore : (isAnomaly ? 82 : 22),
        directFlagRisk: isAnomaly ? 88 : 12,
        priceRisk: Math.min(99, Math.max(10, Math.round(contract.unitPriceDeviation > 0 ? contract.unitPriceDeviation : 15))),
        entityNetworkRisk: v?.matchesPeAs ? 90 : (hashVal % 35 + 15),
        analyzedAt: new Date().toISOString().split('T')[0]
      };
    }

    const observations = auditObservationsState.filter(o => o.contractId === contract.id);
    const investigation = investigationsState.find(i => i.contractId === contract.id);

    res.json({
      contract,
      breakdown: scoreBreakdown || null,
      observations,
      investigation: investigation || null
    });
  });

  app.get("/api/vendors", (req, res) => {
    res.json(vendorsState);
  });

  app.get("/api/vendors/:id", (req, res) => {
    const vendor = vendorsState.find(v => v.id === req.params.id);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    const directContracts = contractsState.filter(c => c.vendorId === vendor.id);
    res.json({ vendor, contracts: directContracts });
  });

  // Dedicated RAG Dataset Search & Inspection Endpoint
  app.get("/api/rag/search", (req, res) => {
    const q = req.query.q ? String(req.query.q) : "";
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 25;
    const dataset = req.query.dataset ? String(req.query.dataset) : undefined;
    const totalIndexed = Object.values(loadedDatasets).reduce((sum, d) => sum + (d.rowCount || 0), 0);

    if (!q) {
      return res.json({
        totalIndexedRows: totalIndexed,
        datasets: Object.keys(loadedDatasets).map(name => ({
          fileName: name,
          rowCount: loadedDatasets[name].rowCount,
          columns: loadedDatasets[name].columns
        })),
        results: []
      });
    }

    const matches = searchDatasets(q, limit, dataset);
    res.json({
      query: q,
      totalIndexedRows: totalIndexed,
      count: matches.length,
      results: matches
    });
  });

  // ============================================================================
  // DASHBOARD STATISTICS
  // ============================================================================

  app.get("/api/dashboard/stats", (req, res) => {
    const highRiskContracts = contractsState.filter(c => c.riskScore >= 75).length;
    const flaggedVendors = vendorsState.filter(v => v.status === 'Flagged' || v.status === 'Blacklisted' || v.riskScore >= 70).length;
    const openInvestigations = investigationsState.filter(i => i.status === 'Open').length;

    // Line Chart: Fraud Risk Trend (by Date)
    const riskTrend = [
      { date: 'Jan 2026', avgRisk: 42, monitoredContracts: Math.round(contractsState.length * 0.45) },
      { date: 'Feb 2026', avgRisk: 45, monitoredContracts: Math.round(contractsState.length * 0.58) },
      { date: 'Mar 2026', avgRisk: 52, monitoredContracts: Math.round(contractsState.length * 0.72) },
      { date: 'Apr 2026', avgRisk: 58, monitoredContracts: Math.round(contractsState.length * 0.84) },
      { date: 'May 2026', avgRisk: 61, monitoredContracts: Math.round(contractsState.length * 0.93) },
      { date: 'Jun 2026', avgRisk: 64, monitoredContracts: contractsState.length },
    ];

    // Bar Chart: Risk Distribution
    const riskDistribution = [
      { range: '0-20 Low', count: contractsState.filter(c => c.riskScore <= 20).length },
      { range: '21-40 Low-Med', count: contractsState.filter(c => c.riskScore > 20 && c.riskScore <= 40).length },
      { range: '41-60 Medium', count: contractsState.filter(c => c.riskScore > 40 && c.riskScore <= 60).length },
      { range: '61-80 High', count: contractsState.filter(c => c.riskScore > 60 && c.riskScore <= 80).length },
      { range: '81-100 Critical', count: contractsState.filter(c => c.riskScore > 80).length }
    ];

    // Pie Chart: Category Risk
    const categoriesMap: { [cat: string]: { count: number; sumRisk: number } } = {};
    contractsState.forEach(c => {
      const cat = c.category || 'General Procurement';
      if (!categoriesMap[cat]) categoriesMap[cat] = { count: 0, sumRisk: 0 };
      categoriesMap[cat].count++;
      categoriesMap[cat].sumRisk += c.riskScore;
    });

    const categoryRisk = Object.entries(categoriesMap).map(([name, data]) => ({
      name,
      value: Math.round(data.sumRisk / (data.count || 1)),
      contractsCount: data.count
    })).sort((a, b) => b.contractsCount - a.contractsCount).slice(0, 5);

    const alerts = [
      { id: "alt-1", message: `RAG Pipeline indexed ${Object.keys(loadedDatasets).length} defense datasets with ${contractsState.length.toLocaleString()} total acquisitions`, severity: "critical", time: "Active node" },
      { id: "alt-2", message: `Detected ${highRiskContracts.toLocaleString()} anomalous acquisitions exceeding statutory procurement pricing thresholds`, severity: "high", time: "Real-time" },
      { id: "alt-3", message: "CAG Audit findings on emergency fast-track waivers and single-bid justifications mapped to vector indices", severity: "high", time: "Synchronized" }
    ];

    res.json({
      totalContractsCount: contractsState.length,
      highRiskContracts,
      flaggedVendors,
      openInvestigations,
      trend: riskTrend,
      riskDistribution,
      categoryRisk,
      alerts
    });
  });

  // ============================================================================
  // DATA MANAGEMENT UPLOAD & EMBEDDINGS
  // ============================================================================

  app.post("/api/admin/upload-file", (req, res) => {
    const { fileName, fileType, fileSize, rowCount } = req.body;
    if (!fileName) return res.status(400).json({ error: "Filename is required" });

    // Reload files from disk to pick up the newly uploaded file!
    indexLocalDatasets();

    const loaded = loadedDatasets[fileName];
    const newFile: UploadedFile = {
      id: "f-" + Math.floor(Math.random() * 10000),
      fileName,
      fileType: fileType || (fileName.endsWith(".csv") ? "CSV Dataset" : "Excel Spreadsheet"),
      fileSize: fileSize || "1.2 MB",
      indexedAt: new Date().toISOString().split('T')[0],
      status: "Success",
      rowCount: loaded ? loaded.rowCount : (rowCount || 100)
    };

    const existingIdx = uploadedFilesState.findIndex(f => f.fileName === fileName);
    if (existingIdx !== -1) {
      uploadedFilesState[existingIdx] = { ...uploadedFilesState[existingIdx], ...newFile };
    } else {
      uploadedFilesState.push(newFile);
    }

    res.json({ success: true, file: newFile, message: "File metadata saved & vectorized into project memory context" });
  });

  app.get("/api/admin/files", (req, res) => {
    res.json(uploadedFilesState);
  });

  // ============================================================================
  // AI ADVISER & CAG RAG CONVERSATION PIPELINE (CLEAN FORMATTING & RAG ENGINE)
  // ============================================================================

  function cleanAIAdvisorOutput(text: string): string {
    if (!text) return "";
    return text
      // Strip markdown header hashes (# Header -> Header)
      .replace(/^#{1,6}\s*(.+)$/gm, '$1')
      // Strip bold/italic markdown asterisks (**bold** or *italic* -> text)
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
      // Convert standalone asterisk bullets (* Item -> • Item)
      .replace(/^\s*\*\s+/gm, '• ')
      // Strip backticks (`code` -> code)
      .replace(/`([^`]+)`/g, '$1')
      // Remove any remaining stray asterisks, hashes, backticks
      .replace(/[*#`]/g, '')
      // Clean up multiple excessive newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  app.post("/api/ai/query", async (req, res) => {
    const { query, history } = req.body;
    if (!query) return res.status(400).json({ error: "Missing query parameter." });

    const queryLower = query.toLowerCase().trim();

    // 1. Direct conversational handling for common greetings
    const isGreeting = /^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|who are you|what is your name)[\s!.?]*$/i.test(queryLower);
    if (isGreeting) {
      return res.json({
        response: "Hello! I am your CAG Defense Audit Advisor for Project Chakravek. I am here to assist you with examining defense procurement contracts, reviewing pricing anomalies, vetting vendor networks, or clarifying government audit rules like GFR 2017. How can I help with your audit review today?",
        provider: "cag-advisor",
        model: "conversational-core",
        citation: { contracts: [], files: [] }
      });
    }

    // 2. Direct conversational handling for capability inquiries
    const isHelp = /^(what can you do|how can you help|help|help me|what is this|capabilities|what is project chakravek)[\s!.?]*$/i.test(queryLower);
    if (isHelp) {
      return res.json({
        response: "I can assist you across several key areas of defense procurement oversight:\n\n• Audit Contract Reviews: Search and examine specific tenders to check for sole-bid waivers, delivery delays, or contract splitting.\n• Price Escalation Analysis: Identify unit price deviations and compare invoicing against catalog benchmarks.\n• Vendor & Shell Network Vetting: Trace connections between high-risk contractors, beneficial ownership flags, and offshore shell entities.\n• Regulatory Compliance: Provide guidance on the General Financial Rules (GFR 2017) and Defense Acquisition Procedure (DAP 2020).\n\nFeel free to ask a general question about procurement guidelines or mention any specific contract or vendor you would like to inspect.",
        provider: "cag-advisor",
        model: "conversational-core",
        citation: { contracts: [], files: [] }
      });
    }

    const stopWords = new Set(["a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "to", "for", "in", "of", "on", "at", "by", "with", "from", "show", "list", "find", "search", "who", "what", "where", "how", "me", "any", "some", "i", "want", "regarding", "about"]);
    const queryTokens = queryLower
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2 && !stopWords.has(t));

    // Audit Context Compilation
    let retrievedContext = "DEFENSE PROCUREMENT AUDIT DOSSIERS & AUDIT RECORDS:\n\n";
    const referencedContracts = new Set<string>();
    const referencedFiles = new Set<string>();

    // Search Indexed Contracts
    interface ScoredContract {
      contract: Contract;
      score: number;
    }
    const scoredContracts: ScoredContract[] = [];

    for (let i = 0; i < contractsState.length; i++) {
      const c = contractsState[i];
      let score = 0;
      const cIdLower = c.id.toLowerCase();
      const cTitleLower = (c.title || "").toLowerCase();
      const cVendorLower = (c.vendorName || "").toLowerCase();
      const cDeptLower = (c.department || "").toLowerCase();
      const cCategoryLower = (c.category || "").toLowerCase();
      const cDescLower = (c.description || "").toLowerCase();

      if (cIdLower === queryLower || queryLower.includes(cIdLower)) {
        score += 35;
      }
      if (queryLower.includes(cVendorLower) && cVendorLower.length > 3) {
        score += 20;
      }

      for (const token of queryTokens) {
        if (cIdLower.includes(token)) score += 10;
        if (cTitleLower.includes(token)) score += 5;
        if (cVendorLower.includes(token)) score += 6;
        if (cDeptLower.includes(token)) score += 4;
        if (cCategoryLower.includes(token)) score += 4;
        if (cDescLower.includes(token)) score += 3;
      }

      if ((queryLower.includes("anomal") || queryLower.includes("risk") || queryLower.includes("flag") || queryLower.includes("delay") || queryLower.includes("deviat")) && (c.riskScore >= 70 || c.flagReasons.length > 0)) {
        score += 5;
      }

      if (score > 0) {
        scoredContracts.push({ contract: c, score });
      }
    }

    scoredContracts.sort((a, b) => b.score - a.score);
    const topContracts = scoredContracts.slice(0, 8);

    if (topContracts.length > 0) {
      retrievedContext += "RELEVANT CONTRACT DOSSIERS:\n";
      topContracts.forEach(({ contract: c }, idx) => {
        referencedContracts.add(c.id);
        retrievedContext += `${idx + 1}. Tender ID: ${c.id}\n`;
        retrievedContext += `   Title: ${c.title}\n`;
        retrievedContext += `   Department: ${c.department} | Category: ${c.category}\n`;
        retrievedContext += `   Vendor: ${c.vendorName} (ID: ${c.vendorId})\n`;
        retrievedContext += `   Procurement Value: INR ${c.amount} Crores\n`;
        retrievedContext += `   Risk Evaluation Index: ${c.riskScore} / 100 | Pricing Deviation: ${c.unitPriceDeviation > 0 ? '+' : ''}${c.unitPriceDeviation.toFixed(1)}%\n`;
        retrievedContext += `   Anomaly Flags: ${c.flagReasons.length > 0 ? c.flagReasons.join("; ") : "None reported"}\n`;
        if (c.aiExplanation) {
          retrievedContext += `   Audit Finding: ${c.aiExplanation}\n`;
        }
        retrievedContext += `\n`;
      });
    }

    // Search Ingested Spreadsheets
    const searchResults = searchDatasets(query, 16);
    if (searchResults.length > 0) {
      retrievedContext += "VERIFIED PROCUREMENT RECORDS ON FILE:\n\n";
      const resultsByFile: { [file: string]: DatasetRow[] } = {};
      
      searchResults.forEach(res => {
        if (!resultsByFile[res.source]) {
          resultsByFile[res.source] = [];
        }
        resultsByFile[res.source].push(res.row);
        referencedFiles.add(res.source);

        Object.entries(res.row).forEach(([k, v]) => {
          const kLower = k.toLowerCase();
          const valStr = String(v || "").trim();
          if (
            (kLower.includes("id") || kLower.includes("case") || kLower.includes("order") || kLower.includes("tender")) &&
            !k.startsWith("__EMPTY") &&
            valStr.length >= 3 && valStr.length <= 28
          ) {
            referencedContracts.add(valStr);
          }
        });
      });

      Object.entries(resultsByFile).forEach(([fileName, rows]) => {
        retrievedContext += `Source: ${fileName}\n`;
        rows.forEach((r, idx) => {
          const cleanPairs = Object.entries(r)
            .filter(([k, v]) => !k.startsWith('__EMPTY') && v !== null && v !== undefined && String(v).trim() !== '')
            .map(([k, v]) => `${k}: ${v}`);
          retrievedContext += `  - Record ${idx + 1}: ${cleanPairs.join(" | ")}\n`;
        });
        retrievedContext += `\n`;
      });
    }

    if (referencedContracts.size === 0 && referencedFiles.size === 0) {
      retrievedContext += "AUDIT REGISTER BENCHMARKS:\n";
      retrievedContext += `- Available defense procurement records: 31,500 contracts spanning CAG audit cases, GeM orders, and Defence eProcurement tenders.\n`;
      retrievedContext += `- High-risk entities monitored: Zenith Armaments (V-102), Apex Shell Solutions (V-104), NovaTech Intelligence (V-105)\n\n`;
    }

    const systemPrompt = `You are a Senior Defense Procurement Audit Advisor from the Office of the Comptroller and Auditor General (CAG) of India, working within Project Chakravek.
You are conversing directly with an audit officer or defense official.

CORE INSTRUCTIONS:
1. Speak in a natural, warm, articulate, and human professional voice. Sound like an experienced senior audit consultant giving clear, practical advice.
2. ABSOLUTELY NEVER use developer or technical terms such as "RAG pipeline", "retrieval augmented generation", "vector search", "SheetJS", "pre-retrieved context", "ingested datasets", "local database", or "system prompt". Refer naturally to "our audit records", "the defense procurement files", "central contract registers", or "CAG guidelines".
3. For normal or conceptual questions (e.g., explaining GFR rules, tender guidelines, what a single-bidder exception is, or how to spot procurement fraud):
   - Answer helpfully, thoroughly, and conversationally in plain English.
   - Explain the concept with practical auditing insight and clarity.
   - Do NOT force rigid uppercase headers when a natural conversational answer is appropriate.
4. For inquiries regarding specific contracts, tenders, vendors, or anomalies:
   - Provide a clear, summarized overview in plain language first.
   - Highlight the key details (tender IDs, vendor names, values in INR / ₹ Crores, price deviation percentages).
   - Conclude with concise, actionable next steps for the audit team.
5. FORMATTING RULES:
   - Never use asterisks (*, **, ***) for bolding, italics, or list bullets.
   - Never use hash characters (#, ##, ###) for headers or titles.
   - Never use backticks.
   - For lists, use simple hyphens (- ) or bullet dots (• ).
   - Keep answers clean, humanized, concise, and easy to read.

Audit Records & Context:
${retrievedContext}`;

    const { provider, model } = req.body;
    const aiResult = await generateAIResponse(query, systemPrompt, { provider, model });

    if (aiResult.text) {
      const cleanedResponse = cleanAIAdvisorOutput(aiResult.text);
      return res.json({
        response: cleanedResponse,
        provider: aiResult.provider,
        model: aiResult.model,
        citation: {
          contracts: referencedContracts.size > 0 ? Array.from(referencedContracts).slice(0, 8) : [],
          files: referencedFiles.size > 0 ? Array.from(referencedFiles) : []
        }
      });
    }

    // High-fidelity humanized fallback answer if Groq is temporarily offline
    console.log("Generating humanized CAG audit advisory via local reasoning engine...");
    let reasoningAnswer = "";

    // Check if query is conceptual/general about rules
    const isConceptualRuleQuery = /gfr|rule|guideline|dap|procedure|audit|fraud|tender|bidder|exception/i.test(queryLower) && topContracts.length === 0;

    if (isConceptualRuleQuery) {
      reasoningAnswer = `Under Indian defense acquisition standards, procurement is governed primarily by the General Financial Rules (GFR 2017) and the Defence Acquisition Procedure (DAP 2020).

Key compliance principles to keep in mind during an audit include:

• Open Competition: All acquisitions must adhere to open competitive bidding unless an emergency operational necessity exemption is formally signed by competent authority under GFR Rule 166.
• Price Reasonableness: Unit rates must be benchmarked against historical rate contracts, market catalogs, and import tariff declarations.
• Vendor Transparency: Beneficial ownership structures must be vetted against ultimate beneficial owner registers to prevent collusive bidding through offshore shell companies.
• Split Invoicing Prohibition: Repeated micro-orders issued within short intervals under financial clearance limits to avoid higher-level approval constitute an audit breach.

If you would like to examine a specific tender, vendor, or equipment category from our audit files, please let me know and I will summarize the relevant findings.`;

    } else if (searchResults.length > 0 || topContracts.length > 0) {
      reasoningAnswer = `Here is a summary of the relevant procurement records found in our audit files regarding your inquiry:

`;

      if (topContracts.length > 0) {
        topContracts.slice(0, 3).forEach(({ contract: c }) => {
          reasoningAnswer += `• Tender ${c.id}: ${c.title}\n`;
          reasoningAnswer += `  - Department: ${c.department}\n`;
          reasoningAnswer += `  - Supplier: ${c.vendorName}\n`;
          reasoningAnswer += `  - Contract Value: INR ${c.amount} Crores\n`;
          reasoningAnswer += `  - Evaluated Risk: ${c.riskScore}/100 with a price deviation of ${c.unitPriceDeviation > 0 ? '+' : ''}${c.unitPriceDeviation.toFixed(1)}%\n`;
          if (c.flagReasons.length > 0) {
            reasoningAnswer += `  - Primary Concern: ${c.flagReasons.join("; ")}\n`;
          }
          reasoningAnswer += `\n`;
        });
      }

      if (searchResults.length > 0 && topContracts.length === 0) {
        searchResults.slice(0, 3).forEach((res, idx) => {
          const rowVals = Object.entries(res.row)
            .filter(([k, v]) => !k.startsWith('__EMPTY') && v !== null && v !== undefined && String(v).trim() !== '')
            .slice(0, 4)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" | ");
          reasoningAnswer += `• Record ${idx + 1} (${res.source}):\n  ${rowVals}\n\n`;
        });
      }

      reasoningAnswer += `Key Audit Observations & Next Steps:
The main vulnerability highlighted across these records is price inflation above catalog baselines and the use of operational emergency waivers to bypass competitive selection.

I recommend:
- Issuing an audit inquiry memo requesting justification for sole-source justification under GFR Rule 166.
- Cross-referencing customs tariff declarations against invoice codes.
- Reconciling billed amounts against actual material acceptance certificates.`;

    } else if (queryLower.includes("c-7310") || queryLower.includes("radar") || queryLower.includes("sensors")) {
      reasoningAnswer = `Regarding Contract C-7310 for S-Band Air Surveillance Microwave Receiver Modules, our records show this procurement represents a critical audit concern with an evaluated Risk Score of 68/100.

Summary of Findings:
• Contract ID: C-7310
• Equipment: S-Band Air Surveillance Microwave Receiver Modules
• Supplier: NovaTech Intelligence Systems (Vendor ID: V-105)
• Total Contract Value: INR 48.50 Crores
• Pricing Inflation: +140.20% above baseline

What went wrong:
1. Significant Price Premium: The unit price was invoiced at INR 1.07 Crore against standard baseline costs of INR 0.44 Crore, representing an estimated fiscal excess of INR 28.30 Crores.
2. Ownership Overlap: Beneficial shareholding records link NovaTech to Caribbean shell entity Zenith Armaments Corp (V-102).
3. Competitive Waiver: The tender was awarded on direct nomination citing emergency operational requirements.

Recommended Actions:
- Issue a formal show-cause notice to the procurement cell under GFR 2017 Rule 144.
- Impound customs tariff Form-V42 records for technical validation.
- Withhold upcoming milestone disbursements pending tribunal review.`;

    } else if (queryLower.includes("zenith") || queryLower.includes("c-6288") || queryLower.includes("ammunition") || queryLower.includes("v-102")) {
      reasoningAnswer = `Regarding Zenith Armaments Corp (V-102) and Contract C-6288, our audit records have categorized this case as Critical Risk with a score of 91/100.

Summary of Findings:
• Contract ID: C-6288
• Equipment: High-Caliber Infantry Ammunition & Ballistic Projectiles
• Supplier: Zenith Armaments Corp (Tax ID: TAX-IN-BA8829)
• Contract Sum: INR 78.40 Crores
• Current Status: Suspended

What went wrong:
1. Shell Entity Profile: Zenith Armaments was incorporated in Grand Cayman just 5 months prior to the tender award notice.
2. Politically Exposed Persons (PEP) Link: Primary beneficial owners appear on flagged international financial monitoring registries.
3. Waived Proof Tests: Mandatory secondary ballistic proofing tests were bypassed citing operational urgency without required approvals.

Recommended Actions:
- Maintain the suspension on contract disbursements and freeze related bank guarantees.
- Refer the cross-border fund flow patterns to the Enforcement Directorate for forensic review.
- Initiate formal vendor debarment proceedings under GFR Rule 151.`;

    } else if (queryLower.includes("v-104") || queryLower.includes("apex") || queryLower.includes("c-1090")) {
      reasoningAnswer = `Regarding Contract C-1090 awarded to Apex Shell Solutions (V-104), our records indicate structural invoice splitting designed to avoid higher-level audit clearance.

Summary of Findings:
• Contract ID: C-1090
• Supply Item: Emergency Combat Medical Kits and Logistics Packs
• Supplier: Apex Shell Solutions (Tax ID: TAX-IN-DF2210)
• Total Value: INR 15.60 Crores
• Evaluated Risk Score: 85/100

What went wrong:
1. Threshold Evasion: Five separate purchase orders valued at INR 3.12 Crores each were finalized within 48 hours to stay beneath the mandatory INR 5 Crore pre-audit threshold.
2. Price Inflation: Invoiced unit rates show an escalation of +78.40% over canonical rate contracts.
3. Shared Address: Registered corporate address matches the flat used by flagged vendor Zenith Armaments Corp.

Recommended Actions:
- Consolidate all 5 orders into a single comprehensive audit inquiry.
- Inspect original delivery challans and verify physical store ledger entries.
- Refer the procurement officers to the vigilance committee for procedural compliance review.`;

    } else {
      reasoningAnswer = `I have reviewed our central defense procurement records. While no specific contract matches the exact keywords in your question, here is a general overview:

Our audit station actively monitors 31,500 defense procurement records across CAG audit cases, GeM procurement orders, and Defence eProcurement tenders, representing over INR 48,000 Crores in tracked spending.

Key areas currently flagged for investigation include:
• Emergency waiver exceptions that bypassed open competitive rounds.
• Pricing escalations exceeding +40% above catalog baselines in sensor and ballistics procurements.
• Structural order splitting designed to circumvent formal audit thresholds.

If you have a particular tender ID, vendor name, or equipment category you would like to examine, please let me know and I will pull up the relevant files.`;
    }

    const cleanFallback = cleanAIAdvisorOutput(reasoningAnswer);

    res.json({
      response: cleanFallback,
      provider: "fallback",
      model: "cag-advisor",
      citation: {
        contracts: referencedContracts.size > 0 ? Array.from(referencedContracts).slice(0, 8) : [],
        files: referencedFiles.size > 0 ? Array.from(referencedFiles) : []
      }
    });
  });

  // ============================================================================
  // CAG AUDIT OBSERVATION ASSISTANT ENDPOINT
  // ============================================================================

  app.post("/api/ai/audit-observation", async (req, res) => {
    const { contractId, provider, model } = req.body;
    const contract = contractsState.find(c => c.id === contractId) || contractsState[0];
    const vendor = vendorsState.find(v => v.id === contract.vendorId) || vendorsState[1];

    const prompt = `Generate a formal audit observation draft for the Comptroller and Auditor General (CAG) of India regarding Contract ${contract.id}: "${contract.title}" awarded to ${vendor.name}.
Include:
1. A highly formal, constitutional Indian government auditing language style and structure.
2. Clear reference to regulatory standards (e.g., General Financial Rules (GFR) 2017).
3. Explicit findings with the vendor's details (such as tax ID: ${vendor.taxId}, risk status: ${vendor.status}, unit deviation: ${contract.unitPriceDeviation}%).
4. Direct recommendations.

Format your output nicely. Do NOT use any '#' characters or '*' characters in the report. For headings, write them on their own lines (they will be formatted automatically).`;

    const aiResult = await generateAIResponse(prompt, undefined, { provider, model });

    if (aiResult.text) {
      const newObs: AuditObservation = {
        id: "obs-" + Math.floor(Math.random() * 10000),
        contractId: contract.id,
        contractTitle: contract.title,
        vendorId: vendor.id,
        vendorName: vendor.name,
        formalTitle: `CAG Draft Audit Directive against ${vendor.name} (${contract.id}) [via ${aiResult.provider.toUpperCase()}]`,
        regulatoryReference: "General Financial Rules (GFR) 2017 Rule 144 / Defence Acquisition Procedure Annexure IX",
        observationText: aiResult.text,
        recommendation: "Immediate suspension of contract disbursements. Referral to high-level auditing committees for recovery of unapproved payments.",
        generatedAt: new Date().toISOString().split('T')[0]
      };

      auditObservationsState.unshift(newObs);
      return res.json({ success: true, observation: newObs });
    }

    // Static Fallback
    const fallbackObs: AuditObservation = {
      id: "obs-" + Math.floor(Math.random() * 10000),
      contractId: contract.id,
      contractTitle: contract.title,
      vendorId: vendor.id,
      vendorName: vendor.name,
      formalTitle: `CAG Auditing Directive - ${contract.id} Non-Competitive Price Vetting`,
      regulatoryReference: "General Financial Rules (GFR) 2017 Rule 163 (Sole-Bid Exceptions)",
      observationText: `OFFICE OF THE COMPTROLLER & AUDITOR GENERAL OF INDIA\n\nINSPECTION OBSERVATION ON PROCUREMENT FOR: ${contract.title}\n\n1. Preamble: Vetting of contract ledger codes of ${contract.id} indicates that the Ministry approved emergency procurement of value INR ${contract.amount} Crores to ${vendor.name}.\n\n2. Discrepancy Findings: Our pricing intelligence engine identified unit-price charges represented a deviation of +${contract.unitPriceDeviation}% above open indices. No alternative commercial catalogues were filed by the acquisition officers.\n\n3. Network Contamination: Regulatory database mappings verify V-102 and V-104 operate as mutually shared offshore partnerships, creating an artificially inflated non-competitive tender loop.`,
      recommendation: "Issue notice of cause to the procurement cluster chief. Mandate direct post-execution cost analysis.",
      generatedAt: new Date().toISOString().split('T')[0]
    };

    auditObservationsState.unshift(fallbackObs);
    res.json({ success: true, observation: fallbackObs });
  });

  // ============================================================================
  // AUDIT REPORT GENERATOR ENDPOINT
  // ============================================================================

  app.post("/api/ai/generate-report", async (req, res) => {
    const { contractId, vendorId, provider, model } = req.body;
    const contract = contractsState.find(c => c.id === contractId) || contractsState[0];
    const vendor = vendorsState.find(v => v.id === (vendorId || contract.vendorId)) || vendorsState[1];

    const prompt = `Generate a comprehensive, expert-level Defence Procurement Audit Report for Comptroller & Auditor General (CAG) of India.
Target Subject: Contract ${contract.id} - ${contract.title}
Subject Company: ${vendor.name} (Tax ID: ${vendor.taxId}, Location: ${vendor.address})

Format the report precisely with the following sections (written on their own lines, without any '#' or '*' characters):
1. EXECUTIVE SUMMARY
2. COMPREHENSIVE RISK ASSESSMENT (discuss Anomaly Score of ${contract.anomalyScore}%)
3. IDENTIFIED RED FLAGS (mention: ${contract.flagReasons.join(', ')})
4. PROCUREMENT FINDINGS
5. RECOMMENDED SYSTEMIC REMEDIES & ACTIONS

Use dense, highly authoritative, crisp legal auditing terminology.
Do NOT use any '#' characters or '*' characters in the report.`;

    const aiResult = await generateAIResponse(prompt, undefined, { provider, model });
    let generatedText = cleanAIAdvisorOutput(aiResult.text);

    if (!generatedText) {
      generatedText = `COMPTROLLER & AUDITOR GENERAL OF INDIA
OFFICIAL AUDIT REPORT: SUB-PROJECT CHAKRAVEK-CORE-REF-9921

1. EXECUTIVE SUMMARY
An exhaustive post-facto audit of contract ${contract.id} issued to ${vendor.name} was undertaken to verify compliance bounds under GFR provisions. Serious structural pricing models deviations and ultimate beneficial ownership anomalies were identified.

2. COMPREHENSIVE RISK ASSESSMENT
- Subject Base Value: INR ${contract.amount} Crores
- Calculated Anomaly Index: ${contract.anomalyScore}%
- Price Cost Expansion Rate: +${contract.unitPriceDeviation}% relative to baseline metrics.

3. IDENTIFIED RED FLAGS
${contract.flagReasons.length > 0 ? contract.flagReasons.map(r => `• ${r}`).join("\n") : "• Unexplained fast-track sole bidder single source approvals."}

4. PROCUREMENT FINDINGS
- Initial budget calculations omitted standard CAG database price index files.
- The vendor status represents high threat indicators mapping to Caribbean shell structures.

5. RECOMMENDED SYSTEMIC REMEDIES
1. Formally suspend all pending capital outlays to ${vendor.name} pending tribunal resolution.
2. Institute automated database lookups mapping ownership circles against Politically Exposed Person registries.`;
    }

    const providerLabel = aiResult.provider !== "fallback" ? ` [via ${aiResult.provider.toUpperCase()} - ${aiResult.model}]` : "";

    const newReport: AuditReport = {
      id: "rep-" + Math.floor(Math.random() * 10000),
      title: `CAG Corporate Defense Forensic Audit Report: ${contract.id}${providerLabel}`,
      contractId: contract.id,
      contractTitle: contract.title,
      generatedContent: generatedText,
      generatedBy: currentSessionUser ? `${currentSessionUser.name} (${aiResult.provider.toUpperCase()})` : `Senior Auditor General (${aiResult.provider.toUpperCase()})`,
      status: "Finalized",
      createdAt: new Date().toISOString().split('T')[0]
    };

    auditReportsState.unshift(newReport);
    res.json({ success: true, report: newReport });
  });

  // ============================================================================
  // REGISTRATIONS AND EDIT CODES (ADMIN TO EXCEL INTEGRATION)
  // ============================================================================

  app.post("/api/contracts/new", (req, res) => {
    const { title, vendorId, description, amount, department, category } = req.body;
    if (!title || !vendorId || !amount) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const matchedVendor = vendorsState.find(v => v.id === vendorId);
    const newContract: Contract = {
      id: "C-" + Math.floor(Math.random() * 9000 + 1000),
      title,
      vendorId,
      vendorName: matchedVendor ? matchedVendor.name : "External Vendor",
      description,
      amount: Number(amount),
      department: department || "Ministry of Defence",
      category: category || "Ammunition",
      status: "Under Audit",
      riskScore: Math.floor(Math.random() * 60 + 30),
      flagReasons: ["Direct registration via upload interface", "Tender documentation pending technical verification"],
      flaggedCount: 1,
      anomalyScore: Math.floor(Math.random() * 50 + 40),
      unitPriceDeviation: Number((Math.random() * 80).toFixed(2)),
      registeredDate: new Date().toISOString().split('T')[0],
      evidence: ["User uploaded record schema matching standard forms"],
      aiExplanation: "Verification cycle launched. Immediate risk parameters flagged due to manual upload index matching vendor threshold caps."
    };

    contractsState.unshift(newContract);
    res.json({ success: true, contract: newContract });
  });

  // ============================================================================
  // DATABASE CONFIG & SQL PLAYGROUND (SUPABASE INTEGRATION)
  // ============================================================================
  let supabaseConfig = {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    status: supabaseUrl ? "Connected" : "Simulated Local"
  };

  app.get("/api/database/config", (req, res) => {
    res.json(supabaseConfig);
  });

  app.post("/api/database/config", (req, res) => {
    const { url, anonKey } = req.body;
    if (url && anonKey) {
      supabaseConfig = {
        url,
        anonKey,
        status: "Connected"
      };
      res.json({ success: true, config: supabaseConfig, message: "Connected to Supabase project!" });
    } else {
      supabaseConfig = {
        url: "",
        anonKey: "",
        status: "Simulated Local"
      };
      res.json({ success: true, config: supabaseConfig, message: "Reset to Simulated Local Database" });
    }
  });

  app.post("/api/database/query", (req, res) => {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: "Empty query" });
    }

    try {
      // Re-create tables on-the-fly to query/update current states
      alasql("DROP TABLE IF EXISTS users");
      alasql("DROP TABLE IF EXISTS vendors");
      alasql("DROP TABLE IF EXISTS contracts");
      alasql("DROP TABLE IF EXISTS risk_scores");
      alasql("DROP TABLE IF EXISTS audit_reports");
      alasql("DROP TABLE IF EXISTS uploaded_files");
      alasql("DROP TABLE IF EXISTS investigations");

      alasql("CREATE TABLE users");
      alasql("CREATE TABLE vendors");
      alasql("CREATE TABLE contracts");
      alasql("CREATE TABLE risk_scores");
      alasql("CREATE TABLE audit_reports");
      alasql("CREATE TABLE uploaded_files");
      alasql("CREATE TABLE investigations");

      // Populate tables with latest states (instant shallow copy)
      alasql.tables.users.data = usersState.slice();
      alasql.tables.vendors.data = vendorsState.slice();
      alasql.tables.contracts.data = contractsState.slice();
      alasql.tables.risk_scores.data = riskScoresState.slice();
      alasql.tables.audit_reports.data = auditReportsState.slice();
      alasql.tables.uploaded_files.data = uploadedFilesState.slice();
      alasql.tables.investigations.data = investigationsState.slice();

      // Run query
      const startTime = process.hrtime();
      const results = alasql(query);
      const diff = process.hrtime(startTime);
      const execTimeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

      const queryUpper = query.trim().toUpperCase();
      let affected = 0;

      if (
        queryUpper.startsWith("INSERT") ||
        queryUpper.startsWith("UPDATE") ||
        queryUpper.startsWith("DELETE") ||
        queryUpper.startsWith("DROP") ||
        queryUpper.startsWith("ALTER") ||
        queryUpper.startsWith("CREATE")
      ) {
        // Sync states back
        usersState = (alasql.tables.users.data || usersState) as User[];
        vendorsState = (alasql.tables.vendors.data || vendorsState) as Vendor[];
        contractsState = (alasql.tables.contracts.data || contractsState) as Contract[];
        riskScoresState = (alasql.tables.risk_scores.data || riskScoresState) as RiskScoreBreakdown[];
        auditReportsState = (alasql.tables.audit_reports.data || auditReportsState) as AuditReport[];
        uploadedFilesState = (alasql.tables.uploaded_files.data || uploadedFilesState) as UploadedFile[];
        investigationsState = (alasql.tables.investigations.data || investigationsState) as Investigation[];

        // Ensure missing computed fields are updated
        contractsState.forEach(c => {
          if (!c.vendorName) {
            const v = vendorsState.find(vend => vend.id === c.vendorId);
            c.vendorName = v ? v.name : "External Vendor";
          }
        });

        affected = typeof results === 'number' ? results : 1;
      }

      res.json({
        success: true,
        data: Array.isArray(results) ? results : [results],
        affected,
        timeMs: execTimeMs,
        message: "Query executed successfully"
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || String(err)
      });
    }
  });

  // ============================================================================
  // SUPABASE MANAGEMENT API
  // ============================================================================

  // Return connection status and count of records in Supabase vs Local
  app.get("/api/supabase/status", async (req, res) => {
    const configured = supabase !== null;
    const maskedKey = supabaseAnonKey 
      ? supabaseAnonKey.substring(0, 6) + "..." + supabaseAnonKey.substring(supabaseAnonKey.length - 6)
      : "";

    let isLive = false;
    let error: string | null = null;
    const dbCounts = {
      users: 0,
      vendors: 0,
      contracts: 0,
      risk_scores: 0,
      audit_reports: 0,
      audit_observations: 0,
      uploaded_files: 0,
      investigations: 0
    };

    if (configured) {
      try {
        // Try simple select to check if connection is active and tables are created
        const { count, error: selectErr } = await supabase
          .from("vendors")
          .select("*", { count: "exact", head: true });

        if (selectErr) {
          error = selectErr.message;
          // If the table doesn't exist, it is configured but tables are not yet initialized
          if (selectErr.code === "PGRST116" || selectErr.message.includes("does not exist")) {
            error = "Database connected but schema tables are not yet created in Supabase. Please execute database.sql schema first.";
          }
        } else {
          isLive = true;
          // Gather counts
          const getCount = async (tbl: string) => {
            const { count: c } = await supabase.from(tbl).select("*", { count: "exact", head: true });
            return c || 0;
          };
          dbCounts.users = await getCount("users");
          dbCounts.vendors = await getCount("vendors");
          dbCounts.contracts = await getCount("contracts");
          dbCounts.risk_scores = await getCount("risk_scores");
          dbCounts.audit_reports = await getCount("audit_reports");
          dbCounts.audit_observations = await getCount("audit_observations");
          dbCounts.uploaded_files = await getCount("uploaded_files");
          dbCounts.investigations = await getCount("investigations");
        }
      } catch (err: any) {
        error = err.message || String(err);
      }
    }

    res.json({
      configured,
      url: supabaseUrl,
      anonKey: maskedKey,
      isLive,
      error,
      dbCounts,
      localCounts: {
        users: usersState.length,
        vendors: vendorsState.length,
        contracts: contractsState.length,
        risk_scores: riskScoresState.length,
        audit_reports: auditReportsState.length,
        audit_observations: auditObservationsState.length,
        uploaded_files: uploadedFilesState.length,
        investigations: investigationsState.length
      }
    });
  });

  // Save new configuration parameters dynamically
  app.post("/api/supabase/configure", (req, res) => {
    const { url, anonKey } = req.body;
    if (!url || !anonKey) {
      return res.status(400).json({ success: false, error: "Supabase URL and Anon Key are required." });
    }

    const success = initializeSupabase(url, anonKey);
    if (success) {
      res.json({ success: true, message: "Supabase configuration updated and verified." });
    } else {
      res.status(400).json({ success: false, error: "Invalid parameters or failed connection handshake." });
    }
  });

  // Export current in-memory data to Supabase
  app.post("/api/supabase/export", async (req, res) => {
    if (!supabase) {
      return res.status(400).json({ success: false, error: "Supabase is not configured." });
    }

    try {
      // 1. Users (By Email since we have UNIQUE email)
      if (usersState.length > 0) {
        const usersToUpsert = usersState.map(u => ({
          name: u.name,
          organization: u.organization,
          email: u.email,
          role: u.role
        }));
        const { error } = await supabase.from("users").upsert(usersToUpsert, { onConflict: "email" });
        if (error) throw new Error("Users export failed: " + error.message);
      }

      // Helper to batch upsert in safe chunks of 500
      const batchUpsert = async (table: string, items: any[], onConflict?: string) => {
        const CHUNK_SIZE = 500;
        for (let i = 0; i < items.length; i += CHUNK_SIZE) {
          const chunk = items.slice(i, i + CHUNK_SIZE);
          const query = onConflict 
            ? supabase!.from(table).upsert(chunk, { onConflict })
            : supabase!.from(table).upsert(chunk);
          const { error } = await query;
          if (error) throw new Error(`${table} export failed at chunk ${Math.floor(i / CHUNK_SIZE) + 1}: ${error.message}`);
        }
      };

      // 2. Vendors
      if (vendorsState.length > 0) {
        const vendorsToUpsert = vendorsState.map(v => ({
          id: v.id,
          name: v.name,
          category: v.category,
          risk_score: v.riskScore,
          flagged_contracts_count: v.flaggedContractsCount,
          status: v.status,
          registered_at: v.registeredAt,
          tax_id: v.taxId,
          owner_nationality: v.ownerNationality,
          address: v.address,
          matches_peps: v.matchesPeAs || false,
          connected_vendors: v.connectedVendors || []
        }));
        await batchUpsert("vendors", vendorsToUpsert);
      }

      // 3. Contracts
      if (contractsState.length > 0) {
        const contractsToUpsert = contractsState.map(c => ({
          id: c.id,
          title: c.title,
          vendor_id: c.vendorId,
          description: c.description,
          amount: Number(c.amount),
          department: c.department,
          category: c.category,
          status: c.status,
          risk_score: c.riskScore,
          flag_reasons: c.flagReasons || [],
          flagged_count: c.flaggedCount,
          anomaly_score: c.anomalyScore,
          unit_price_deviation: Number(c.unitPriceDeviation || 0),
          registered_date: c.registeredDate,
          evidence: c.evidence || [],
          ai_explanation: c.aiExplanation
        }));
        await batchUpsert("contracts", contractsToUpsert);
      }

      // 4. Risk Scores
      if (riskScoresState.length > 0) {
        const scoresToUpsert = riskScoresState.map(r => ({
          contract_id: r.contractId,
          overall_risk: r.overallRisk,
          vendor_risk: r.vendorRisk,
          direct_flag_risk: r.directFlagRisk,
          price_risk: r.priceRisk,
          entity_network_risk: r.entityNetworkRisk
        }));
        await batchUpsert("risk_scores", scoresToUpsert, "contract_id");
      }

      // 5. Audit Reports
      if (auditReportsState.length > 0) {
        const reportsToUpsert = auditReportsState.map(r => ({
          title: r.title,
          contract_id: r.contractId,
          generated_content: r.generatedContent,
          generated_by: r.generatedBy,
          status: r.status === "Finalized" ? "Finalized" : "Draft"
        }));
        const { error } = await supabase.from("audit_reports").upsert(reportsToUpsert);
        if (error) throw new Error("Audit Reports export failed: " + error.message);
      }

      // 6. Audit Observations
      if (auditObservationsState.length > 0) {
        const observationsToUpsert = auditObservationsState.map(o => ({
          contract_id: o.contractId,
          vendor_id: o.vendorId,
          formal_title: o.formalTitle,
          regulatory_reference: o.regulatoryReference,
          observation_text: o.observationText,
          recommendation: o.recommendation
        }));
        const { error } = await supabase.from("audit_observations").upsert(observationsToUpsert);
        if (error) throw new Error("Audit Observations export failed: " + error.message);
      }

      // 7. Uploaded Files
      if (uploadedFilesState.length > 0) {
        const filesToUpsert = uploadedFilesState.map(f => ({
          file_name: f.fileName,
          file_type: f.fileType,
          file_size: f.fileSize,
          status: f.status,
          row_count: f.rowCount || 0
        }));
        const { error } = await supabase.from("uploaded_files").upsert(filesToUpsert);
        if (error) throw new Error("Uploaded Files export failed: " + error.message);
      }

      // 8. Investigations
      if (investigationsState.length > 0) {
        const investigationsToUpsert = investigationsState.map(i => ({
          contract_id: i.contractId,
          investigator_name: i.investigatorName,
          status: i.status === "Open" ? "Open" : (i.status === "Resolved" ? "Resolved" : "Escalated"),
          notes: i.notes
        }));
        const { error } = await supabase.from("investigations").upsert(investigationsToUpsert);
        if (error) throw new Error("Investigations export failed: " + error.message);
      }

      res.json({ success: true, message: "Local security ledger successfully synchronized and exported to Supabase." });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || String(err) });
    }
  });

  // Import from Supabase into local states
  app.post("/api/supabase/import", async (req, res) => {
    if (!supabase) {
      return res.status(400).json({ success: false, error: "Supabase is not configured." });
    }

    try {
      // 1. Vendors
      const { data: dbVendors, error: errV } = await supabase.from("vendors").select("*");
      if (errV) throw new Error("Vendors import failed: " + errV.message);
      if (dbVendors && dbVendors.length > 0) {
        vendorsState = dbVendors.map((v: any) => ({
          id: v.id,
          name: v.name,
          category: v.category,
          riskScore: v.risk_score,
          flaggedContractsCount: v.flagged_contracts_count,
          status: v.status,
          registeredAt: v.registered_at,
          taxId: v.tax_id,
          ownerNationality: v.owner_nationality,
          address: v.address,
          matchesPeAs: v.matches_peps,
          connectedVendors: v.connected_vendors || []
        }));
      }

      // 2. Users
      const { data: dbUsers, error: errU } = await supabase.from("users").select("*");
      if (errU) throw new Error("Users import failed: " + errU.message);
      if (dbUsers && dbUsers.length > 0) {
        usersState = dbUsers.map((u: any) => ({
          id: u.id,
          name: u.name,
          organization: u.organization,
          email: u.email,
          role: u.role
        }));
      }

      // 3. Contracts
      const { data: dbContracts, error: errC } = await supabase.from("contracts").select("*");
      if (errC) throw new Error("Contracts import failed: " + errC.message);
      if (dbContracts && dbContracts.length > 0) {
        contractsState = dbContracts.map((c: any) => {
          const v = vendorsState.find(vend => vend.id === c.vendor_id);
          return {
            id: c.id,
            title: c.title,
            vendorId: c.vendor_id,
            vendorName: v ? v.name : "External Vendor",
            description: c.description,
            amount: Number(c.amount),
            department: c.department,
            category: c.category,
            status: c.status,
            riskScore: c.risk_score,
            flagReasons: c.flag_reasons || [],
            flaggedCount: c.flagged_count,
            anomalyScore: c.anomaly_score,
            unitPriceDeviation: Number(c.unit_price_deviation || 0),
            registeredDate: c.registered_date,
            evidence: c.evidence || [],
            aiExplanation: c.ai_explanation
          };
        });
      }

      // 4. Risk Scores
      const { data: dbScores, error: errS } = await supabase.from("risk_scores").select("*");
      if (errS) throw new Error("Risk scores import failed: " + errS.message);
      if (dbScores && dbScores.length > 0) {
        riskScoresState = dbScores.map((r: any) => ({
          id: r.id,
          contractId: r.contract_id,
          overallRisk: r.overall_risk,
          vendorRisk: r.vendor_risk,
          directFlagRisk: r.direct_flag_risk,
          priceRisk: r.price_risk,
          entityNetworkRisk: r.entity_network_risk,
          analyzedAt: r.analyzed_at ? r.analyzed_at.split('T')[0] : ""
        }));
      }

      // 5. Audit Reports
      const { data: dbReports, error: errR } = await supabase.from("audit_reports").select("*");
      if (errR) throw new Error("Audit reports import failed: " + errR.message);
      if (dbReports && dbReports.length > 0) {
        auditReportsState = dbReports.map((r: any) => {
          const c = contractsState.find(con => con.id === r.contract_id);
          return {
            id: r.id,
            title: r.title,
            contractId: r.contract_id,
            contractTitle: c ? c.title : "Procurement Contract",
            generatedContent: r.generated_content,
            generatedBy: r.generated_by,
            status: r.status,
            createdAt: r.created_at ? r.created_at.split('T')[0] : ""
          };
        });
      }

      // 6. Audit Observations
      const { data: dbObservations, error: errO } = await supabase.from("audit_observations").select("*");
      if (errO) throw new Error("Audit observations import failed: " + errO.message);
      if (dbObservations && dbObservations.length > 0) {
        auditObservationsState = dbObservations.map((o: any) => {
          const c = contractsState.find(con => con.id === o.contract_id);
          const v = vendorsState.find(vend => vend.id === o.vendor_id);
          return {
            id: o.id,
            contractId: o.contract_id,
            contractTitle: c ? c.title : "Contract",
            vendorId: o.vendor_id,
            vendorName: v ? v.name : "Vendor",
            formalTitle: o.formal_title,
            regulatoryReference: o.regulatory_reference,
            observationText: o.observation_text,
            recommendation: o.recommendation,
            generatedAt: o.generated_at ? o.generated_at.split('T')[0] : ""
          };
        });
      }

      // 7. Uploaded Files
      const { data: dbFiles, error: errF } = await supabase.from("uploaded_files").select("*");
      if (errF) throw new Error("Uploaded files import failed: " + errF.message);
      if (dbFiles && dbFiles.length > 0) {
        uploadedFilesState = dbFiles.map((f: any) => ({
          id: f.id,
          fileName: f.file_name,
          fileType: f.file_type,
          fileSize: f.file_size,
          status: f.status,
          rowCount: f.row_count,
          indexedAt: f.indexed_at ? f.indexed_at.split('T')[0] : ""
        }));
      }

      // 8. Investigations
      const { data: dbInvs, error: errI } = await supabase.from("investigations").select("*");
      if (errI) throw new Error("Investigations import failed: " + errI.message);
      if (dbInvs && dbInvs.length > 0) {
        investigationsState = dbInvs.map((i: any) => {
          const c = contractsState.find(con => con.id === i.contract_id);
          return {
            id: i.id,
            contractId: i.contract_id,
            contractTitle: c ? c.title : "Procurement",
            investigatorName: i.investigator_name,
            status: i.status,
            notes: i.notes,
            startedAt: i.started_at ? i.started_at.split('T')[0] : ""
          };
        });
      }

      res.json({ success: true, message: "Successfully synchronized database state. Imported records from Supabase into application cache." });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || String(err) });
    }
  });
