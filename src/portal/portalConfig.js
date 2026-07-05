import {
  BarChart3,
  Briefcase,
  Building2,
  CalendarClock,
  ClipboardCheck,
  Download,
  FileCheck2,
  FileText,
  FlaskConical,
  GraduationCap,
  Handshake,
  Lightbulb,
  LineChart,
  Megaphone,
  Network,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
} from "lucide-react";

export const PORTAL_TYPES = {
  UNDERGRADUATE: "undergraduate",
  POSTGRADUATE: "postgraduate",
  FACULTY: "faculty",
  INDUSTRY: "industry",
  STARTUP: "startup",
  ADMIN: "admin",
};

export const DEPARTMENTS = [
  "Architecture",
  "Artificial Intelligence",
  "Basic Sciences & Related Studies",
  "Bio-Medical Engineering",
  "Business Administration",
  "Chemical Engineering",
  "City & Regional Planning",
  "Civil Engineering",
  "Computer Systems Engineering",
  "Computer Science",
  "Cyber Security",
  "English",
  "Electrical Engineering",
  "Electronic Engineering",
  "Industrial Engineering",
  "Information Technology",
  "Mathematics",
  "Mechanical Engineering",
  "Mechatronic Engineering",
  "Metallurgy & Materials Engineering",
  "Mining Engineering",
  "Petroleum & Natural Gas Engineering",
  "Software Engineering",
  "Telecommunication Engineering",
  "Textile Engineering",
];

export const DEPARTMENT_CODES = {
  AI: "Artificial Intelligence",
  AR: "Architecture",
  BA: "Business Administration",
  BM: "Bio-Medical Engineering",
  CE: "Civil Engineering",
  CH: "Chemical Engineering",
  CRP: "City & Regional Planning",
  CS: "Computer Science",
  CSE: "Computer Systems Engineering",
  CY: "Cyber Security",
  EL: "Electrical Engineering",
  EN: "English",
  ES: "Electronic Engineering",
  IT: "Information Technology",
  IE: "Industrial Engineering",
  MA: "Mathematics",
  ME: "Mechanical Engineering",
  MT: "Mechatronic Engineering",
  MM: "Metallurgy & Materials Engineering",
  MN: "Mining Engineering",
  PE: "Petroleum & Natural Gas Engineering",
  SW: "Software Engineering",
  TL: "Telecommunication Engineering",
  TX: "Textile Engineering",
};

export const DEFAULT_CREDENTIALS = {
  admin: { username: "oric.admin", password: "Admin@12345" },
  undergraduate: { username: "23sw@students.muet.edu.pk", password: "Student@12345" },
  postgraduate: { username: "23MEsw@students.muet.edu.pk", password: "Postgrad@12345" },
  faculty: { username: "umar.farooq@faculty.muet.edu.pk", password: "Faculty@12345" },
  industry: { username: "industry.partner", password: "Partner@12345" },
  startup: { username: "startup.founder", password: "Startup@12345" },
};

