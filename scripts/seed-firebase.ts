/**
 * Seed Firebase Realtime Database with dummy data for testing
 *
 * Usage: npx tsx scripts/seed-firebase.ts
 * or: npm run seed
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import credentials from "../lib/firebase-credentials.json";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: credentials.project_id,
      clientEmail: credentials.client_email,
      privateKey: credentials.private_key.replace(/\\n/g, "\n"),
    }),
    databaseURL:
      "https://herbful-535e4-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

const db = getDatabase();

interface Treatment {
  id: number;
  name: string;
  category: string[];
  symptoms: string[];
  imageUrl: string;
  sourceType: string;
  sourceInfo: {
    authority: string;
    url: string;
    description: string;
    verificationDate: string;
  };
  preparation: string;
  usage: string;
  dosage: string;
  warnings: string;
  benefits: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

interface Review {
  treatmentName: string;
  treatmentId: string;
  rating: number;
  comment: string;
  userName: string;
  userEmail: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

// Herbal remedies data from up.html
const herbalTreatments: Omit<
  Treatment,
  "averageRating" | "totalReviews" | "createdAt" | "updatedAt"
>[] = [
  {
    id: 1,
    name: "Malunggay",
    category: ["Metabolic", "Lactation", "Anti-inflammatory"],
    symptoms: [
      "Chest heaviness",
      "dizziness",
      "fatigue",
      "frequent urination",
      "excessive thirst",
      "tiredness",
      "headaches",
      "shortness of breath",
      "swelling",
      "joint stiffness",
      "body pain",
      "low breastmilk flow",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Boil fresh leaves (5-10 minutes) and drink as tea, Add to soups and dishes",
    usage: "Oral consumption",
    dosage: "As needed for symptoms",
    warnings:
      "Consult doctor for chronic conditions, May interact with diabetes medications",
    benefits: [
      "High cholesterol management",
      "Blood sugar control",
      "Blood pressure management",
      "Anti-inflammatory",
      "Increases breastmilk supply",
    ],
  },
  {
    id: 2,
    name: "Lomboy (Duhat)",
    category: ["Metabolic", "Digestive", "Oral Health"],
    symptoms: [
      "Frequent urination",
      "excessive thirst",
      "tiredness",
      "loose bowel movement",
      "stomach pain",
      "gum swelling",
      "gum bleeding",
      "slow healing wounds",
      "skin irritation",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Boil fresh or dried leaves for 10-15 minutes and drink as tea, Pound leaves and apply as poultice",
    usage: "Oral consumption or topical application",
    dosage: "As needed for symptoms",
    warnings:
      "Monitor blood sugar levels, Consult dentist for persistent gum problems",
    benefits: [
      "Blood sugar management",
      "Diarrhea relief",
      "Oral health improvement",
      "Wound healing",
    ],
  },
  {
    id: 3,
    name: "Tawa-Tawa",
    category: ["Hematological", "Respiratory", "Digestive"],
    symptoms: [
      "Persistent fever",
      "low platelet-related bleeding",
      "cough",
      "difficulty breathing/wheezing",
      "diarrhea",
      "indigestion",
      "sore or bleeding gums",
      "slow wound healing",
      "respiratory discomfort",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Boil handful of fresh leaves in 2 cups of water for 10-15 minutes, Crush leaves for topical application",
    usage: "Oral consumption or topical application",
    dosage: "1 cup 3-4 times daily",
    warnings:
      "Not a substitute for medical treatment in dengue, Consult doctor for persistent fever",
    benefits: [
      "Traditionally used to increase platelet count in dengue",
      "Asthma and bronchitis relief",
      "Anti-inflammatory",
      "Diuretic properties",
    ],
  },
  {
    id: 4,
    name: "Sambong",
    category: ["Diuretic", "Respiratory", "Anti-inflammatory"],
    symptoms: [
      "Frequent urination",
      "urinary discomfort or blockage",
      "respiratory congestion",
      "cough",
      "fever heat",
      "headache",
      "joint or body aches",
      "gastric pain",
      "wound soreness",
      "inflammation",
      "skin irritation",
    ],
    imageUrl: "",
    sourceType: "Verified Source",
    sourceInfo: {
      authority: "Philippine Department of Health",
      url: "https://pitahc.gov.ph/directory-of-herbs/",
      description: "Approved herbal medicine by PITAHC",
      verificationDate: "01/01/2023",
    },
    preparation:
      "Boil 50g of fresh leaves or 25g of dried leaves in 1 liter of water for 10-15 minutes",
    usage: "Drink as tea or use essential oil in topical applications",
    dosage: "1 cup three times a day",
    warnings:
      "Consult doctor for kidney problems, May cause allergic reactions",
    benefits: [
      "Eliminates kidney stones",
      "Relieves rheumatism and hypertension",
      "Treats colds and coughs",
    ],
  },
  {
    id: 5,
    name: "Oregano",
    category: ["Respiratory", "Digestive", "Anti-inflammatory"],
    symptoms: [
      "Cough",
      "sore throat",
      "congestion",
      "mild fever",
      "indigestion",
      "stomach upset",
      "menstrual pain",
      "skin irritation",
      "wound soreness",
      "respiratory discomfort",
      "sinus congestion",
    ],
    imageUrl: "",
    sourceType: "Verified Source",
    sourceInfo: {
      authority: "Philippine Department of Health",
      url: "https://www.stuartxchange.org/Oregano.html",
      description: "Traditional medicinal herb with scientific backing",
      verificationDate: "01/01/2023",
    },
    preparation:
      "Boil 5-10 fresh leaves in 2 cups of water, Crush leaves for poultice, Use essential oil in diluted form",
    usage: "Drink as tea, gargle, or apply topically",
    dosage: "1/2 cup 3 times daily",
    warnings:
      "Avoid during pregnancy, May cause skin irritation in sensitive individuals",
    benefits: [
      "Treats cough, asthma, sore throat",
      "Antibacterial and anti-inflammatory",
      "Relieves indigestion and menstrual cramps",
    ],
  },
  {
    id: 6,
    name: "Serpentina",
    category: ["Cardiovascular", "Neurological", "Metabolic"],
    symptoms: [
      "Elevated blood pressure",
      "inflammation-related pain",
      "fever",
      "respiratory discomfort",
      "high blood sugar symptoms",
      "digestive upset",
      "stress and anxiety",
      "sleep disturbances",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Boil leaves or roots into decoction, Make into capsules and extracts",
    usage: "Oral consumption or topical application",
    dosage: "As directed by traditional practitioner",
    warnings:
      "STRONG MEDICINAL HERB - CONSULT DOCTOR, May interact with blood pressure medications, Not for self-medication",
    benefits: [
      "Blood pressure management",
      "Anti-inflammatory",
      "Respiratory infection relief",
      "Anxiety and insomnia relief",
    ],
  },
  {
    id: 7,
    name: "Pansit-Pansitan",
    category: ["Anti-inflammatory", "Pain Relief", "Dermatological"],
    symptoms: [
      "Joint pain and swelling",
      "skin inflammation or infection",
      "headache",
      "abdominal discomfort",
      "urinary or kidney-related pain",
      "fever",
      "sore throat",
      "wound or burn soreness",
      "eye irritation",
      "elevated blood pressure",
      "digestive upset",
      "mental restlessness",
    ],
    imageUrl: "",
    sourceType: "Verified Source",
    sourceInfo: {
      authority: "Philippine Department of Health",
      url: "https://pitahc.gov.ph/directory-of-herbs/",
      description: "Approved herbal medicine by PITAHC",
      verificationDate: "01/01/2023",
    },
    preparation:
      "Eat raw as salad, Boil 1 cup of leaves/stems in 2 cups of water, Pound into poultice",
    usage: "Oral consumption or topical application",
    dosage: "1 cup twice daily (morning and evening)",
    warnings:
      "Consult doctor for kidney problems, May interact with blood pressure medications",
    benefits: [
      "Lowers uric acid for gout",
      "Anti-inflammatory",
      "Pain relief for arthritis and headaches",
    ],
  },
  {
    id: 8,
    name: "Tanglad",
    category: ["Digestive", "Cardiovascular", "Respiratory"],
    symptoms: [
      "Upset stomach",
      "bloating",
      "indigestion cramps",
      "fever heat",
      "headache",
      "elevated blood pressure symptoms",
      "muscle or joint aches",
      "anxiety or tension",
      "fungal skin irritation",
      "dandruff",
      "cough and congestion",
      "frequent urination",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Boil fresh stalks or leaves for 5-15 minutes, Use diluted essential oil topically or by inhalation",
    usage: "Drink as tea or use topically",
    dosage: "As needed for symptoms",
    warnings: "May cause skin sensitivity to sunlight, Use in moderation",
    benefits: [
      "Digestive relief",
      "Blood pressure management",
      "Anxiety reduction",
      "Fungal infection treatment",
    ],
  },
  {
    id: 9,
    name: "Bayabas (Guava)",
    category: ["Digestive", "Oral Health", "Dermatological"],
    symptoms: [
      "Loose or painful bowel movements",
      "cough",
      "chest congestion",
      "mouth or gum discomfort",
      "elevated blood sugar symptoms",
      "high blood pressure symptoms",
      "inflammation or swelling",
      "skin irritation",
      "acne",
      "wound soreness",
      "indigestion",
      "bloating",
    ],
    imageUrl: "",
    sourceType: "Verified Source",
    sourceInfo: {
      authority: "Philippine Department of Health",
      url: "https://pitahc.gov.ph/directory-of-herbs/",
      description: "Approved herbal medicine by PITAHC",
      verificationDate: "01/01/2023",
    },
    preparation:
      "Boil 4-6 fresh leaves in water for 10-15 minutes, Crush leaves into paste for topical use",
    usage: "Drink as tea or apply topically",
    dosage: "As needed for symptoms",
    warnings: "Use in moderation, Consult doctor for persistent diarrhea",
    benefits: [
      "Treats diarrhea, gum infections, and wounds",
      "Supports immune and heart health",
    ],
  },
  {
    id: 10,
    name: "Herbaka",
    category: ["Gynecological", "Digestive", "Antimalarial"],
    symptoms: [
      "Irregular menstrual flow or delay",
      "abdominal pain or cramps",
      "fever or chills",
      "abdominal bloating or gas-related discomfort",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Boil 7 leaves in 3 glasses of water for menstrual issues, Squeeze leaves for juice extraction, Pound leaves for poultice",
    usage: "Oral consumption or topical application",
    dosage:
      "1/2 glass twice daily for menstruation, 1 tablespoon daily for stomachache",
    warnings:
      "Consult doctor for persistent menstrual issues, Not for pregnant women",
    benefits: [
      "Regulates menstruation",
      "Stomachache relief",
      "Malaria symptom management",
      "Gas pain relief",
    ],
  },
  {
    id: 11,
    name: "Gawed",
    category: ["Dermatological", "Oral Health", "Anti-inflammatory"],
    symptoms: [
      "Infected or slow-healing wounds",
      "skin redness and swelling",
      "cough and throat irritation",
      "tooth pain",
      "joint stiffness or pain",
      "stomach discomfort",
      "bloating",
      "indigestion",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Wash and pound fresh leaves for poultice, Boil leaves for wash or mouth rinse",
    usage: "Topical application or oral rinse",
    dosage: "Apply as needed to affected areas",
    warnings: "Test on small skin area first, Avoid swallowing mouth rinse",
    benefits: [
      "Wound healing",
      "Skin infection treatment",
      "Cough and sore throat relief",
      "Toothache relief",
      "Arthritis pain management",
    ],
  },
  {
    id: 12,
    name: "Biday",
    category: ["Anti-inflammatory", "Dermatological"],
    symptoms: [
      "Skin redness",
      "swelling",
      "pain from boils",
      "joint pain or stiffness",
      "inflammation in affected areas",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Boil fresh stem or roots thoroughly to remove toxins, Pound leaves or stem for poultice",
    usage: "External application on affected areas",
    dosage: "Apply as needed",
    warnings:
      "MUST BOIL THOROUGHLY TO REMOVE TOXINS, Not for internal use without proper preparation",
    benefits: [
      "Reduces swelling",
      "Traditional use for snake bites",
      "Boil treatment",
      "Rheumatism relief",
    ],
  },
  {
    id: 13,
    name: "Kamyas",
    category: ["Respiratory", "Cardiovascular", "Dermatological"],
    symptoms: [
      "Coughing",
      "sore throat",
      "nasal congestion",
      "dizziness from high blood pressure",
      "skin itching or irritation",
      "joint pain and swelling",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Eat fresh fruits raw or as juice, Boil leaves for decoction, Apply leaves as poultice",
    usage: "Oral consumption or topical application",
    dosage: "As needed for symptoms",
    warnings:
      "May cause stomach upset in sensitive individuals, Monitor blood pressure",
    benefits: [
      "Cough and cold relief",
      "Blood pressure management",
      "Skin infection treatment",
      "Rheumatism relief",
    ],
  },
  {
    id: 14,
    name: "Lagundi",
    category: ["Respiratory", "Anti-inflammatory"],
    symptoms: [
      "Persistent coughing",
      "wheezing or shortness of breath",
      "body heat or fever",
      "nasal congestion",
      "skin rashes or itching",
      "abdominal pain with diarrhea",
    ],
    imageUrl: "",
    sourceType: "Verified Source",
    sourceInfo: {
      authority: "Philippine Department of Health",
      url: "https://pitahc.gov.ph/directory-of-herbs/",
      description: "Approved herbal medicine by PITAHC",
      verificationDate: "01/01/2023",
    },
    preparation: "Boil 5 leaves in 2 cups of water for 10-15 minutes",
    usage: "Drink as tea or apply poultice externally",
    dosage: "1 cup 3 times a day",
    warnings:
      "Not for children under 2 years old, Discontinue if rash or allergic reaction occurs",
    benefits: [
      "Cough and asthma relief",
      "Reduces inflammation",
      "Acts as bronchodilator and expectorant",
    ],
  },
  {
    id: 15,
    name: "Subusob",
    category: ["Dermatological", "Wound Care"],
    symptoms: [
      "Bleeding",
      "skin irritation",
      "swelling",
      "pain from wounds or burns",
      "redness and itching from insect bites",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Wash, pound, and apply fresh leaves directly, Use leaf decoction for washing wounds",
    usage: "Topical application",
    dosage: "Apply as needed to affected areas",
    warnings:
      "Clean wounds properly before application, Seek medical help for serious wounds",
    benefits: [
      "Stops bleeding",
      "Wound and cut treatment",
      "Skin infection management",
      "Burn relief",
      "Insect bite treatment",
    ],
  },
  {
    id: 16,
    name: "Kutsay",
    category: ["Digestive", "Cardiovascular", "Antimicrobial"],
    symptoms: [
      "Bloating",
      "stomach pain",
      "indigestion",
      "loss of appetite",
      "dizziness from high blood pressure",
      "slow-healing wounds",
      "skin irritation",
    ],
    imageUrl: "",
    sourceType: "Verified Source",
    sourceInfo: {
      authority: "StuartXchange",
      url: "https://www.stuartxchange.org/Kuchai.html",
      description: "Traditional medicinal herb documentation",
      verificationDate: "01/01/2023",
    },
    preparation:
      "Eat raw or cooked, Pound for poultice, Make decoction from leaves",
    usage: "Oral consumption or topical application",
    dosage: "As culinary ingredient or small doses of juice extract",
    warnings: "May interact with blood thinners, Use in moderation",
    benefits: [
      "Lowers blood pressure",
      "Improves digestion",
      "Antibacterial and antifungal",
      "Appetite stimulation",
    ],
  },
  {
    id: 17,
    name: "Banaba",
    category: ["Metabolic", "Renal", "Cardiovascular"],
    symptoms: [
      "Frequent urination",
      "excessive thirst",
      "fatigue",
      "high blood sugar symptoms",
      "painful urination",
      "swelling",
      "dizziness from high blood pressure",
      "weight gain",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Boil leaves for 10-15 minutes as tea, Eat young leaves fresh, Use dried leaves for herbal tea",
    usage: "Oral consumption",
    dosage: "As needed for symptoms",
    warnings:
      "Monitor blood sugar levels, Consult doctor for diabetes management",
    benefits: [
      "Diabetes management",
      "Urinary tract infection treatment",
      "Kidney support",
      "Weight management",
      "Blood pressure control",
    ],
  },
  {
    id: 18,
    name: "Anunas",
    category: ["Digestive", "Dermatological"],
    symptoms: [
      "Stomach pain",
      "loose bowel movement",
      "fever and body heat",
      "skin swelling or redness",
      "boils",
      "bloating",
      "poor digestion",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Boil leaves for decoction, Crush fresh leaves for external application, Eat fruit fresh",
    usage: "Oral consumption or topical application",
    dosage: "As needed for symptoms",
    warnings:
      "Seeds may be toxic in large quantities, Consult doctor for persistent diarrhea",
    benefits: [
      "Diarrhea and dysentery relief",
      "Fever reduction",
      "Skin infection treatment",
      "Digestive improvement",
    ],
  },
  {
    id: 19,
    name: "Miracle Fruit",
    category: ["Metabolic", "Appetite Regulation"],
    symptoms: [
      "High blood sugar symptoms",
      "loss of appetite",
      "craving for sweets",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation: "Eat fresh berries, Boil leaves for tea in some practices",
    usage: "Oral consumption",
    dosage: "As needed typically before meals",
    warnings:
      "Not a substitute for diabetes medication, Monitor blood sugar levels",
    benefits: [
      "Blood sugar management support",
      "Natural sweetener alternative",
      "Appetite improvement",
    ],
  },
  {
    id: 20,
    name: "Avocado Leaves",
    category: ["Renal", "Digestive", "Cardiovascular"],
    symptoms: [
      "Painful urination",
      "frequent urination",
      "stomach pain",
      "loose stools",
      "dizziness",
      "high blood pressure symptoms",
      "headache",
      "body pain",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Boil fresh or dried leaves for 10-15 minutes, Crush leaves for poultice",
    usage: "Drink as tea or apply topically",
    dosage: "As needed for symptoms",
    warnings:
      "Consult doctor for kidney stones, May cause allergic reactions in sensitive individuals",
    benefits: [
      "Kidney stone management",
      "Urinary tract infection relief",
      "Diarrhea treatment",
      "Blood pressure management",
    ],
  },
  {
    id: 21,
    name: "Tagumbao",
    category: ["Respiratory", "Digestive", "Dermatological"],
    symptoms: [
      "Persistent coughing",
      "fever and body heat",
      "abdominal pain",
      "minor cuts and wounds",
      "swelling",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Boil leaves for tea or decoction, Pound fresh leaves for poultice",
    usage: "Oral consumption or topical application",
    dosage: "As needed for symptoms",
    warnings:
      "Consult doctor for persistent symptoms, Clean wounds properly before application",
    benefits: [
      "Cough relief",
      "Fever reduction",
      "Stomach pain relief",
      "Wound treatment",
    ],
  },
  {
    id: 22,
    name: "Papaya Leaves",
    category: ["Hematological", "Digestive", "Antiparasitic"],
    symptoms: [
      "Low platelet count",
      "fever",
      "stomach pain",
      "indigestion",
      "bloating",
      "loss of appetite",
      "intestinal discomfort",
      "menstrual cramps",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sourceInfo: {
      authority: "",
      url: "",
      description: "",
      verificationDate: "",
    },
    preparation:
      "Boil fresh leaves for 10-15 minutes, Extract juice from crushed leaves",
    usage: "Oral consumption",
    dosage: "As needed for symptoms",
    warnings:
      "Not a substitute for medical treatment in dengue, Consult doctor for persistent fever",
    benefits: [
      "Dengue fever supportive care",
      "Digestive problem relief",
      "Intestinal worm treatment",
      "Menstrual pain relief",
    ],
  },
  {
    id: 23,
    name: "Tsaang Gubat",
    category: ["Digestive", "Oral Health"],
    symptoms: [
      "Stomach spasms",
      "diarrhea",
      "intestinal discomfort",
      "oral cavities/decay",
      "allergic rhinitis",
      "sneezing or irritation",
    ],
    imageUrl: "",
    sourceType: "Verified Source",
    sourceInfo: {
      authority: "Philippine Department of Health",
      url: "https://pitahc.gov.ph/directory-of-herbs/",
      description: "Approved herbal medicine by DOH",
      verificationDate: "01/01/2023",
    },
    preparation: "Boil 1 cup of dried leaves in 2 cups of water for 10 minutes",
    usage: "Drink as tea or use as mouthwash",
    dosage: "1 cup before meals",
    warnings: "Avoid excessive use, Consult doctor for persistent diarrhea",
    benefits: [
      "Treats stomachache and diarrhea",
      "Used as mouthwash for gum infections",
    ],
  },
  {
    id: 24,
    name: "Akapulko",
    category: ["Dermatological", "Antifungal"],
    symptoms: [
      "Itchy, scaly skin patches",
      "rash",
      "irritation from fungal infections",
    ],
    imageUrl: "",
    sourceType: "Verified Source",
    sourceInfo: {
      authority: "Philippine Department of Health",
      url: "https://pitahc.gov.ph/directory-of-herbs/",
      description: "Approved herbal medicine by DOH",
      verificationDate: "01/01/2023",
    },
    preparation: "Crush fresh leaves into paste, Apply as lotion/ointment",
    usage: "Topical application on affected areas",
    dosage: "Apply twice daily",
    warnings:
      "Do not apply on open wounds, Test on small area first for sensitivity",
    benefits: [
      "Treats fungal skin infections (ringworm, scabies, eczema)",
      "Mild laxative properties",
    ],
  },
  {
    id: 25,
    name: "Yerba Buena",
    category: ["Pain Relief", "Respiratory", "Digestive"],
    symptoms: [
      "Headache",
      "toothache",
      "joint or menstrual pain",
      "cough",
      "sinus congestion",
      "indigestion/gas",
      "unpleasant mouth odor",
    ],
    imageUrl: "",
    sourceType: "Verified Source",
    sourceInfo: {
      authority: "Philippine Department of Health",
      url: "https://pitahc.gov.ph/directory-of-herbs/",
      description: "Approved herbal medicine by DOH",
      verificationDate: "01/01/2023",
    },
    preparation:
      "Boil leaves for tea, Infuse in oil, Use as poultice or inhalation",
    usage: "Drink as tea or apply topically",
    dosage: "3 times a day as needed",
    warnings:
      "Avoid during pregnancy, May cause skin irritation in some individuals",
    benefits: [
      "Relieves body pain, headache, nausea, cough",
      "Digestive comfort",
    ],
  },
  {
    id: 26,
    name: "Bawang",
    category: ["Cardiovascular", "Antimicrobial"],
    symptoms: [
      "High blood pressure (dizziness/throbbing)",
      "elevated cholesterol",
      "mild infections",
      "poor digestion",
    ],
    imageUrl: "",
    sourceType: "Verified Source",
    sourceInfo: {
      authority: "Philippine Department of Health",
      url: "https://pitahc.gov.ph/directory-of-herbs/",
      description: "Approved herbal medicine by DOH",
      verificationDate: "01/01/2023",
    },
    preparation: "Consume raw, cooked, or in oil/extract form",
    usage: "Oral consumption",
    dosage: "1-2 raw cloves daily or as capsules",
    warnings: "May interact with blood thinners, Can cause stomach irritation",
    benefits: [
      "Lowers blood pressure and cholesterol",
      "Antibacterial properties",
      "Cardiovascular support",
    ],
  },
  {
    id: 27,
    name: "Niyog-Niyogan",
    category: ["Antiparasitic", "Anti-inflammatory"],
    symptoms: [
      "Worm infestation (abdominal discomfort, itching)",
      "body aches",
      "fever",
      "headache",
    ],
    imageUrl: "",
    sourceType: "Verified Source",
    sourceInfo: {
      authority: "Philippine Department of Health",
      url: "https://pitahc.gov.ph/directory-of-herbs/",
      description: "Approved herbal medicine by DOH",
      verificationDate: "01/01/2023",
    },
    preparation: "Eat seeds or prepare leaf/root decoctions",
    usage: "Oral consumption",
    dosage: "8-10 seeds for children 4-6 years old, 2 hours after eating",
    warnings:
      "STRICT SUPERVISION REQUIRED, Follow correct dosage precisely, Can be toxic in high doses",
    benefits: [
      "Deworming, especially in children",
      "Relieves rheumatism and diarrhea",
    ],
  },
  {
    id: 28,
    name: "Ampalaya",
    category: ["Endocrine", "Digestive", "Anti-inflammatory"],
    symptoms: [
      "High blood sugar symptoms (fatigue, thirst)",
      "digestive discomfort",
      "inflammation",
      "high cholesterol",
    ],
    imageUrl: "",
    sourceType: "Verified Source",
    sourceInfo: {
      authority: "Philippine Department of Health",
      url: "https://pitahc.gov.ph/directory-of-herbs/",
      description: "Approved herbal medicine by DOH",
      verificationDate: "01/01/2023",
    },
    preparation: "Eat cooked leaves or fruits, Prepare as juice or tea",
    usage: "Oral consumption",
    dosage: "1/2 cup twice a day",
    warnings:
      "May interact with diabetes medications, Not recommended during pregnancy",
    benefits: [
      "Lowers blood sugar",
      "Improves digestion",
      "Anti-inflammatory properties",
    ],
  },
];

// Sample reviews data for herbal treatments
const sampleReviews: Omit<Review, "treatmentId" | "createdAt" | "updatedAt">[] =
  [
    // Malunggay reviews
    {
      treatmentName: "Malunggay",
      rating: 5,
      comment:
        "Excellent for increasing breastmilk supply! My baby is much happier now.",
      userName: "Maria Santos",
      userEmail: "maria.s@email.com",
      anonymous: false,
    },
    {
      treatmentName: "Malunggay",
      rating: 4,
      comment: "Helped regulate my blood sugar levels effectively.",
      userName: "Juan Dela Cruz",
      userEmail: "juan.dc@email.com",
      anonymous: false,
    },
    {
      treatmentName: "Malunggay",
      rating: 5,
      comment: "Great natural remedy for inflammation and joint pain.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Lomboy (Duhat) reviews
    {
      treatmentName: "Lomboy (Duhat)",
      rating: 4,
      comment: "Effective for managing diabetes symptoms and oral health.",
      userName: "Dr. Roberto Garcia",
      userEmail: "roberto.g@clinic.com",
      anonymous: false,
    },
    {
      treatmentName: "Lomboy (Duhat)",
      rating: 5,
      comment: "Amazing for wound healing and skin problems!",
      userName: "Ana Reyes",
      userEmail: "ana.r@email.com",
      anonymous: false,
    },

    // Tawa-Tawa reviews
    {
      treatmentName: "Tawa-Tawa",
      rating: 5,
      comment:
        "This helped my cousin during dengue recovery. Platelet count improved!",
      userName: "Carlos Lim",
      userEmail: "carlos.l@email.com",
      anonymous: false,
    },
    {
      treatmentName: "Tawa-Tawa",
      rating: 4,
      comment: "Good for respiratory issues and fever management.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Sambong reviews
    {
      treatmentName: "Sambong",
      rating: 5,
      comment: "Verified by DOH and really works for kidney stones!",
      userName: "Dr. Maria Santos",
      userEmail: "maria.santos@clinic.com",
      anonymous: false,
    },
    {
      treatmentName: "Sambong",
      rating: 4,
      comment: "Effective diuretic and good for urinary problems.",
      userName: "Pedro Martinez",
      userEmail: "pedro.m@email.com",
      anonymous: false,
    },

    // Oregano reviews
    {
      treatmentName: "Oregano",
      rating: 5,
      comment: "Perfect for cough, colds, and sore throat relief!",
      userName: "Sofia Tan",
      userEmail: "sofia.t@email.com",
      anonymous: false,
    },
    {
      treatmentName: "Oregano",
      rating: 4,
      comment: "Great antibacterial properties for skin infections.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Lagundi reviews
    {
      treatmentName: "Lagundi",
      rating: 5,
      comment: "DOH-approved and very effective for asthma and cough!",
      userName: "Miguel Torres",
      userEmail: "miguel.t@email.com",
      anonymous: false,
    },
    {
      treatmentName: "Lagundi",
      rating: 5,
      comment: "My go-to remedy for persistent coughing. Works every time!",
      userName: "Elena Cruz",
      userEmail: "elena.c@email.com",
      anonymous: false,
    },

    // Bayabas (Guava) reviews
    {
      treatmentName: "Bayabas (Guava)",
      rating: 5,
      comment:
        "Excellent for diarrhea and gum infections. Traditional remedy that works!",
      userName: "Lorna Santiago",
      userEmail: "lorna.s@email.com",
      anonymous: false,
    },
    {
      treatmentName: "Bayabas (Guava)",
      rating: 4,
      comment: "Good for wound healing and skin problems.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Bawang reviews
    {
      treatmentName: "Bawang",
      rating: 5,
      comment: "Natural way to control blood pressure and cholesterol!",
      userName: "Ricardo Gomez",
      userEmail: "ricardo.g@email.com",
      anonymous: false,
    },
    {
      treatmentName: "Bawang",
      rating: 4,
      comment: "Effective antimicrobial properties for minor infections.",
      userName: "Dr. Maria Santos",
      userEmail: "maria.santos@clinic.com",
      anonymous: false,
    },

    // Ampalaya reviews
    {
      treatmentName: "Ampalaya",
      rating: 4,
      comment: "Helps manage blood sugar levels naturally.",
      userName: "Diabetes Patient",
      userEmail: "",
      anonymous: true,
    },
    {
      treatmentName: "Ampalaya",
      rating: 3,
      comment: "Effective but the taste takes getting used to.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Yerba Buena reviews
    {
      treatmentName: "Yerba Buena",
      rating: 5,
      comment: "Perfect for headaches and body pain relief!",
      userName: "Carmen Reyes",
      userEmail: "carmen.r@email.com",
      anonymous: false,
    },
    {
      treatmentName: "Yerba Buena",
      rating: 4,
      comment: "Good digestive aid and pain reliever.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Tsaang Gubat reviews
    {
      treatmentName: "Tsaang Gubat",
      rating: 5,
      comment: "Excellent for stomach problems and as mouthwash!",
      userName: "Jose Mercado",
      userEmail: "jose.m@email.com",
      anonymous: false,
    },
    {
      treatmentName: "Tsaang Gubat",
      rating: 4,
      comment: "DOH-approved and reliable for digestive issues.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Akapulko reviews
    {
      treatmentName: "Akapulko",
      rating: 5,
      comment: "Very effective for fungal skin infections!",
      userName: "Rosa Villanueva",
      userEmail: "rosa.v@email.com",
      anonymous: false,
    },
    {
      treatmentName: "Akapulko",
      rating: 4,
      comment: "Good natural remedy for ringworm and skin problems.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Niyog-Niyogan reviews
    {
      treatmentName: "Niyog-Niyogan",
      rating: 5,
      comment: "Effective deworming treatment for children when used properly.",
      userName: "Pediatric Mom",
      userEmail: "",
      anonymous: true,
    },
    {
      treatmentName: "Niyog-Niyogan",
      rating: 4,
      comment: "Traditional remedy that works but follow dosage carefully.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Banaba reviews
    {
      treatmentName: "Banaba",
      rating: 5,
      comment: "Great for diabetes management and urinary health!",
      userName: "Diabetes Patient",
      userEmail: "",
      anonymous: true,
    },
    {
      treatmentName: "Banaba",
      rating: 4,
      comment: "Helps with weight management and blood sugar control.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Serpentina reviews
    {
      treatmentName: "Serpentina",
      rating: 4,
      comment: "Strong herb that needs medical supervision but effective.",
      userName: "Traditional Healer",
      userEmail: "",
      anonymous: true,
    },
    {
      treatmentName: "Serpentina",
      rating: 5,
      comment: "Powerful remedy for high blood pressure when used correctly.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Papaya Leaves reviews
    {
      treatmentName: "Papaya Leaves",
      rating: 5,
      comment: "Traditional support for dengue fever recovery.",
      userName: "Family Caregiver",
      userEmail: "",
      anonymous: true,
    },
    {
      treatmentName: "Papaya Leaves",
      rating: 4,
      comment: "Good for digestive problems and intestinal worms.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Avocado Leaves reviews
    {
      treatmentName: "Avocado Leaves",
      rating: 4,
      comment: "Effective for kidney stones and urinary problems.",
      userName: "Kidney Patient",
      userEmail: "",
      anonymous: true,
    },
    {
      treatmentName: "Avocado Leaves",
      rating: 5,
      comment: "Natural remedy for diarrhea and high blood pressure.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Pansit-Pansitan reviews
    {
      treatmentName: "Pansit-Pansitan",
      rating: 5,
      comment: "Excellent for gout and uric acid reduction!",
      userName: "Arthritis Patient",
      userEmail: "",
      anonymous: true,
    },
    {
      treatmentName: "Pansit-Pansitan",
      rating: 4,
      comment: "DOH-approved and effective for inflammation.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Tanglad reviews
    {
      treatmentName: "Tanglad",
      rating: 5,
      comment: "Great for digestion and anxiety relief!",
      userName: "Anxiety Sufferer",
      userEmail: "",
      anonymous: true,
    },
    {
      treatmentName: "Tanglad",
      rating: 4,
      comment: "Good for digestive issues and as a calming tea.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Kutsay reviews
    {
      treatmentName: "Kutsay",
      rating: 4,
      comment: "Effective for blood pressure and digestive health.",
      userName: "Health Conscious",
      userEmail: "",
      anonymous: true,
    },
    {
      treatmentName: "Kutsay",
      rating: 5,
      comment: "Natural antimicrobial and good for appetite stimulation.",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },

    // Miracle Fruit reviews
    {
      treatmentName: "Miracle Fruit",
      rating: 4,
      comment: "Helps with sugar cravings for diabetics.",
      userName: "Diabetes Patient",
      userEmail: "",
      anonymous: true,
    },
    {
      treatmentName: "Miracle Fruit",
      rating: 5,
      comment: "Natural sweetener alternative that works!",
      userName: "Anonymous User",
      userEmail: "",
      anonymous: true,
    },
  ];

async function seedDatabase() {
  console.log(
    "🌱 Starting to seed Firebase database with herbal remedies...\n"
  );

  try {
    const treatmentsRef = db.ref("treatments");
    const reviewsRef = db.ref("reviews");

    // Load existing treatments to check for duplicates
    const existingTreatmentsSnapshot = await treatmentsRef.once("value");
    const existingTreatments: Record<string, { id: string; data: any }> = {};

    if (existingTreatmentsSnapshot.exists()) {
      const existingData = existingTreatmentsSnapshot.val();
      // Build a map of treatment name -> {id, data}
      for (const [id, data] of Object.entries(existingData)) {
        const treatmentData = data as any;
        if (treatmentData.name) {
          existingTreatments[treatmentData.name] = { id, data: treatmentData };
        }
      }
      console.log(
        `📋 Found ${
          Object.keys(existingTreatments).length
        } existing treatments in database.`
      );
    }

    // Create or update treatments
    console.log("📝 Creating/updating herbal treatments...");
    const treatmentIds: Record<string, string> = {};
    const now = new Date().toISOString();
    let baseTimestamp = Date.now();
    let createdCount = 0;
    let updatedCount = 0;

    for (const treatment of herbalTreatments) {
      let id: string;
      let isUpdate = false;

      // Check if treatment with this name already exists
      if (existingTreatments[treatment.name]) {
        // Use existing ID
        id = existingTreatments[treatment.name].id;
        isUpdate = true;
        console.log(`   ↻ Updating: ${treatment.name} (ID: ${id})`);
      } else {
        // Generate new ID only if treatment doesn't exist
        id =
          (baseTimestamp++).toString() +
          Math.random().toString(36).substring(2, 11);
        console.log(`   ✓ Creating: ${treatment.name} (ID: ${id})`);
      }

      treatmentIds[treatment.name] = id;

      // Prepare treatment data
      // Convert preparation and warnings from string to array if needed
      const preparationArray = Array.isArray(treatment.preparation)
        ? treatment.preparation
        : typeof treatment.preparation === "string"
        ? treatment.preparation
            .split(",")
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0)
        : [treatment.preparation];

      const warningsArray = Array.isArray(treatment.warnings)
        ? treatment.warnings
        : typeof treatment.warnings === "string"
        ? treatment.warnings
            .split(",")
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0)
        : [treatment.warnings];

      // Prepare treatment data (remove id field as Firebase uses key as ID)
      const { id: treatmentId, ...treatmentWithoutId } = treatment;

      // Normalize symptoms to prevent duplicates
      let normalizedSymptoms: string[] = [];
      if (Array.isArray(treatmentWithoutId.symptoms)) {
        // Create a map to track normalized symptom keys and their preferred names
        const symptomMap: Record<string, string> = {};

        for (const symptom of treatmentWithoutId.symptoms) {
          if (symptom && typeof symptom === "string" && symptom.trim()) {
            const originalName = symptom.trim();
            // Normalize to lowercase for comparison
            const normalizedKey = originalName.toLowerCase();

            // Keep the first variant we encounter or prefer capitalized versions
            if (
              !symptomMap[normalizedKey] ||
              (symptomMap[normalizedKey].charAt(0) !==
                symptomMap[normalizedKey].charAt(0).toUpperCase() &&
                originalName.charAt(0) === originalName.charAt(0).toUpperCase())
            ) {
              symptomMap[normalizedKey] = originalName;
            }
          }
        }

        // Use the preferred names from our map
        normalizedSymptoms = Object.values(symptomMap);
      }

      const treatmentData: any = {
        ...treatmentWithoutId,
        symptoms: normalizedSymptoms,
        preparation: preparationArray,
        warnings: warningsArray,
        // Preserve existing ratings if updating, otherwise set to 0
        averageRating: isUpdate
          ? existingTreatments[treatment.name]?.data?.averageRating ?? 0
          : 0,
        totalReviews: isUpdate
          ? existingTreatments[treatment.name]?.data?.totalReviews ?? 0
          : 0,
        // Preserve original createdAt if updating, otherwise use current time
        createdAt: isUpdate
          ? existingTreatments[treatment.name]?.data?.createdAt ?? now
          : now,
        updatedAt: now,
      };

      await treatmentsRef.child(id).set(treatmentData);

      if (isUpdate) {
        updatedCount++;
      } else {
        createdCount++;
      }
    }

    console.log(`\n✅ Treatment operations completed:`);
    console.log(`   - Created: ${createdCount}`);
    console.log(`   - Updated: ${updatedCount}\n`);

    // Create reviews
    console.log("💬 Creating reviews...");
    let reviewTimestamp = Date.now() + 1000; // Offset from treatment timestamps
    let createdReviewsCount = 0;
    let skippedReviewsCount = 0;

    for (const review of sampleReviews) {
      const treatmentId = treatmentIds[review.treatmentName];
      if (!treatmentId) {
        console.log(
          `   ⚠️  Warning: Treatment "${review.treatmentName}" not found, skipping review`
        );
        skippedReviewsCount++;
        continue;
      }

      // Generate unique ID with timestamp and random string
      const id =
        (reviewTimestamp++).toString() +
        Math.random().toString(36).substring(2, 11);
      const reviewData: Review = {
        ...review,
        treatmentId,
        createdAt: now,
        updatedAt: now,
      };

      await reviewsRef.child(id).set(reviewData);
      console.log(
        `   ✓ Created review for: ${review.treatmentName} (${review.rating} stars)`
      );
      createdReviewsCount++;
    }

    console.log(`\n✅ Review operations completed:`);
    console.log(`   - Created: ${createdReviewsCount}`);
    if (skippedReviewsCount > 0) {
      console.log(`   - Skipped: ${skippedReviewsCount}\n`);
    } else {
      console.log();
    }

    // Recalculate treatment ratings from ALL reviews (existing + new)
    console.log("⭐ Recalculating treatment ratings from all reviews...");

    // Build a map of treatmentId -> treatmentName for all treatments (existing + new)
    const treatmentIdToName: Record<string, string> = {};

    // Add treatments from seed data
    for (const [name, id] of Object.entries(treatmentIds)) {
      treatmentIdToName[id] = name;
    }

    // Add existing treatments that weren't in seed data
    const finalTreatmentsSnapshot = await treatmentsRef.once("value");
    if (finalTreatmentsSnapshot.exists()) {
      const allTreatments = finalTreatmentsSnapshot.val();
      for (const [id, data] of Object.entries(allTreatments)) {
        const treatmentData = data as any;
        if (treatmentData.name && !treatmentIdToName[id]) {
          treatmentIdToName[id] = treatmentData.name;
        }
      }
    }

    // Calculate ratings per treatmentId
    const reviewsSnapshot = await reviewsRef.once("value");
    const treatmentRatingsById: Record<string, { sum: number; count: number }> =
      {};

    if (reviewsSnapshot.exists()) {
      const allReviews = reviewsSnapshot.val();
      for (const [reviewId, reviewData] of Object.entries(allReviews)) {
        const review = reviewData as any;
        if (review.treatmentId && review.rating) {
          if (!treatmentRatingsById[review.treatmentId]) {
            treatmentRatingsById[review.treatmentId] = { sum: 0, count: 0 };
          }
          treatmentRatingsById[review.treatmentId].sum += review.rating;
          treatmentRatingsById[review.treatmentId].count += 1;
        }
      }
    }

    // Update treatment ratings for all treatments that have reviews
    let updatedRatingsCount = 0;
    for (const [treatmentId, ratings] of Object.entries(treatmentRatingsById)) {
      const treatmentName = treatmentIdToName[treatmentId] || treatmentId;

      const averageRating = ratings.count > 0 ? ratings.sum / ratings.count : 0;
      const roundedRating = Math.round(averageRating * 10) / 10;

      await treatmentsRef.child(treatmentId).update({
        averageRating: roundedRating,
        totalReviews: ratings.count,
        updatedAt: new Date().toISOString(),
      });

      console.log(
        `   ✓ Updated ${treatmentName}: ${roundedRating} stars (${ratings.count} reviews)`
      );
      updatedRatingsCount++;
    }

    // Also update treatments with 0 reviews (if they don't have any reviews)
    for (const treatmentId of Object.keys(treatmentIdToName)) {
      if (!treatmentRatingsById[treatmentId]) {
        await treatmentsRef.child(treatmentId).update({
          averageRating: 0,
          totalReviews: 0,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    console.log("\n🎉 Database seeding completed successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   - Treatments processed: ${herbalTreatments.length}`);
    console.log(`   - Reviews created: ${createdReviewsCount}`);
    console.log(`   - Treatment ratings updated: ${updatedRatingsCount}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
