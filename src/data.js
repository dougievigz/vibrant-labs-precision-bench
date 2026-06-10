/* =============================================================================
   VIBRANT LABS — Precision Bench
   data.js — curated, source-grounded science content

   The core teaching idea: every analyte ("molecule") belongs to a molecule
   CLASS, and each class is run on exactly ONE analyzer. The player reads the
   molecule + specimen on each aliquot and routes it to the correct machine.
   A single patient REPORT (panel) often spans several classes, so it must be
   split across several analyzers — "the right analyzer for the right marker."

   Methodology mappings reflect Vibrant Wellness / Vibrant America's real
   platforms: a proprietary silicon-chip peptide/protein microarray read by
   chemiluminescence (antibody panels), LC-MS/MS + GC-MS/MS (toxins, hormones,
   organic acids, fat-soluble vitamins & fatty acids), ICP-MS (metals/elements),
   real-time PCR + metagenomic NGS (microbiome, pathogen DNA, human SNPs),
   ELISA microplate (single stool/GI proteins), and routine clinical
   chemistry/hematology analyzers (lipids, metabolic, enzymes, blood counts).
   All Vibrant tests are laboratory-developed (LDT); not FDA-cleared.
============================================================================= */

/* ---- Specimen types (what the sample arrives in) ------------------------- */
export const SPECIMENS = {
  serum:       { label: "Serum",            short: "SST",     color: "#E8B53A", cap: "#D69A1F", kind: "tube",  note: "Serum separator tube (gold)" },
  dbs:         { label: "Dried blood spot", short: "DBS",     color: "#C75B4A", cap: "#A8412F", kind: "card",  note: "At-home fingerstick microsample" },
  whole_blood: { label: "Whole blood",      short: "EDTA",    color: "#8E6FC4", cap: "#6F4FA8", kind: "tube",  note: "K2EDTA lavender — RBC/WBC fractions" },
  urine:       { label: "Urine",            short: "UR",      color: "#E4C34A", cap: "#C9A52F", kind: "cup",   note: "First-morning, metal-free cup" },
  saliva:      { label: "Saliva",           short: "SAL",     color: "#9FD4E0", cap: "#6FB6C7", kind: "tube",  note: "Timed diurnal collection" },
  stool:       { label: "Stool",            short: "STL",     color: "#A9794E", cap: "#855C38", kind: "cup",   note: "Unpreserved collection" },
  buccal:      { label: "Buccal swab",      short: "SWAB",    color: "#D9D2C4", cap: "#B7AE9B", kind: "swab",  note: "Cheek swab for genomic DNA" },
};

/* ---- The six analyzers (the machines on the bench) ----------------------- */
export const ANALYZERS = [
  {
    id: "immunochip",
    name: "Immunochip Array",
    mono: "IMMUNOCHIP",
    accent: "#3A85FF",
    detects: "Multiplex antibodies (IgG · IgA · IgM · IgE)",
    tech: "Silicon-chip peptide/protein microarray + chemiluminescence",
    blurb:
      "Vibrant's proprietary 3Dense platform prints thousands of antigen and " +
      "peptide probes onto a silicon chip, then reads antibody binding by " +
      "chemiluminescence — resolving reactivity down to the peptide level.",
  },
  {
    id: "lcmsms",
    name: "LC-MS/MS",
    mono: "LC-MS/MS",
    accent: "#00B591",
    detects: "Small organic molecules, by mass",
    tech: "Liquid chromatography–tandem mass spectrometry (+ GC-MS/MS)",
    blurb:
      "The gold standard for small molecules. Compounds are separated by " +
      "chromatography, then identified and quantified by their mass-to-charge " +
      "signature: mycotoxins, environmental chemicals, hormone metabolites, " +
      "organic acids, fat-soluble vitamins and fatty acids.",
  },
  {
    id: "icpms",
    name: "ICP-MS",
    mono: "ICP-MS",
    accent: "#67E78D",
    detects: "Metals & trace elements",
    tech: "Inductively coupled plasma mass spectrometry",
    blurb:
      "An argon plasma torch ionizes the sample so a mass spectrometer can " +
      "count individual elements at trace levels — toxic heavy metals and " +
      "essential minerals alike.",
  },
  {
    id: "pcrseq",
    name: "PCR · Sequencer",
    mono: "PCR · NGS",
    accent: "#F1B669",
    detects: "Nucleic acids (DNA / RNA)",
    tech: "Real-time PCR + next-generation metagenomic sequencing",
    blurb:
      "Amplifies and sequences genetic material to identify and quantify " +
      "microbes by their DNA/RNA, detect pathogen genes directly, and read " +
      "human single-nucleotide variants (SNPs).",
  },
  {
    id: "elisa",
    name: "ELISA Reader",
    mono: "ELISA",
    accent: "#81E4FF",
    detects: "Single proteins, one analyte at a time",
    tech: "Enzyme-linked immunosorbent microplate assay",
    blurb:
      "A microplate assay where an enzyme-linked antibody produces a color " +
      "change proportional to a single target protein — used for GI/barrier " +
      "proteins like calprotectin, zonulin, secretory IgA and elastase.",
  },
  {
    id: "chem",
    name: "Chemistry · Hematology",
    mono: "CHEM · HEME",
    accent: "#FF490D",
    detects: "Routine chemistries & blood counts",
    tech: "Automated clinical chemistry & hematology analyzers",
    blurb:
      "High-throughput analyzers for lipids and lipoproteins, metabolic and " +
      "inflammatory markers, enzymes, and the complete blood count — by " +
      "enzymatic, colorimetric and immunoturbidimetric chemistry.",
  },
];

