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

interface Treatment2 {
  id: number;
  name: string;
  category: string[];
  symptoms: string[];
  imageUrl: string;
  sourceType: string;
  sources: Array<{
    authority: string;
    url: string;
    description: string;
    verificationDate: string;
  }>;
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
  Treatment2,
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://pitahc.gov.ph/directory-of-herbs/",
        description: "Approved herbal medicine by PITAHC",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Metabolic analysis of the CAZy class glycosyltransferases in rhizospheric soil fungiome of the plant species Moringa oleifera",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Moringa oleifera, Lycium barbarum: A Perspective on New Sources of Phytochemicals, Lipids and Proteins",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description: "Moringa - The Miracle Tree",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://pitahc.gov.ph/directory-of-herbs/",
        description: "Approved herbal medicine by PITAHC",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Biomass-Based Iron Removal: Adsorption Kinetics, Isotherm and Machine Learning Modelling with Ocimum sanctum And Syzygium cumini",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description: "Syzygium cumini (Java Plum)",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Anti-tuberculosis activity of bio-active compounds from Lantana camara L., Euphorbia hirta L., Mukia maderaspatana (L.) M. Roem, and Abutilon indicum (L.)",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Phenolic compounds analysis of three Euphorbia species by LC-DAD-MSn and their biological properties",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description:
          "Phytotherapy in the Management of Diabetes and Hypertension",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://pitahc.gov.ph/directory-of-herbs/",
        description: "Approved herbal medicine by PITAHC",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Chemical Composition and Insecticidal Activities of Blumea balsamifera (Sambong) Essential Oil Against Three Stored Product Insects",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Antibacterial activity and cytotoxicity of sequentially extracted medicinal plant Blumea balsamifera Lin. (DC).",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description: "Malaysian Medicinal Herbs: Home Garden",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://www.stuartxchange.org/Oregano.html",
        description: "Traditional medicinal herb with scientific backing",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Plectranthus amboinicus (Lour.) Spreng (Indian Oregano) essential oil combats Methicillin resistant Staphylococcus aureus by targeting bacterial septation and attenuation of virulence factors",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Physiological and biochemical adaptations of Plectranthus amboinicus under severe cadmium and lead contamination",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description:
          "Handbook of Spices in India: 75 Years of Research and Development",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "In vitro anti-venom potential of various solvent based leaf extracts of Andrographis serpyllifolia (Rottler ex Vahl) Wight against Naja naja and Daboia russelli",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Ethnobotanical survey of malaria prophylactic remedies in Odisha, India",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://pitahc.gov.ph/directory-of-herbs/",
        description: "Approved herbal medicine by PITAHC",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "The chemistry and biological activities of Peperomia pellucida (Piperaceae): A critical review",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Comparative toxicity, phytochemistry, and use of 53 Philippine medicinal plants",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Antifungal properties of Cymbopogon citratus (DC.) Stapf—A scoping review",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Phytochemistry and pharmacological activities of Cymbopogon citratus: A review",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description: "The Encyclopedia of Herbs and Spices",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://pitahc.gov.ph/directory-of-herbs/",
        description: "Approved herbal medicine by PITAHC",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Recommended Medicinal Plants as Source of Natural Products: A Review",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description: "Guava",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description:
          "The Forests of the Philippines ...: Forest types and products",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Biochemical profiling of plant latex Euphorbia hirta and Croton bonplandianum: Unveiling the nuclease and protease activity",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Euphorbia hirta nanoextract as a piezoelectric ultrasonic scaler coolant in gingivitis treatment in a Wistar rat model",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description: "The Essential Guide to Herbal Safety",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Phytochemical and biological studies of betel leaf (Piper betle L.): Review on paradigm and its potential benefits in human health",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "On the antifungal potentials of Piper betle L. ethanol extract against sclerotium rolfsii for pesticidal applicability: In vitro evidence and in silico screening",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Bitter leaf (Vernonia amygdalina) and siam weed (Chromolaena odorata) aqueous extracts alleviate testicular damage induced by Plasmodium berghei in male mice via modulation of oxidative stress pathways",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Bitter leaf (Vernonia amygdalina) and siam weed (Chromolaena odorata) aqueous extracts alleviate testicular damage induced by Plasmodium berghei in male mice via modulation of oxidative stress pathways",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com/science/article/pii/S2468227625002339",
        description: "Research article on Chromolaena odorata",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Biosynthesis of ZnO nanoparticles using Averrhoa bilimbi fruit extract: evaluation of photocatalytic and antibacterial activities",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Biogenic synthesis of nickel oxide nanoparticles using Averrhoa bilimbi and investigation of its antibacterial, antidiabetic and cytotoxic properties",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://pitahc.gov.ph/directory-of-herbs/",
        description: "Approved herbal medicine by PITAHC",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Micellar electrokinetic chromatography of the constituents in Philippine lagundi (Vitex negundo) herbal products",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Towards the establishment of 'lagundi' (Vitex trifolia s.l.) reference germplasm from the Philippines: An agro-morphological and phytochemical evaluation of native genotypes",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Investigation of the Role of Lunasia amara Blanco in the Treatment of Malaria Through Network Pharmacology Analysis",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Novel furoquinolinones from an Indonesian Plant, Lunasia amara",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "StuartXchange",
        url: "https://www.stuartxchange.org/Kuchai.html",
        description: "Traditional medicinal herb documentation",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Multi-omics analysis reveals the transcription factor AtuMYB306 improves drought tolerance by regulating flavonoid metabolism in Chinese chive (Allium tuberosum Rottler)",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Identification and characterization of Pantoea eucalypti as the causative agent of soft rot disease in Chinese chive (Allium tuberosum Rottler ex Sprengle) in China☆",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description: "Handy Pocket Guide to Asian Vegetables",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Exploration of polaron dynamics in Lagerstroemia speciosa (L.): Microstructure and semiconducting nature of novel organic system",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Electrochemical studies on Lagerstroemia speciosa based hard carbon anode for sodium ion batteries",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Anti-atherosclerotic effects of combined Bambusa bambos (L.) Voss and Ananas comosus (L.) Merr. extract on hypercholesterolemic rabbits",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Phytochrome-interacting factors 3 (AbPIF3) synergistically regulates anthocyanin, carotenoids and chlorophyll biosynthesis in the chimeric leaves of Ananas comosus var. bracteatus",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Phytochemical profiling of Ananas comosus fruit via UPLC-MS and its anti-inflammatory and anti-arthritic activities: In Silico, In Vitro and In Vivo Approach",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Efficient adsorption of nitroaromatic compounds from reusable hierarchical porous biochar emanates from the Ananas comosus crown and Citrus limetta fibers",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Determination of the physicochemical characteristics and bioactive compounds of the miracle fruit (Synsepalum dulcificum) considering different extraction and preservation methods",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Analyzing the miraculin content of Beninese Sisrè berries (Synsepalum dulcificum Schumach. & Thonn.) and exploring its thermal behavior",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Nutritional, phytochemical and functional properties of avocado (Persea Americana Mill) leaf: Evaluation of its derivative extraction",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Chemical constituents of leaves of Persea americana (avocado) and their protective effects against neomycin-induced hair cell damage",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description: "International Poisonous Plants Checklist",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Lactuca indica L. polysaccharide ameliorates type 1 diabetes via gut microbiota-SCFAs-IRS-1/PI3K/GLUT4-MYD88/NF-κB axis",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Discovery of anti-inflammatory phytoconstituents from Lactuca indica L. based on its traditional uses",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Ultrasound-assisted extraction, characterization, and bioactivity assessment of polyphenol-rich papaya (Carica papaya) leaf extract for application in plant-based food products",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Modulation of COX-2, 5-LOX, and cytokine signalling by Carica papaya L. Leaf cultivar 'Red Lady' flavonoids in inflammation: in-vitro and in-silico insights",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description:
          "International Conference on Health, Education, & Computer Science Technology",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://pitahc.gov.ph/directory-of-herbs/",
        description: "Approved herbal medicine by DOH",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Recommended Medicinal Plants as Source of Natural Products: A Review",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Antibacterial activities of ethanol extracts of Philippine medicinal plants against multidrug-resistant bacteria",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://pitahc.gov.ph/directory-of-herbs/",
        description: "Approved herbal medicine by DOH",
        verificationDate: "2023-01-01",
      },
    ],
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://pitahc.gov.ph/directory-of-herbs/",
        description: "Approved herbal medicine by DOH",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description: "A new antimutagen from Mentha cordifolia Opiz.",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "The use of medicinal plants by Paraguayan migrants in the Atlantic Forest of Misiones, Argentina, is based on Guaraní tradition, colonial and current plant knowledge",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://pitahc.gov.ph/directory-of-herbs/",
        description: "Approved herbal medicine by DOH",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Recent Study of Turmeric in Combination with Garlic as Antidiabetic Agent",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Recommended Medicinal Plants as Source of Natural Products: A Review",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description:
          "Phytochemistry and Pharmacology of Garlic (Allium Sativum L.) Clove",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://pitahc.gov.ph/directory-of-herbs/",
        description: "Approved herbal medicine by DOH",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Lead Levels in Fresh Medicinal Herbs and Commercial Tea Products from Manila, Philippines",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Perspective on herbal medicine in the Philippines, economic demands, quality control, and regulation",
        verificationDate: "",
      },
    ],
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
    sources: [
      {
        authority: "Philippine Department of Health",
        url: "https://pitahc.gov.ph/directory-of-herbs/",
        description: "Approved herbal medicine by DOH",
        verificationDate: "2023-01-01",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Antidiabetic effects of Momordica charantia (bitter melon) and its medicinal potency",
        verificationDate: "",
      },
      {
        authority: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        description:
          "Bitter melon (Momordica charantia): a review of efficacy and safety",
        verificationDate: "",
      },
      {
        authority: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        description:
          "The safety and efficacy of Momordica charantia L. in animal models of type 2 diabetes mellitus: A systematic review and meta-analysis",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Momordica charantia (bitter melon): Potent antiviral efficacy and significant benefits against herpes virus",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Multidimensional Uses of Bitter Melon (Momordica charantia L.) Considering the Important Functions of its Chemical Components",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description: "The Bitter Gourd Genome",
        verificationDate: "",
      },
    ],
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
  {
    id: 29,
    name: "Calamansi",
    category: ["Digestive", "Immune System", "Skin Health"],
    symptoms: [
      "Poor digestion",
      "weak immune system",
      "skin problems",
      "scurvy symptoms",
      "poor wound healing",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Citrus microcarpa biochar: A green solution for the adsorption of dyes and phenols",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Microbial succession and organic acid metabolism during spontaneous calamondin fermentation: The vital role of Pichia",
        verificationDate: "",
      },
      {
        authority: "Google Books",
        url: "https://books.google.com",
        description: "Ontologies and Natures",
        verificationDate: "",
      },
    ],
    preparation:
      "Consume fresh fruit juice, Use peel for zest, Apply topically for skin issues",
    usage: "Oral consumption or topical application",
    dosage: "As needed for symptoms",
    warnings: "May cause tooth enamel erosion, Use in moderation",
    benefits: [
      "Rich in vitamin C",
      "Antioxidant properties",
      "Skin brightening effects",
      "Digestive aid",
    ],
  },
  {
    id: 30,
    name: "Guyabano",
    category: ["Anti-cancer", "Digestive", "Nervous System"],
    symptoms: [
      "Cancer-related symptoms",
      "digestive issues",
      "stress and anxiety",
      "sleep problems",
      "joint pain",
    ],
    imageUrl: "",
    sourceType: "Local Remedy",
    sources: [
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Annona muricata: A comprehensive review on its traditional medicinal uses, phytochemicals, pharmacological activities, mechanisms of action and toxicity",
        verificationDate: "",
      },
      {
        authority: "ScienceDirect",
        url: "https://www.sciencedirect.com",
        description:
          "Soursop (Annona muricata L.): Composition, Nutritional Value, Medicinal Uses, and Toxicology",
        verificationDate: "",
      },
    ],
    preparation:
      "Consume fruit flesh, Prepare as tea from leaves, Use extract supplements",
    usage: "Oral consumption",
    dosage: "As directed by traditional practitioner",
    warnings:
      "May be toxic in high doses, Consult doctor for serious conditions",
    benefits: [
      "Potential anti-cancer properties",
      "Stress and anxiety relief",
      "Improved sleep quality",
      "Anti-inflammatory effects",
    ],
  },
];

async function seedDatabase() {
  console.log(
    "🌱 Starting to seed Firebase database with herbal remedies...\n"
  );

  try {
    const treatmentsRef = db.ref("treatments2");
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
        // Use treatment name in lowercase with spaces replaced by hyphens
        id = treatment.name.toLowerCase().replace(/ /g, "-");
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

    console.log("\n🎉 Database seeding completed successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   - Treatments processed: ${herbalTreatments.length}`);
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
