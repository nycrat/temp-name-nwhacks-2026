import { NextRequest, NextResponse } from "next/server";
import { buildAndExecuteQuery, SearchFilters } from "@/lib/filters";
import { LiveClass } from "@/lib/types";

const SYSTEM_PROMPT = `You are a search parameter extractor for a university course database. Convert the user's natural language request into a JSON object with these keys:
1. subjects: A list of 3-4 letter subject codes (e.g. ["CPSC", "MATH"]). Use [] if generic.
2. level_min: Integer (e.g. 100). Default 100.
3. level_max: Integer (e.g. 400). Default 600.
4. max_duration_mins: Integer. Default 120. Range: [60, 180]
5. starts_within_mins: Integer. How many minutes from NOW should the class start? Default 180. Range: [45, 300]
6. min_capacity: Integer. Minimum room capacity. Use null if not specified.
7. max_capacity: Integer. Maximum room capacity. Use null if not specified.

Key rules:
If user says "hard", set level_min=300.
If user says "chill" or "easy", set level_max=200.
Infer subject codes (e.g. "computers" -> "CPSC"), also infer using context (e.g. "science courses" -> ["CHEM", "BIOL", "PHYS", "CPSC", "ATSC", ...])
For room size: "large lecture" or "big room" -> min_capacity=150, "small class" or "intimate" -> max_capacity=50, "medium" -> min_capacity=50, max_capacity=150. If user mentions specific capacity numbers, use those. 

Examples:
"Short math-based classes starting soon; large lecture with plenty of seats"
{
  "subjects": ["MATH", "STAT"],
  "level_min": 100,
  "level_max": 600,
  "max_duration_mins": 60,
  "starts_within_mins": 30,
  "min_capacity": 200,
  "max_capacity": null
}

Below is a list of subjet codes and their corresponding subject names:
ADHE - Adult and Higher Education
AFST - African Studies
AGEC - Agricultural Economics
ASL - American Sign Language
ANAT - Anatomy
AMNE - Ancient Mediterranean and Near Eastern Studies
ARCL - Anthropological Archaeology
ARCL - Anthropological Archaeology
ANTH - Anthropology
AANB - Applied Animal Biology
APBI - Applied Biology
APSC - Applied Science
APPP - Applied Science Professional Program Platform
AQUA - Aquaculture
ARCH - Architecture
ARST - Archival Studies
ARTH - Art History
ARTS - Arts
ASIC - Arts and Science Interdisciplinary Courses
ARTC - Arts Co-Op
ASTU - Arts Studies
ACAM - Asian Canadian and Asian Migration Studies
ASLA - Asian Languages
ASIA - Asian Studies
ASIX - Asian Studies Crossings
ASTR - Astronomy
ATSC - Atmospheric Science
AUDI - Audiology and Speech Sciences
BIOC - Biochemistry
FSCT - Biochemistry and Forensic Science
BIOF - Bioinformatics
BIOL - Biology
BMEG - Biomedical Engineering
BIOT - Biotechnology
BOTA - Botany
BUSI - Business
BAAC - Business Administration: Accounting
BABS - Business Administration: Business Statistics
BAIT - Business Administration: Business Technology Management
BA - Business Administration: Core
BAEN - Business Administration: Entrepreneurship
BAFI - Business Administration: Finance
BAHR - Business Administration: Human Resources Management
BALA - Business Administration: Law
BAMS - Business Administration: Management Science
BAMA - Business Administration: Marketing
BAPA - Business Administration: Policy Analysis
BASM - Business Administration: Strategic Management
BASC - Business Administration: Supply Chain
BAUL - Business Administration: Urban Land Economics
CDST - Canadian Studies
CNTO - Cantonese
CTLN - Catalan
CELL - Cell and Developmental Biology
PHYL - Cellular and Physiological Sciences
CAPS - Cellular, Anatomical and Physiological Sciences
CENS - Central, Eastern and Northern European Studies
CCFI - Centre for Cross-Faculty Inquiry
CHBE - Chemical and Biological Engineering
CHEM - Chemistry
CHIL - Children's Literature
CHIN - Chinese
CMST - Cinema and Media Studies
CINE - Cinema Studies
CIVL - Civil Engineering
ARBC - Classical Arabic
CLST - Classical Studies
CEEN - Clean Energy Engineering
COGS - Cognitive Systems Program
COMM - Commerce
COEC - Commerce Economics
COHR - Commerce Human Resources
COMR - Commerce Minor
PLAN - Community and Regional Planning
COLX - Computational Linguistics
CPEN - Computer Engineering
CPSC - Computer Science
CAP - Coordinated Arts Program
CSPW - Coordinated Science Program Workshop
CNPS - Counselling Psychology
CRWR - Creative Writing
CCST - Critical and Curatorial Studies
CSIS - Critical Studies in Sexuality
EDCP - Curriculum and Pedagogy
DANI - Danish
DSCI - Data Science
DHYG - Dental Hygiene
DENT - Dentistry
DES - Design
DMED - Digital Media
MEDD - Doctor of Medicine
ECED - Early Childhood Education
EOSC - Earth and Ocean Sciences
ECON - Economics
EDUC - Education
ECPS - Educational & Counselling Psychology, & Special Education
EPSE - Educational Psychology and Special Education
EDST - Educational Studies
ETEC - Educational Technology
EECE - Electrical and Computer Engineering
ELEC - Electrical Engineering
ENPP - Engineering and Public Policy
ENPH - Engineering Physics
ENGL - English
ENST - Environment and Sustainability
ENVE - Environmental Engineering
ENVR - Environmental Science
IEST - European Studies
EXGR - Exchange Graduate Research
EXCH - Exchange Programs
EMBA - Executive M.B.A.
FMPR - Family Practice
FMST - Family Studies
FIPR - Film Production
FNEL - First Nations and Endangered Languages Program
FNIS - First Nations and Indigenous Studies
FISH - Fisheries Research
FRE - Food and Resource Economics
FOOD - Food Science
FNH - Food, Nutrition and Health
BEST - Forest Bioeconomy Sciences and Technology
FOPR - Forest Operations
FRST - Forestry
FCOR - Forestry Core
FOPE - Forestry Online Professional Education
FREN - French
GRSJ - Gender, Race, Sexuality and Social Justice
GSAT - Genome Science and Technology
GEOS - Geographical Sciences
GEOG - Geography
GEM - Geomatics for Environmental Management
GERN - German
GMST - Germanic Studies
GLBH - Global Health
GRS - Global Resource Systems
GREK - Greek
HGSE - Haida Gwaii Semesters
HESO - Health and Society
HEBR - Hebrew
HPB - High Performance Buildings
HINU - Hindi-Urdu
HIST - History
HUNU - Human Nutrition
ILS - Indigenous Land Stewardship
INLB - Indigenous Land-Based Studies
INDO - Indonesian
INFO - Information Studies
IAR - Institute of Asian Research
IGEN - Integrated Engineering
ISCI - Integrated Sciences
IWME - Integrated Water Management Engineering
RADS - Interdisciplinary Radiology
INDS - Interdisciplinary Studies
ITAL - Italian
JAPN - Japanese
JWST - Jewish Studies
JRNL - Journalism
KIN - Kinesiology
KORN - Korean
LFS - Land & Food Systems
LWS - Land and Water Systems
LARC - Landscape Architecture
LLED - Language and Literacy Education
LATN - Latin
LAST - Latin American Studies
LAW - Law
LASO - Law and Society
LIBR - Library and Information Studies
LAIS - Library, Archival and Information Studies
LING - Linguistics
MGMT - Management
MANU - Manufacturing Engineering
MRNE - Marine Science
MTRL - Materials Engineering
MATH - Mathematics
MECH - Mechanical Engineering
MDIA - Media Studies
MEDG - Medical Genetics
MEDI - Medicine
MDVL - Medieval Studies
MICB - Microbiology
MES - Middle East Studies
MIDW - Midwifery
MINE - Mining Engineering
ARBM - Modern Standard Arabic
MUSC - Music
NRES - Natural Resources
CONS - Natural Resources Conservation
NAME - Naval Architecture and Marine Engineering
NEST - Near Eastern Studies
NEPL - Nepali
NRSC - Neuroscience
NSCI - Neuroscience Undergraduate
NEUR - Neurosurgery
NORD - Nordic Studies
NURS - Nursing
OBST - Obstetrics and Gynaecology
OSOT - Occupational Science and Occupational Therapy
ONCO - Oncology
OBMS - Oral Biological Medical Sciences
OHS - Oral Health Sciences
ORPA - Orthopaedics
PATH - Pathology
PERS - Persian
PHAR - Pharmaceutical Sciences
PCTH - Pharmacology and Therapeutics
PHRM - Pharmacy
PHIL - Philosophy
PHTH - Physical Therapy
PHYS - Physics
PLNT - Plant Science
POLS - Polish
POLI - Political Science
PORT - Portuguese
PSYT - Psychiatry
PSYC - Psychology
PPGA - Public Policy And Global Affairs
PUNJ - Punjabi
RADI - Radiology
RHSC - Rehabilitation Sciences
RELG - Religious Studies
RES - Resources, Environment and Sustainability
RMST - Romance Studies
RUSS - Russian
SANS - Sanskrit
SPHA - School of Population & Public Health
SPPH - School of Population & Public Health
SCIE - Science
STS - Science and Technology Studies
SLAV - Slavic and Eastern European Studies
SGES - Smart Grid Energy Systems
SOWK - Social Work
SOCI - Sociology
SOIL - Soil Science
SOAL - South Asian Languages
SEAL - Southeast Asian Languages
SPAN - Spanish
STAT - Statistics
RGST - Study of Religion
SURG - Surgery
SPE - Sustainable Process Engineering
SWAH - Swahili
SWED - Swedish
LIBE - Teacher Librarianship
THTR - Theatre
THFL - Theatre And Film
TIBT - Tibetan Languages
UKRN - Ukrainian
WRIT - University Writing Centre Courses
UDES - Urban Design
UFOR - Urban Forestry
URST - Urban Studies
URSY - Urban Systems
UROL - Urological Surgery
VANT - Vantage College
VISA - Visual Arts
VRHC - Vocational Rehabilitation Counselling
WACH - Women+ and Children's Health Sciences
WOOD - Wood Products Processing
WRDS - Writing, Research, and Discourse Studies
YDSH - Yiddish
ZOOL - Zoology
`;