/* ---- Molecule classes — each maps to exactly one analyzer ---------------- */
/* glyph keys are rendered as inline SVG by the UI (see ui glyph()).          */
export const CLASSES = {
  antibody: {
    label: "Antibody",
    analyzer: "immunochip",
    glyph: "antibody",
    hint: "Immune antibodies (Ig) against many targets → silicon-chip microarray.",
  },
  smallmol: {
    label: "Small molecule",
    analyzer: "lcmsms",
    glyph: "hex",
    hint: "Organic compounds — toxins, hormones, metabolites, fat-soluble vitamins → LC-MS/MS.",
  },
  element: {
    label: "Element / metal",
    analyzer: "icpms",
    glyph: "atom",
    hint: "Metals & trace minerals → ICP-MS elemental analysis.",
  },
  nucleic: {
    label: "Nucleic acid",
    analyzer: "pcrseq",
    glyph: "helix",
    hint: "Microbial DNA/RNA and human SNPs → PCR / sequencing.",
  },
  protein: {
    label: "GI protein",
    analyzer: "elisa",
    glyph: "protein",
    hint: "Single stool/GI proteins → ELISA microplate.",
  },
  chemistry: {
    label: "Clinical chemistry",
    analyzer: "chem",
    glyph: "droplet",
    hint: "Lipids, metabolic markers, enzymes, blood counts → chemistry/hematology analyzer.",
  },
};

/* ---- System accent colors (Vibrant Zoomer palette) ----------------------- */
export const SYSTEMS = {
  cardio:     "#FF490D",
  neural:     "#3A85FF",
  gut:        "#F1B669",
  hormone:    "#D7A0EA",
  cellular:   "#FF6686",
  immune:     "#81E4FF",
  toxin:      "#67E78D",
  food:       "#00B591",
  nutrient:   "#FFD54B",
  foundation: "#BCD0D9",
};

/* ---- Markers (the "molecules") ------------------------------------------- *
 * id, name, cls (molecule class), spec (specimen), sys (system color),
 * note (short clinically-accurate teaching line, in Vibrant's voice).
 * ------------------------------------------------------------------------- */