const makePlaceholder = (title, accent = "#1d773b", tint = "#eaf7ef") =>
  `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${tint}"/>
          <stop offset="1" stop-color="#ffffff"/>
        </linearGradient>
      </defs>
      <rect width="960" height="540" rx="34" fill="url(#bg)"/>
      <circle cx="780" cy="110" r="92" fill="${accent}" opacity=".12"/>
      <circle cx="150" cy="410" r="120" fill="${accent}" opacity=".10"/>
      <path d="M222 340h516l-98-120-88 92-70-78-86 106-52-60-122 60z" fill="${accent}" opacity=".24"/>
      <rect x="220" y="165" width="520" height="210" rx="24" fill="none" stroke="${accent}" stroke-width="16" opacity=".48"/>
      <text x="480" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#102b53">${title}</text>
    </svg>
  `)}`;

export const PLACEHOLDER_IMAGES = {
  opportunity: makePlaceholder("ORIC Opportunity", "#1d773b", "#eef8f1"),
  startup: makePlaceholder("Startup Listing", "#c07800", "#fff7e8"),
  fyp: makePlaceholder("FYP Listing", "#0d6b92", "#edf9fd"),
  business: makePlaceholder("Business Idea", "#7c3aed", "#f5f1ff"),
  maleProfile: makePlaceholder("Researcher Profile", "#0d2e5c", "#eef4fb"),
  femaleProfile: makePlaceholder("Researcher Profile", "#b83280", "#fff0f8"),
  neutralProfile: makePlaceholder("Researcher Profile", "#667085", "#f5f7fb"),
};

const sharedUserItems = [
  {
    key: "feedback",
    label: "Feedback",
    icon: ClipboardCheck,
    description:
      "Submit general feedback or respond to forms assigned by ORIC for your portal.",
    enabled: true,
    category: "Support",
  },
  {
    key: "resources",
    label: "Resources",
    icon: Download,
    description:
      "Access policies, templates, forms, guidelines, and downloadable resources shared by ORIC.",
    enabled: true,
    category: "Support",
  },
];

export const PORTAL_CONFIG = {
  [PORTAL_TYPES.UNDERGRADUATE]: {
    title: "Undergraduate Student Portal",
    shortTitle: "Undergraduate",
    badge: "Student",
    color: "green",
    description:
      "Internships, industrial visits, scholarships, FYP listings, startup applications, activities, feedback, and downloads for undergraduate students.",
    stats: [
      { label: "Internships", value: 18, hint: "Active opportunities", icon: Briefcase },
      { label: "FYPs Listed", value: 42, hint: "Student submissions", icon: Lightbulb },
      { label: "Scholarships", value: 9, hint: "Currently open", icon: GraduationCap },
      { label: "Events", value: 12, hint: "Upcoming activities", icon: CalendarClock },
    ],
    features: [
      { key: "internships", label: "Internships", icon: Briefcase, description: "Browse internship opportunities posted by ORIC and industry partners.", enabled: true, category: "Opportunities" },
      { key: "industrial-visits", label: "Visits", icon: Building2, description: "View upcoming industrial visits and participation calls.", enabled: true, category: "Opportunities" },
      { key: "activities", label: "Activities", icon: Sparkles, description: "Discover ORIC and BIC activities that support innovation and career growth.", enabled: true, category: "Opportunities" },
      { key: "scholarships", label: "Scholarships", icon: GraduationCap, description: "Find scholarships and student funding calls relevant to undergraduate students.", enabled: true, category: "Funding" },
      { key: "fyp-listing", label: "FYP Listing", icon: FileText, description: "Upload and manage your FYP title, abstract, team members, supervisor, and prototype status.", enabled: true, category: "Submissions", formType: "fyp" },
      { key: "startup-seed", label: "Seed Funding", icon: Lightbulb, description: "Submit your startup, business idea, or FYP for ORIC scrutiny as a viable business model.", enabled: false, category: "Submissions", formType: "startupSeed" },
      ...sharedUserItems,
    ],
  },
  [PORTAL_TYPES.POSTGRADUATE]: {
    title: "Postgraduate Student Portal",
    shortTitle: "Postgraduate",
    badge: "ME/PhD",
    color: "blue",
    description:
      "Research projects, thesis listings, grants, conferences, assistantships, startup applications, feedback, and resources for postgraduate students.",
    stats: [
      { label: "Research Calls", value: 14, hint: "Open now", icon: FlaskConical },
      { label: "Theses Listed", value: 27, hint: "ME/PhD topics", icon: FileText },
      { label: "Grant Calls", value: 8, hint: "Research/travel", icon: FileCheck2 },
      { label: "Conferences", value: 11, hint: "National/international", icon: Megaphone },
    ],
    features: [
      { key: "research-projects", label: "Research Jobs", icon: FlaskConical, description: "Browse research project openings and assistantship opportunities.", enabled: true, category: "Research" },
      { key: "thesis-listing", label: "Thesis Listing", icon: FileText, description: "Add your thesis details and published research papers for visibility and collaboration.", enabled: true, category: "Submissions", formType: "thesis" },
      { key: "research-grants", label: "Grants", icon: FileCheck2, description: "Apply for active research and travel grant opportunities.", enabled: true, category: "Funding", formType: "grant" },
      { key: "conferences", label: "Conferences", icon: Megaphone, description: "View conference calls, travel support, and paper submission opportunities.", enabled: true, category: "Opportunities" },
      { key: "startup-seed", label: "Seed Funding", icon: Lightbulb, description: "Submit your startup, business idea, thesis work, or FYP for business potential review.", enabled: false, category: "Submissions", formType: "startupSeed" },
      ...sharedUserItems,
    ],
  },
  [PORTAL_TYPES.FACULTY]: {
    title: "Faculty & Dedicated Researcher Portal",
    shortTitle: "Faculty",
    badge: "Researcher",
    color: "navy",
    description:
      "Research profiles, grants, IP registration, project monitoring, collaboration network, conferences, feedback, and resources for faculty and researchers.",
    stats: [
      { label: "Active Projects", value: 47, hint: "+5 this semester", icon: FlaskConical },
      { label: "Publications", value: 138, hint: "Tracked in 2024", icon: FileText },
      { label: "Research Grants", value: "PKR 84M", hint: "12 active grants", icon: FileCheck2 },
      { label: "Researchers", value: 312, hint: "Faculty and scholars", icon: Users },
    ],
    features: [
      { key: "faculty-profile", label: "Research Profile", icon: UserCog, description: "Maintain ORCID, Google Scholar, IEEE Xplore, publications, bio, photo, interests, and supervised students.", enabled: true, category: "Profile", formType: "researchProfile" },
      { key: "research-grants", label: "Grants", icon: FileCheck2, description: "Apply for research grants, travel grants, and active funding calls.", enabled: true, category: "Funding", formType: "grant" },
      { key: "conferences", label: "Conferences", icon: Megaphone, description: "Browse conferences and travel support opportunities.", enabled: true, category: "Opportunities" },
      { key: "ip-registration", label: "IP Registration", icon: ShieldCheck, description: "Submit patents, copyrights, inventions, and innovations for ORIC review and workflow tracking.", enabled: false, category: "Submissions", formType: "ip" },
      { key: "project-monitoring", label: "Projects", icon: LineChart, description: "Track assigned project tasks, budget use, milestones, activities, and deliverables.", enabled: false, category: "Projects" },
      { key: "collaboration-network", label: "Network", icon: Network, description: "Discover researcher/faculty profiles across departments and connect for interdisciplinary research.", enabled: true, category: "Network" },
      ...sharedUserItems,
    ],
  },
  [PORTAL_TYPES.INDUSTRY]: {
    title: "Industry Partner Portal",
    shortTitle: "Industry",
    badge: "Partner",
    color: "teal",
    description:
      "Browse approved startups, FYPs, business ideas, active research projects, submit partnership and sponsorship requests, and collaborate with MUET.",
    stats: [
      { label: "Startups Listed", value: 16, hint: "Admin approved", icon: Lightbulb },
      { label: "FYP Listings", value: 42, hint: "Commercial potential", icon: FileText },
      { label: "Research Projects", value: 31, hint: "Open to sponsors", icon: FlaskConical },
      { label: "Connections", value: 24, hint: "Requests exchanged", icon: Handshake },
    ],
    features: [
      { key: "browse-listings", label: "Listings", icon: Search, description: "View approved startups, FYPs, and business ideas as cards and inspect detailed information.", enabled: true, category: "Investment" },
      { key: "partnership-request", label: "Partnerships", icon: Handshake, description: "Submit partnership offers for selected startups, FYPs, or business ideas.", enabled: true, category: "Investment", formType: "partnership" },
      { key: "browse-research", label: "Research", icon: FlaskConical, description: "Explore active university projects and postgraduate thesis topics open to industry collaboration.", enabled: true, category: "Research" },
      { key: "sponsor-research", label: "Sponsor", icon: FileCheck2, description: "Submit sponsorship or collaboration requests for university projects or postgraduate thesis work.", enabled: true, category: "Research", formType: "sponsorship" },
      ...sharedUserItems,
    ],
  },
  [PORTAL_TYPES.STARTUP]: {
    title: "Startup & Incubatee Portal",
    shortTitle: "Startup",
    badge: "Incubatee",
    color: "amber",
    description:
      "Dedicated access for admin-approved startup founders to manage incubation, mentorship, investor connections, feedback, and resources.",
    stats: [
      { label: "Investor Offers", value: 5, hint: "Awaiting response", icon: Handshake },
      { label: "Mentorship Calls", value: 4, hint: "Open programs", icon: CalendarClock },
      { label: "Resources", value: 18, hint: "Templates and guides", icon: Download },
      { label: "Milestones", value: 7, hint: "Tracked activities", icon: BarChart3 },
    ],
    features: [
      { key: "incubation-application", label: "Incubation", icon: Lightbulb, description: "Confirm ORIC registration and apply for MUET BIC incubation support, mentorship, training, and facilities.", enabled: true, category: "Startup", formType: "incubation" },
      { key: "mentorship", label: "Mentorship", icon: CalendarClock, description: "Apply for active mentorship sessions and schedule support with ORIC/BIC mentors.", enabled: false, category: "Startup" },
      { key: "investor-connections", label: "Investors", icon: Handshake, description: "Review partnership requests from investors and industry partners, then accept or reject with remarks.", enabled: true, category: "Investment" },
      ...sharedUserItems,
    ],
  },
  [PORTAL_TYPES.ADMIN]: {
    title: "Admin & ORIC Staff Portal",
    shortTitle: "Admin",
    badge: "ORIC Staff",
    color: "red",
    description:
      "Central ORIC control room for notifications, approvals, publishing, user management, analytics, reports, feedback forms, and site updates.",
    stats: [
      { label: "Users Onboarded", value: 384, hint: "All portals", icon: Users },
      { label: "Pending Reviews", value: 19, hint: "Applications", icon: ClipboardCheck },
      { label: "Investor Connections", value: 24, hint: "Made with students", icon: Handshake },
      { label: "Startups Listed", value: 16, hint: "Approved", icon: Lightbulb },
    ],
    features: [
      { key: "approve-grants", label: "Approvals", icon: ClipboardCheck, description: "Review postgraduate and faculty applications for research projects and grants, then approve or reject with remarks.", enabled: true, category: "Approvals" },
      { key: "ip-workflows", label: "IP Workflows", icon: ShieldCheck, description: "Review faculty patent/copyright applications and manage approval workflows.", enabled: true, category: "Approvals" },
      { key: "startup-review", label: "Startup Review", icon: Lightbulb, description: "Scrutinize startup applications, approve viable models, and assign dedicated portal credentials.", enabled: true, category: "Approvals" },
      { key: "users", label: "Users", icon: UserCog, description: "Search users by name, email, or username; edit details; change passwords; suspend; or delete accounts.", enabled: true, category: "Management" },
      { key: "publish", label: "Publish", icon: Megaphone, description: "Publish opportunities, calls, and programs to selected portal audiences.", enabled: true, category: "Publishing" },
      { key: "site-updates", label: "Site Updates", icon: Settings, description: "Publish portal announcements and update frequently changed website elements such as director details.", enabled: true, category: "Publishing" },
      { key: "analytics", label: "Analytics", icon: BarChart3, description: "View tracked KPIs, optionally override displayed values, and manage portal-wide statistics.", enabled: true, category: "Analytics" },
      { key: "reports", label: "Reports", icon: LineChart, description: "View charts and download PDF or Excel reports for detailed ORIC portal statistics.", enabled: true, category: "Analytics" },
      { key: "feedback-admin", label: "Feedback", icon: ClipboardCheck, description: "Create feedback forms for selected portals and review submitted responses.", enabled: true, category: "Feedback" },
      { key: "resource-admin", label: "Resources", icon: Download, description: "Upload resources and choose which portals can access each file.", enabled: true, category: "Publishing" },
    ],
  },
};

export const SAMPLE_POSTS = [
  { id: 1, type: "Internship", title: "Software Engineering Internship", audience: ["undergraduate"], status: "Open", meta: "Tech partner - Hyderabad", body: "Frontend, backend, and QA internship slots for final year students.", applyLink: "https://oric.muet.edu.pk/apply/internship-software" },
  { id: 2, type: "Scholarship", title: "Innovation Scholarship Call", audience: ["undergraduate", "postgraduate"], status: "Open", meta: "Deadline: 18 Aug 2026", body: "Merit-based support for students working on innovation-led projects.", applyLink: "https://oric.muet.edu.pk/apply/innovation-scholarship" },
  { id: 3, type: "Research Job", title: "RA: Applied AI for Energy Systems", audience: ["postgraduate"], status: "Open", meta: "Research assistantship", body: "Support data preparation, model training, and evaluation for energy system optimization research.", applyLink: "https://oric.muet.edu.pk/apply/ra-energy-ai" },
  { id: 4, type: "Research Grant", title: "Applied AI for Energy Systems", audience: ["postgraduate", "faculty"], status: "Open", meta: "PKR 2.5M seed support", body: "Proposal call for applied AI models in energy monitoring and optimization.", applyLink: "https://oric.muet.edu.pk/apply/grant-energy-ai" },
  { id: 5, type: "Conference", title: "International Research Mobility Support", audience: ["postgraduate", "faculty"], status: "Open", meta: "Travel grant available", body: "Support for accepted papers at indexed international conferences.", applyLink: "https://oric.muet.edu.pk/apply/research-mobility" },
  { id: 6, type: "Resource", title: "ORIC Proposal Template", audience: ["undergraduate", "postgraduate", "faculty", "startup"], status: "Available", meta: "DOCX template", body: "Standard template for ORIC submissions and project proposals.", applyLink: "#" },
];

export const FALLBACK_OPPORTUNITIES = {
  "Research Job": [
    { id: "rj-1", type: "Research Job", title: "RA: Renewable Energy Forecasting", status: "Open", meta: "Electrical Engineering", body: "Assist with time-series modeling, solar/wind data cleaning, and technical reporting for renewable energy forecasting.", applyLink: "https://oric.muet.edu.pk/apply/ra-renewable-forecasting" },
    { id: "rj-2", type: "Research Job", title: "RA: Sindh Water Quality Lab", status: "Open", meta: "Civil Engineering", body: "Support field sampling, lab record management, and dashboard preparation for district-level water quality research.", applyLink: "https://oric.muet.edu.pk/apply/ra-water-quality" },
    { id: "rj-3", type: "Research Job", title: "RA: Low-Cost IoT Monitoring", status: "Open", meta: "Electronic Engineering", body: "Work on sensor calibration, firmware testing, and deployment documentation for IoT monitoring nodes.", applyLink: "https://oric.muet.edu.pk/apply/ra-iot-monitoring" },
    { id: "rj-4", type: "Research Job", title: "RA: NLP for Sindhi Documents", status: "Open", meta: "Software Engineering", body: "Prepare annotated datasets and evaluate language models for Sindhi document search and classification.", applyLink: "https://oric.muet.edu.pk/apply/ra-sindhi-nlp" },
    { id: "rj-5", type: "Research Job", title: "RA: Smart Agriculture Analytics", status: "Open", meta: "Computer Systems Engineering", body: "Analyze crop, weather, and soil datasets to support precision agriculture decision models.", applyLink: "https://oric.muet.edu.pk/apply/ra-smart-agriculture" },
  ],
  "Research Grant": [
    { id: "rg-1", type: "Research Grant", title: "HEC-NRPU Proposal Support", status: "Open", meta: "Up to PKR 10M", body: "Funding support for faculty and ME/PhD teams preparing nationally relevant applied research proposals.", applyLink: "https://oric.muet.edu.pk/apply/hec-nrpu" },
    { id: "rg-2", type: "Research Grant", title: "Travel Grant for Indexed Conference", status: "Open", meta: "International travel", body: "Partial travel support for accepted papers in indexed international conferences.", applyLink: "https://oric.muet.edu.pk/apply/travel-grant" },
    { id: "rg-3", type: "Research Grant", title: "Prototype Development Mini Grant", status: "Open", meta: "PKR 500K", body: "Small grant for prototype validation, testing materials, and early commercialization readiness.", applyLink: "https://oric.muet.edu.pk/apply/prototype-mini-grant" },
    { id: "rg-4", type: "Research Grant", title: "Industry Problem-Solving Fund", status: "Open", meta: "Industry co-funded", body: "Support for research teams solving validated industry problems with measurable deliverables.", applyLink: "https://oric.muet.edu.pk/apply/industry-problem-fund" },
    { id: "rg-5", type: "Research Grant", title: "ME/PhD Thesis Research Support", status: "Open", meta: "Postgraduate support", body: "Material, survey, software, or fieldwork support for approved ME/PhD thesis work.", applyLink: "https://oric.muet.edu.pk/apply/thesis-support" },
  ],
  Conference: [
    { id: "cf-1", type: "Conference", title: "International Engineering Research Conference", status: "Open", meta: "Paper submission support", body: "Support call for faculty and ME/PhD scholars presenting peer-reviewed engineering research.", applyLink: "https://oric.muet.edu.pk/apply/ierc-support" },
    { id: "cf-2", type: "Conference", title: "National Innovation & Commercialization Forum", status: "Open", meta: "Islamabad", body: "Participation support for research commercialization, technology transfer, and innovation policy sessions.", applyLink: "https://oric.muet.edu.pk/apply/nicf" },
    { id: "cf-3", type: "Conference", title: "AI and Data Science Symposium", status: "Open", meta: "Hybrid", body: "Call for AI, ML, data platforms, and responsible computing research presentations.", applyLink: "https://oric.muet.edu.pk/apply/ai-symposium" },
    { id: "cf-4", type: "Conference", title: "Sustainable Infrastructure Conference", status: "Open", meta: "Regional conference", body: "Conference opportunity for civil, city planning, water, and materials research teams.", applyLink: "https://oric.muet.edu.pk/apply/sustainable-infra" },
    { id: "cf-5", type: "Conference", title: "IEEE Student & Faculty Research Meetup", status: "Open", meta: "IEEE track", body: "Networking and paper presentation opportunity for electronics, telecom, software, and computing research.", applyLink: "https://oric.muet.edu.pk/apply/ieee-meetup" },
  ],
};

export const SAMPLE_LISTINGS = [
  { id: "st-1", kind: "Startup", title: "AquaSense IoT", owner: "Nida Memon", department: "Electronic Engineering", summary: "Low-cost water quality monitoring for rural Sindh.", status: "Approved", needs: "Seed investment and pilot deployment partner", image: PLACEHOLDER_IMAGES.startup },
  { id: "fyp-1", kind: "FYP", title: "AI Crop Disease Detector", owner: "Team Software Engineering", department: "Software Engineering", summary: "Mobile-first plant disease detection using lightweight ML.", status: "Approved", needs: "Dataset access and commercialization support", image: PLACEHOLDER_IMAGES.fyp },
  { id: "biz-1", kind: "Business Idea", title: "Campus Circular Marketplace", owner: "Ali Shah", department: "Business Administration", summary: "Verified marketplace for student services and reusable academic materials.", status: "Approved", needs: "Mentorship and investor validation", image: PLACEHOLDER_IMAGES.business },
  { id: "st-demo", kind: "Startup", title: "SindhuGPT", owner: "Ghulam Hussain", ownerEmail: "23sw@students.muet.edu.pk", department: "Software Engineering", summary: "A regional AI assistant for Sindhi knowledge access, education, and university services.", status: "Approved", needs: "Cloud credits, pilot customers, and investor introductions", image: PLACEHOLDER_IMAGES.startup },
];

export const SAMPLE_RESEARCH_PROFILES = [
  { id: 1, name: "Dr. Farah Naz", gender: "female", department: "Electrical Engineering", interests: "Smart grids, renewable energy, optimization", orcid: "0000-0002-1289-4312", scholar: "https://scholar.google.com", bio: "Researcher focused on resilient energy systems and industry collaboration." },
  { id: 2, name: "Dr. Umar Farooq", gender: "male", department: "Software Engineering", interests: "Machine learning, data platforms, civic technology", orcid: "0000-0001-7821-1150", scholar: "https://scholar.google.com", bio: "Works on applied ML and digital systems for public-sector research problems." },
  { id: 3, name: "Prof. Nadia Baloch", gender: "female", department: "Telecommunication Engineering", interests: "Wireless networks, IoT, edge computing", orcid: "0000-0003-3367-8821", scholar: "https://scholar.google.com", bio: "Leads IoT-enabled research projects with agriculture and industry partners." },
];