export async function POST(request: NextRequest) {
  try {
    const { query, now } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // call OpenRouter api
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    const openrouterModel = process.env.OPENROUTER_MODEL_NAME;
    if (!openrouterApiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY not configured" },
        { status: 500 },
      );
    }

    const openrouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openrouterApiKey}`,
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        },
        body: JSON.stringify({
          model: openrouterModel,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: query,
            },
          ],
          response_format: { type: "json_object" },
        }),
      },
    );

    if (!openrouterResponse.ok) {
      const errorText = await openrouterResponse.text();
      console.error("OpenRouter error:", errorText);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 },
      );
    }

    const openrouterData = await openrouterResponse.json();
    const aiResponse = openrouterData.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 },
      );
    }

    // parse ai response
    let filters: SearchFilters;
    try {
      filters = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      return NextResponse.json(
        { error: "Invalid JSON from AI" },
        { status: 500 },
      );
    }

    // apply defaults
    filters.level_min = filters.level_min ?? 100;
    filters.level_max = filters.level_max ?? 600;
    filters.max_duration_mins = filters.max_duration_mins ?? 180;
    filters.starts_within_mins = filters.starts_within_mins ?? 60;
    filters.subjects = filters.subjects ?? [];

    console.log("Filters from AI:", filters);

    try {
      const results = await buildAndExecuteQuery(filters, new Date(now + "Z"));
      return NextResponse.json({ results } as { results: LiveClass[] });
    } catch (queryError) {
      console.error("Query execution error:", queryError);
      const queryErrorMessage =
        queryError instanceof Error
          ? queryError.message
          : "Unknown query error";
      return NextResponse.json(
        { error: "Database query failed", details: queryErrorMessage },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Search error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 },
    );
  }
}