export const MARKERS = {
  /* ---------- Antibody → Immunochip ---------- */
  a_agliadin:  { name: "Alpha-Gliadin IgG",            cls: "antibody", spec: "serum",  sys: "food",   note: "Wheat gliadin antibody, resolved at the peptide level on the chip." },
  a_dgp:       { name: "Deamidated Gliadin Peptide IgA",cls: "antibody", spec: "serum",  sys: "food",   note: "DGP IgA — a specific marker of the celiac immune response." },
  a_ttg:       { name: "Transglutaminase-2 (tTG) IgA", cls: "antibody", spec: "serum",  sys: "food",   note: "tTG IgA — the standard serologic marker for celiac disease." },
  a_wga:       { name: "Wheat Germ Agglutinin IgG",    cls: "antibody", spec: "serum",  sys: "food",   note: "Antibody to a wheat lectin distinct from gluten." },
  a_casein:    { name: "Bovine Casein IgG",            cls: "antibody", spec: "dbs",    sys: "food",   note: "Dairy protein reactivity — printed alongside other food peptides." },
  a_ovalbumin: { name: "Ovalbumin (Gal d 2) IgG",      cls: "antibody", spec: "dbs",    sys: "food",   note: "Egg-white component antibody." },
  a_arah2:     { name: "Peanut Ara h 2 IgE",           cls: "antibody", spec: "serum",  sys: "food",   note: "Component-resolved peanut allergen IgE." },
  a_mog:       { name: "Anti-MOG (myelin)",            cls: "antibody", spec: "serum",  sys: "neural", note: "Antibody to myelin oligodendrocyte glycoprotein." },
  a_mbp:       { name: "Anti-Myelin Basic Protein",    cls: "antibody", spec: "serum",  sys: "neural", note: "Demyelination-associated autoantibody." },
  a_abeta:     { name: "Anti-Amyloid-β (1-42)",   cls: "antibody", spec: "serum",  sys: "neural", note: "Neural autoantibody on the curated brain-antigen array." },
  a_dsdna:     { name: "Anti-dsDNA",                   cls: "antibody", spec: "serum",  sys: "immune", note: "Hallmark autoantibody of systemic lupus." },
  a_ssa:       { name: "Anti-SS-A / Ro52",             cls: "antibody", spec: "serum",  sys: "immune", note: "Connective-tissue autoantibody (Sjögren's, lupus)." },
  a_gad65:     { name: "Anti-GAD65",                   cls: "antibody", spec: "serum",  sys: "immune", note: "Islet autoantibody — type 1 diabetes autoimmunity." },
  a_borr_vlse: { name: "Borrelia VlsE1 IgG",           cls: "antibody", spec: "dbs",    sys: "immune", note: "Lyme antibody; the chip outperformed Western blot for specificity." },
  a_borr_ospc: { name: "Borrelia OspC IgM",            cls: "antibody", spec: "dbs",    sys: "immune", note: "Early-Lyme IgM antigen on the tickborne array." },
  a_babesia:   { name: "Babesia microti IgG",          cls: "antibody", spec: "dbs",    sys: "immune", note: "Tickborne co-infection antibody." },

  /* ---------- Small molecule → LC-MS/MS ---------- */
  s_ota:        { name: "Ochratoxin A",                cls: "smallmol", spec: "urine",      sys: "toxin",    note: "Nephrotoxic mold toxin; creatinine-normalized in urine." },
  s_afb1:       { name: "Aflatoxin B1",                cls: "smallmol", spec: "urine",      sys: "toxin",    note: "Hepatotoxic, carcinogenic Aspergillus mycotoxin." },
  s_gliotoxin:  { name: "Gliotoxin",                   cls: "smallmol", spec: "urine",      sys: "toxin",    note: "Immunosuppressive mycotoxin from Aspergillus." },
  s_zearalenone:{ name: "Zearalenone",                 cls: "smallmol", spec: "urine",      sys: "toxin",    note: "Estrogenic Fusarium mycotoxin." },
  s_glyphosate: { name: "Glyphosate",                  cls: "smallmol", spec: "urine",      sys: "toxin",    note: "Herbicide residue quantified by mass spec." },
  s_bpa:        { name: "Bisphenol A (BPA)",           cls: "smallmol", spec: "urine",      sys: "toxin",    note: "Endocrine-disrupting plasticizer metabolite." },
  s_pfoa:       { name: "PFOA",                        cls: "smallmol", spec: "urine",      sys: "toxin",    note: "Persistent 'forever chemical' (PFAS)." },
  s_pfos:       { name: "PFOS",                        cls: "smallmol", spec: "urine",      sys: "toxin",    note: "Long-chain PFAS measured by LC-MS/MS." },
  s_estradiol:  { name: "Estradiol (E2)",              cls: "smallmol", spec: "urine",      sys: "hormone",  note: "Primary estrogen — quantified with its metabolites." },
  s_2ohe1:      { name: "2-Hydroxyestrone",            cls: "smallmol", spec: "urine",      sys: "hormone",  note: "Protective estrogen-metabolism pathway marker." },
  s_cortisol:   { name: "Cortisol (diurnal)",          cls: "smallmol", spec: "saliva",     sys: "hormone",  note: "Free cortisol rhythm — note the saliva specimen, not serum." },
  s_dheas:      { name: "DHEA-S",                      cls: "smallmol", spec: "urine",      sys: "hormone",  note: "Adrenal androgen precursor in the hormone metabolite panel." },
  s_vitd:       { name: "Vitamin D (25-OH)",           cls: "smallmol", spec: "serum",      sys: "nutrient", note: "Fat-soluble vitamin measured by mass spec, not immunoassay." },
  s_omega3:     { name: "Omega-3 Index (EPA+DHA)",     cls: "smallmol", spec: "whole_blood",sys: "nutrient", note: "RBC membrane fatty acids — a mass-spec lipid panel." },
  s_coq10:      { name: "Coenzyme Q10",                cls: "smallmol", spec: "whole_blood",sys: "nutrient", note: "Lipid-soluble mitochondrial cofactor." },
  s_butyrate:   { name: "Butyrate (SCFA)",             cls: "smallmol", spec: "stool",      sys: "gut",      note: "Short-chain fatty acid — a gut metabolite read by mass spec." },
  s_hva:        { name: "Homovanillic acid",           cls: "smallmol", spec: "urine",      sys: "cellular", note: "Dopamine metabolite — an organic acid." },
  s_quinolinic: { name: "Quinolinic acid",             cls: "smallmol", spec: "urine",      sys: "cellular", note: "Neuro-inflammatory kynurenine-pathway organic acid." },
  s_ceramide:   { name: "Ceramide Cer(d18:1/16:0)",    cls: "smallmol", spec: "serum",      sys: "cardio",   note: "Cardiovascular lipidomic risk marker by LC-MS/MS." },

  /* ---------- Element → ICP-MS ---------- */
  e_lead:      { name: "Lead (Pb)",                    cls: "element",  spec: "urine",       sys: "toxin",    note: "Neurotoxic heavy metal — elemental analysis." },
  e_mercury:   { name: "Mercury (Hg)",                 cls: "element",  spec: "urine",       sys: "toxin",    note: "Toxic heavy metal counted by mass on the plasma torch." },
  e_arsenic:   { name: "Arsenic (As)",                 cls: "element",  spec: "urine",       sys: "toxin",    note: "Carcinogenic metalloid." },
  e_cadmium:   { name: "Cadmium (Cd)",                 cls: "element",  spec: "urine",       sys: "toxin",    note: "Nephrotoxic heavy metal." },
  e_aluminum:  { name: "Aluminum (Al)",                cls: "element",  spec: "urine",       sys: "toxin",    note: "Neuro-associated metal burden." },
  e_magnesium: { name: "Magnesium (RBC)",              cls: "element",  spec: "whole_blood", sys: "nutrient", note: "Intracellular mineral — measured in red cells." },
  e_selenium:  { name: "Selenium",                     cls: "element",  spec: "whole_blood", sys: "nutrient", note: "Antioxidant trace element." },
  e_zinc:      { name: "Zinc (RBC)",                   cls: "element",  spec: "whole_blood", sys: "nutrient", note: "Essential mineral for immune & enzyme function." },
  e_copper:    { name: "Copper",                       cls: "element",  spec: "serum",       sys: "nutrient", note: "Trace element; balanced against zinc." },
  e_iodine:    { name: "Iodine",                       cls: "element",  spec: "urine",       sys: "nutrient", note: "Thyroid-essential element." },

  /* ---------- Nucleic acid → PCR · Sequencer ---------- */
  n_akkermansia:  { name: "Akkermansia muciniphila",   cls: "nucleic", spec: "stool",   sys: "gut",        note: "Mucin-degrading commensal quantified by sequencing." },
  n_faecali:      { name: "Faecalibacterium prausnitzii",cls: "nucleic",spec: "stool",   sys: "gut",        note: "Butyrate-producing keystone microbe." },
  n_cdiff:        { name: "C. difficile Toxin B gene",  cls: "nucleic", spec: "stool",   sys: "gut",        note: "Pathogen toxin gene detected directly by PCR." },
  n_hpylori:      { name: "Helicobacter pylori",        cls: "nucleic", spec: "stool",   sys: "gut",        note: "Gastric pathogen — DNA detection." },
  n_norovirus:    { name: "Norovirus GII (RNA)",        cls: "nucleic", spec: "stool",   sys: "gut",        note: "Enteric virus detected by RT-PCR." },
  n_borrelia_dna: { name: "Borrelia burgdorferi DNA",   cls: "nucleic", spec: "dbs",     sys: "immune",     note: "Direct pathogen DNA — the PCR arm of tickborne testing." },
  n_mthfr:        { name: "MTHFR C677T",                cls: "nucleic", spec: "buccal",  sys: "foundation", note: "Folate-metabolism SNP (rs1801133) by genotyping." },
  n_apoe:         { name: "APOE genotype",              cls: "nucleic", spec: "buccal",  sys: "cardio",     note: "Cardio/neuro risk SNP set." },
  n_fvleiden:     { name: "Factor V Leiden",            cls: "nucleic", spec: "buccal",  sys: "cardio",     note: "Thrombophilia SNP (rs6025)." },
  n_gst:          { name: "GSTM1 detox SNP",            cls: "nucleic", spec: "buccal",  sys: "toxin",      note: "Xenobiotic-detox genotype." },

  /* ---------- GI protein → ELISA ---------- */
  p_calprotectin: { name: "Calprotectin",              cls: "protein", spec: "stool",   sys: "gut", note: "Neutrophil protein — quantifies intestinal inflammation." },
  p_zonulin:      { name: "Zonulin",                   cls: "protein", spec: "stool",   sys: "gut", note: "Tight-junction regulator — gut-barrier permeability." },
  p_siga:         { name: "Secretory IgA",             cls: "protein", spec: "stool",   sys: "gut", note: "Mucosal immune protein — single-analyte ELISA." },
  p_elastase:     { name: "Pancreatic Elastase-1",     cls: "protein", spec: "stool",   sys: "gut", note: "Exocrine pancreatic sufficiency marker." },
  p_lactoferrin:  { name: "Lactoferrin",               cls: "protein", spec: "stool",   sys: "gut", note: "Inflammatory GI protein measured by ELISA." },

  /* ---------- Routine chemistry → Chemistry · Hematology ---------- */
  c_apob:     { name: "Apolipoprotein B",              cls: "chemistry", spec: "serum",       sys: "cardio", note: "Counts atherogenic particles — immunoturbidimetric chemistry." },
  c_lpa:      { name: "Lipoprotein(a)",                cls: "chemistry", spec: "serum",       sys: "cardio", note: "Inherited lipoprotein risk factor." },
  c_hscrp:    { name: "hs-CRP",                        cls: "chemistry", spec: "serum",       sys: "cardio", note: "High-sensitivity inflammation marker." },
  c_trig:     { name: "Triglycerides",                 cls: "chemistry", spec: "serum",       sys: "cardio", note: "Enzymatic lipid chemistry." },
  c_hdl:      { name: "HDL Cholesterol",               cls: "chemistry", spec: "serum",       sys: "cardio", note: "Direct HDL — routine lipid panel." },
  c_glucose:  { name: "Glucose",                       cls: "chemistry", spec: "serum",       sys: "foundation", note: "Core metabolic chemistry." },
  c_hba1c:    { name: "Hemoglobin A1c",                cls: "chemistry", spec: "whole_blood", sys: "foundation", note: "90-day glycemic average — whole-blood hematology." },
  c_alt:      { name: "ALT (liver enzyme)",            cls: "chemistry", spec: "serum",       sys: "foundation", note: "Hepatic enzyme — enzymatic assay." },
  c_cbc:      { name: "Complete Blood Count",          cls: "chemistry", spec: "whole_blood", sys: "foundation", note: "Cell counts on the hematology analyzer." },
  c_ferritin: { name: "Ferritin",                      cls: "chemistry", spec: "serum",       sys: "foundation", note: "Iron-storage protein — immunoassay chemistry." },
};

/* ---- Patient report templates (panels) ----------------------------------- *
 * id, panel (name), sys (accent), tier, methods (count for display),
 * markers (ordered ids), blurb (provider-voice context).
 * ------------------------------------------------------------------------- */
export const PANELS = {
  /* Tier 1 — single methodology (orientation) */
  heavy_metals: {
    panel: "Heavy Metals", sys: "toxin", tier: 1,
    markers: ["e_lead", "e_mercury", "e_arsenic", "e_cadmium", "e_aluminum"],
    blurb: "Urine elemental panel. Every analyte is a metal — one analyzer handles the whole report.",
  },
  mycotoxins: {
    panel: "Mycotoxins", sys: "toxin", tier: 1,
    markers: ["s_ota", "s_afb1", "s_gliotoxin", "s_zearalenone"],
    blurb: "Mold toxins are small organic molecules — straight to mass spec.",
  },
  wheat_zoomer: {
    panel: "Wheat Zoomer", sys: "food", tier: 1,
    markers: ["a_agliadin", "a_dgp", "a_ttg", "a_wga"],
    blurb: "Peptide-level wheat antibodies on the silicon chip.",
  },
  cardio_chem: {
    panel: "Cardiometabolic Panel", sys: "cardio", tier: 1,
    markers: ["c_apob", "c_trig", "c_hscrp", "c_hba1c"],
    blurb: "Routine lipids and metabolic chemistry from serum and whole blood.",
  },
  genomics: {
    panel: "Methylation & Clotting Genetics", sys: "foundation", tier: 1,
    markers: ["n_mthfr", "n_apoe", "n_fvleiden"],
    blurb: "Human SNPs from a cheek swab — genotyping, no antibodies involved.",
  },
  gut_proteins: {
    panel: "GI Barrier Proteins", sys: "gut", tier: 1,
    markers: ["p_calprotectin", "p_zonulin", "p_siga", "p_elastase"],
    blurb: "Single stool proteins, each on its own ELISA microplate.",
  },
  neural_zoomer: {
    panel: "Neural Zoomer", sys: "neural", tier: 1,
    markers: ["a_mog", "a_mbp", "a_abeta"],
    blurb: "Brain and myelin autoantibodies on the chemiluminescent array.",
  },

  /* Tier 2 — two-to-three methodologies */
  nutrient_zoomer: {
    panel: "Nutrient Zoomer", sys: "nutrient", tier: 2,
    markers: ["e_magnesium", "e_selenium", "e_zinc", "s_vitd", "s_omega3", "s_coq10"],
    blurb: "Minerals go to ICP-MS; fat-soluble vitamins and fatty acids go to mass spec. Two analyzers, one report.",
  },
  hormone_zoomer: {
    panel: "Hormone Zoomer", sys: "hormone", tier: 2,
    markers: ["s_estradiol", "s_2ohe1", "s_dheas", "s_cortisol"],
    blurb: "Hormone metabolites by mass spec — watch the specimen: most are urine, diurnal cortisol is saliva.",
  },
  tickborne: {
    panel: "Tickborne 2.0", sys: "immune", tier: 2,
    markers: ["a_borr_vlse", "a_borr_ospc", "a_babesia", "n_borrelia_dna"],
    blurb: "A dual approach: antibodies on the chip (indirect) plus pathogen DNA by PCR (direct).",
  },
  food_sensitivity: {
    panel: "Food Sensitivity", sys: "food", tier: 2,
    markers: ["a_casein", "a_ovalbumin", "a_arah2", "a_agliadin"],
    blurb: "Food peptide antibodies — all multiplexed on the chip.",
  },

  /* Tier 3 — full Zoomers, several methodologies */
  gut_zoomer: {
    panel: "Gut Zoomer", sys: "gut", tier: 3,
    markers: ["n_akkermansia", "n_faecali", "n_cdiff", "p_calprotectin", "p_siga", "p_elastase", "s_butyrate"],
    blurb: "One stool sample, three methodologies: microbes by PCR/sequencing, proteins by ELISA, metabolites by mass spec. You must read the whole report.",
  },
  total_tox_burden: {
    panel: "Total Tox Burden", sys: "toxin", tier: 3,
    markers: ["s_ota", "s_glyphosate", "s_pfos", "e_mercury", "e_arsenic", "e_cadmium", "n_gst"],
    blurb: "Mold & chemical toxins (mass spec), heavy metals (ICP-MS), and a detox SNP (genotyping) — three analyzers in one tox workup.",
  },
  cardio_zoomer: {
    panel: "Cardio Zoomer", sys: "cardio", tier: 3,
    markers: ["c_apob", "c_lpa", "c_hscrp", "s_ceramide", "n_apoe"],
    blurb: "Lipids by chemistry, ceramides by mass spec, and a cardiogenetic SNP — multi-modal cardiovascular analytics.",
  },

  /* Tier 4 — capstone */
  foundation_zoomer: {
    panel: "Foundation Zoomer", sys: "foundation", tier: 4,
    markers: ["c_apob", "c_cbc", "a_ttg", "a_dsdna", "s_vitd", "e_magnesium", "n_mthfr"],
    blurb: "A whole-body baseline spanning five analyzers from blood and a swab. Route each marker by its molecule class.",
  },
  cellular_zoomer: {
    panel: "Cellular Zoomer", sys: "cellular", tier: 4,
    markers: ["s_hva", "s_quinolinic", "s_ota", "e_selenium", "c_ferritin"],
    blurb: "Organic acids and metabolites by mass spec, plus an element and a chemistry marker. Don't let the mixed report fool you.",
  },
};

/* ---- Shifts (levels) ----------------------------------------------------- *
 * id, title, brief, queue (explicit list) OR pool+count (sampled),
 * time (seconds), hints (show class→analyzer hint chips), qc (max misroutes).
 * ------------------------------------------------------------------------- */
export const SHIFTS = [
  {
    id: 1,
    title: "Orientation",
    brief:
      "Welcome to the bench. Each kit today exercises a single analyzer — " +
      "learn what each machine detects. Route every aliquot to its match.",
    queue: ["heavy_metals", "mycotoxins", "wheat_zoomer", "gut_proteins", "cardio_chem", "genomics"],
    time: 220, hints: true, qc: 6,
  },
  {
    id: 2,
    title: "Mixed Panels",
    brief:
      "Real requisitions combine molecule classes. Some reports need two or " +
      "three analyzers — and specimen type matters. Read before you route.",
    pool: ["nutrient_zoomer", "hormone_zoomer", "tickborne", "food_sensitivity", "neural_zoomer"],
    count: 5, time: 185, hints: true, qc: 5,
  },
  {
    id: 3,
    title: "Full Zoomers",
    brief:
      "The big panels are here. A single Gut Zoomer can span three " +
      "methodologies. Hints are off — route from what you know.",
    pool: ["gut_zoomer", "total_tox_burden", "cardio_zoomer", "nutrient_zoomer", "tickborne"],
    count: 5, time: 195, hints: false, qc: 5,
  },
  {
    id: 4,
    title: "Rush Hour",
    brief:
      "Peak volume. Capstone reports span up to five analyzers. Keep your " +
      "accuracy up and your turnaround fast.",
    pool: ["foundation_zoomer", "cellular_zoomer", "gut_zoomer", "total_tox_burden", "cardio_zoomer", "hormone_zoomer"],
    count: 7, time: 230, hints: false, qc: 4,
  },
];

/* ---- Fictional patient roster (flavor) ----------------------------------- */
export const PATIENT_NAMES = [
  "A. Rivera", "J. Chen", "M. Okafor", "S. Patel", "L. Novak", "D. Alvarez",
  "K. Yamamoto", "R. Fitzgerald", "T. Brooks", "N. Haddad", "E. Larsson",
  "C. Mwangi", "P. Romano", "G. Singh", "B. Andersson", "F. Costa",
  "H. Nakamura", "V. Petrov", "O. Adeyemi", "W. Kovač",
];

export const GRADES = [
  { min: 0.97, g: "A+", label: "CAP-grade precision" },
  { min: 0.90, g: "A",  label: "Validated run" },
  { min: 0.80, g: "B",  label: "Acceptable, minor reruns" },
  { min: 0.70, g: "C",  label: "Review recommended" },
  { min: 0.0,  g: "QC", label: "QC hold — re-aliquot" },
];
