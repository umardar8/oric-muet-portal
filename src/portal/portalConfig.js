import {
  BarChart3,
  Briefcase,
  CalendarClock,
  ClipboardCheck,
  Download,
  FileCheck2,
  FileText,
  FlaskConical,
  GraduationCap,
  Handshake,
  LayoutDashboard,
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
  admin: { username: "oric.admin", password: "Password@12345" },
  undergraduate: { username: "26sw00@students.muet.edu.pk", password: "Password@12345" },
  postgraduate: { username: "26mese00@students.muet.edu.pk", password: "Password@12345" },
  faculty: { username: "umar.farooq@faculty.muet.edu.pk", password: "Password@12345" },
  industry: { username: "industry.partner", password: "Password@12345" },
  startup: { username: "startup.founder", password: "Password@12345" },
};

const makePlaceholder = (accent = "#0878d7", tint = "#eaf4ff") =>
  `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${tint}"/>
          <stop offset=".58" stop-color="#ffffff"/>
          <stop offset="1" stop-color="#d9edff"/>
        </linearGradient>
        <linearGradient id="wave" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${accent}" stop-opacity=".9"/>
          <stop offset="1" stop-color="#0a2f63" stop-opacity=".82"/>
        </linearGradient>
      </defs>
      <rect width="960" height="540" rx="34" fill="url(#bg)"/>
      <circle cx="785" cy="105" r="118" fill="${accent}" opacity=".14"/>
      <circle cx="166" cy="418" r="142" fill="#0a2f63" opacity=".10"/>
      <path d="M0 368c108-54 190-50 286 2 116 62 202 62 320 0 116-60 224-62 354-4v174H0z" fill="url(#wave)" opacity=".88"/>
      <path d="M86 270c76-58 172-86 284-84 150 3 253 72 396 40 48-10 88-28 124-50v112c-80 49-170 69-272 46-150-34-242-91-394-47-54 16-100 42-138 76z" fill="${accent}" opacity=".18"/>
      <rect x="114" y="92" width="116" height="116" rx="28" fill="#ffffff" opacity=".72"/>
      <rect x="738" y="314" width="108" height="108" rx="28" fill="#ffffff" opacity=".52"/>
      <path d="M142 172h60M172 142v60" stroke="${accent}" stroke-width="18" stroke-linecap="round" opacity=".76"/>
    </svg>
  `)}`;

const makeLogo = (label, accent = "#0878d7") =>
  `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="28" fill="#ffffff"/>
      <rect x="10" y="10" width="140" height="140" rx="24" fill="#eaf4ff"/>
      <circle cx="80" cy="62" r="34" fill="${accent}" opacity=".18"/>
      <path d="M48 88h64l-12 28H60z" fill="${accent}" opacity=".86"/>
      <path d="M44 72l36-24 36 24-36 24z" fill="#0a2f63"/>
      <text x="80" y="134" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="800" fill="${accent}">${label}</text>
    </svg>
  `)}`;

export const PLACEHOLDER_IMAGES = {
  opportunity: makePlaceholder("#0878d7", "#eaf4ff"),
  startup: makePlaceholder("#0a72c7", "#eaf4ff"),
  fyp: makePlaceholder("#0b8bdc", "#edf8ff"),
  business: makePlaceholder("#0759ad", "#eaf4ff"),
  maleProfile: makePlaceholder("#0a2f63", "#eef6ff"),
  femaleProfile: makePlaceholder("#0878d7", "#eef6ff"),
  neutralProfile: makePlaceholder("#426b9a", "#f1f7ff"),
};

export const SCHOLARSHIP_LOGOS = {
  needMerit: makeLogo("NM"),
  saef: makeLogo("SE"),
  poverty: makeLogo("FA"),
  citizen: makeLogo("CF"),
  zakat: makeLogo("ZK"),
  usaid: makeLogo("US"),
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
    color: "blue",
    description:
      "Opportunities, events, scholarships, FYP listings, startup applications, feedback, and downloads for undergraduate students.",
    stats: [
      { label: "Opportunities", value: 18, hint: "Active calls", icon: LayoutDashboard },
      { label: "FYPs Listed", value: 42, hint: "Student submissions", icon: Lightbulb },
      { label: "Scholarships", value: 9, hint: "Currently open", icon: GraduationCap },
      { label: "Upcoming Events", value: 12, hint: "Upcoming events", icon: CalendarClock },
    ],
    features: [
      { key: "internships", label: "Opportunities", icon: Briefcase, description: "Browse internships, workshops, bootcamps, industrial visits, and other student opportunities posted by ORIC and industry partners.", enabled: true, category: "Opportunities" },
      { key: "activities", label: "Upcoming Events", icon: Sparkles, description: "Discover competitions, talks, job fairs, academic events, entertainment, and other upcoming ORIC events.", enabled: true, category: "Events" },
      { key: "scholarships", label: "Scholarships", icon: GraduationCap, description: "Find scholarships and student funding calls relevant to undergraduate students.", enabled: true, category: "Funding" },
      { key: "fyp-listing", label: "FYP Listing", icon: FileText, description: "Upload and manage your FYP title, abstract, team members, supervisor, and prototype status.", enabled: true, category: "Submissions", formType: "fyp" },
      { key: "startup-seed", label: "Apply for Seed Funding", icon: Lightbulb, description: "Submit your startup, business idea, or FYP for ORIC scrutiny as a viable business model.", enabled: false, category: "Submissions", formType: "startupSeed" },
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
      { key: "forms-admin", label: "Create Forms", icon: FileText, description: "Create reusable application forms and attach them to published opportunities, grants, and collaboration calls.", enabled: true, category: "Publishing" },
      { key: "publish", label: "Publish", icon: Megaphone, description: "Publish opportunities, calls, and programs to selected portal audiences.", enabled: true, category: "Publishing" },
      { key: "site-updates", label: "Site Updates", icon: Settings, description: "Publish portal announcements and update frequently changed website elements such as director details.", enabled: true, category: "Publishing" },
      { key: "analytics", label: "Analytics", icon: BarChart3, description: "View tracked KPIs, optionally override displayed values, and manage portal-wide statistics.", enabled: true, category: "Analytics" },
      { key: "reports", label: "Reports", icon: LineChart, description: "View charts and download PDF or Excel reports for detailed ORIC portal statistics.", enabled: true, category: "Analytics" },
      { key: "feedback-admin", label: "Feedback", icon: ClipboardCheck, description: "Create feedback forms for selected portals and review submitted responses.", enabled: true, category: "Feedback" },
      { key: "resource-admin", label: "Resources", icon: Download, description: "Upload resources and choose which portals can access each file.", enabled: true, category: "Publishing" },
    ],
  },
};

export const SAMPLE_FORMS = [
  {
    id: "internship-form",
    name: "Internship Form",
    description: "Default application form for undergraduate internship opportunities.",
    fields: [
      { key: "fullName", label: "Full Name", type: "text", auto: "name", required: true },
      { key: "applyingFor", label: "Applying For", type: "text", auto: "postTitle", required: true },
      { key: "rollNumber", label: "Roll Number/ID", type: "text", auto: "rollNumber", required: true },
      { key: "email", label: "Email Address", type: "email", required: true },
      { key: "phone", label: "Phone Number/WhatsApp", type: "tel", required: true },
      { key: "linkedin", label: "LinkedIn Profile URL", type: "url", required: true },
      { key: "portfolio", label: "Personal Website / Portfolio URL", type: "url" },
      { key: "department", label: "Department", type: "text", required: true },
      { key: "year", label: "Current Year of Study", type: "select", options: ["First", "Second", "Third", "Fourth/Final"], required: true },
      { key: "gpa", label: "Current GPA", type: "number", required: true },
      { key: "resume", label: "Resume/CV Upload", type: "file", accept: "application/pdf,.pdf", required: true },
      { key: "coverLetter", label: "Cover Letter", type: "textarea" },
      { key: "skills", label: "Key Skills", type: "text", required: true },
      { key: "interest", label: "Why are you interested in this opportunity?", type: "textarea", required: true },
      { key: "learningGoal", label: "What do you hope to learn or achieve during this opportunity?", type: "textarea", required: true },
      { key: "confirmation", label: "I confirm that the information provided is accurate.", type: "checkbox", required: true },
    ],
  },
  {
    id: "workshop-form",
    name: "Workshop Form",
    description: "Default registration form for workshops.",
    fields: [
      { key: "fullName", label: "Full Name", type: "text", auto: "name", required: true },
      { key: "applyingFor", label: "Applying For", type: "text", auto: "postTitle", required: true },
      { key: "rollNumber", label: "Roll Number/ID", type: "text", auto: "rollNumber", required: true },
      { key: "email", label: "Email Address", type: "email", required: true },
      { key: "phone", label: "Phone Number/WhatsApp", type: "tel", required: true },
      { key: "department", label: "Department", type: "text", required: true },
      { key: "year", label: "Current Year of Study", type: "select", options: ["First", "Second", "Third", "Fourth/Final"], required: true },
      { key: "experience", label: "Prior Experience / Skill Level", type: "text" },
      { key: "motivation", label: "Why do you want to attend this workshop?", type: "textarea", required: true },
      { key: "takeaway", label: "What do you hope to take away from this session?", type: "textarea" },
      { key: "links", label: "Relevant Links", type: "url" },
      { key: "dietary", label: "Dietary Restrictions", type: "text" },
      { key: "accessibility", label: "Accessibility Requirements", type: "text" },
    ],
  },
  {
    id: "bootcamp-form",
    name: "Bootcamp Form",
    description: "Default application form for intensive bootcamp programs.",
    fields: [
      { key: "fullName", label: "Full Name", type: "text", auto: "name", required: true },
      { key: "applyingFor", label: "Applying For", type: "text", auto: "postTitle", required: true },
      { key: "rollNumber", label: "Roll Number/ID", type: "text", auto: "rollNumber", required: true },
      { key: "email", label: "Email Address", type: "email", required: true },
      { key: "phone", label: "Phone Number/WhatsApp", type: "tel", required: true },
      { key: "department", label: "Department", type: "text", required: true },
      { key: "year", label: "Current Year of Study", type: "select", options: ["First", "Second", "Third", "Fourth/Final"], required: true },
      { key: "skillLevel", label: "Current Skill Level", type: "radio", options: ["Beginner", "Intermediate", "Advanced"], required: true },
      { key: "experience", label: "Prior Experience", type: "textarea" },
      { key: "portfolio", label: "Personal Website / Portfolio URL", type: "url" },
      { key: "motivation", label: "Why are you applying for this specific bootcamp?", type: "textarea", required: true },
      { key: "primaryGoal", label: "What is your primary goal upon completion?", type: "textarea", required: true },
      { key: "commitment", label: "I confirm I can commit to the required amount of hours per week for the duration of this program.", type: "checkbox", required: true },
    ],
  },
  {
    id: "research-grant-form",
    name: "Research Grant Form",
    description: "Default application form for postgraduate and faculty research grants.",
    fields: [
      { key: "applicantType", label: "Applicant Type", type: "text", auto: "applicantType", required: true },
      { key: "applyingFor", label: "Applying For", type: "text", auto: "postTitle", required: true },
      { key: "fullName", label: "Full Name", type: "text", auto: "name", required: true },
      { key: "universityId", label: "University ID / Roll Number", type: "text", auto: "rollNumber", required: true },
      { key: "email", label: "Email Address", type: "email", required: true },
      { key: "phone", label: "Phone Number/WhatsApp", type: "tel", required: true },
      { key: "department", label: "Department", type: "text", required: true },
      { key: "members", label: "Members / Research Assistants", type: "text", required: true },
      { key: "supervisor", label: "Supervised by", type: "text", required: true },
      { key: "projectTitle", label: "Project Title", type: "text", required: true },
      { key: "domain", label: "Research Domain", type: "text", required: true },
      { key: "abstract", label: "Summary / Abstract", type: "textarea", maxWords: 300, required: true },
      { key: "startDate", label: "Start Date", type: "date", required: true },
      { key: "endDate", label: "Proposed End Date", type: "date", required: true },
      { key: "background", label: "Background and Problem Statement", type: "textarea", required: true },
      { key: "objectives", label: "Aim and Primary Objectives", type: "textarea", required: true },
      { key: "methodology", label: "Research Methodology", type: "file", accept: "application/pdf,.pdf", required: true },
      { key: "timeline", label: "Expected Milestones and Timeline", type: "file", accept: "application/pdf,.pdf", required: true },
      { key: "amount", label: "Total Grant Amount Requested", type: "number", required: true },
      { key: "budgetEquipment", label: "Budget Breakdown - Equipment", type: "number", required: true },
      { key: "budgetConsumables", label: "Budget Breakdown - Consumables", type: "number", required: true },
      { key: "budgetTravel", label: "Budget Breakdown - Travel", type: "number", required: true },
      { key: "budgetSoftware", label: "Budget Breakdown - Software", type: "number", required: true },
      { key: "budgetPersonnel", label: "Budget Breakdown - Personnel/Stipends", type: "number", required: true },
      { key: "coFunding", label: "Existing / Co-Funding Sources", type: "textarea", required: true },
      { key: "justification", label: "Justification of Resources", type: "textarea", required: true },
      { key: "ipPotential", label: "Intellectual Property (IP) and Innovation Potential", type: "radio", options: ["Yes", "No", "Unsure"], required: true },
      { key: "industryPartners", label: "Industry Partners", type: "textarea", required: true },
      { key: "ethicalClearance", label: "I acknowledge ethical clearance requirements for Human Subjects, Animal Testing, Biohazards, and related areas.", type: "checkbox", required: true },
      { key: "originality", label: "I confirm this proposal is original work.", type: "checkbox", required: true },
    ],
  },
  {
    id: "feedback-form",
    name: "ORIC Portal Feedback Form",
    description: "Default feedback form for all ORIC portal users.",
    fields: [
      { key: "overallSatisfaction", label: "Overall Satisfaction Rating", type: "rating", required: true },
      { key: "easeOfNavigation", label: "Ease of Navigation: How easy was it to find the information you were looking for?", type: "rating", required: true },
      { key: "mobileExperience", label: "Mobile Experience", type: "radio", options: ["Excellent", "Good", "Average", "Poor"], required: true },
      { key: "technicalIssues", label: "Did you experience any technical issues or slow loading times?", type: "radio", options: ["Yes", "No"], required: true },
      { key: "issueContext", label: "If Yes, what were you trying to do when the issue occurred?", type: "textarea" },
      { key: "screenshot", label: "Screenshot Upload", type: "file", accept: "image/*" },
      { key: "requestedFeature", label: "What is one feature you would like to see added to the ORIC portal?", type: "textarea", required: true },
      { key: "otherSuggestions", label: "Any other suggestions or comments?", type: "textarea" },
    ],
  },
];

export const SAMPLE_POSTS = [
  { id: 1, type: "Internship", title: "Software Engineering Internship", audience: ["undergraduate"], status: "Open", meta: "Tech partner - Hyderabad", deadline: "15 Aug 2026", formId: "internship-form", body: "Frontend, backend, and QA internship slots for final year students.", applyLink: "https://oric.muet.edu.pk/apply/internship-software" },
  { id: 11, type: "Workshop", title: "Research Methodology Workshop", audience: ["undergraduate"], status: "Open", meta: "ORIC Training Hall", deadline: "22 Aug 2026", formId: "workshop-form", body: "Hands-on workshop for survey design, literature review planning, and applied research documentation.", applyLink: "https://oric.muet.edu.pk/apply/research-methodology-workshop" },
  { id: 12, type: "Bootcamp", title: "Startup Pitch Bootcamp", audience: ["undergraduate"], status: "Open", meta: "BIC MUET", deadline: "30 Aug 2026", formId: "bootcamp-form", body: "A focused bootcamp for idea validation, pitch practice, business model drafting, and mentor feedback.", applyLink: "https://oric.muet.edu.pk/apply/startup-pitch-bootcamp" },
  { id: 13, type: "Industrial Visit", title: "Software Industry Visit", audience: ["undergraduate"], status: "Open", meta: "Hyderabad Software House", deadline: "05 Sep 2026", formId: "workshop-form", body: "Visit an industry partner to observe delivery workflows, QA practices, and internship pathways.", applyLink: "https://oric.muet.edu.pk/apply/software-industry-visit" },
  { id: 14, type: "Other Opportunity", title: "Innovation Volunteer Program", audience: ["undergraduate"], status: "Open", meta: "ORIC MUET", deadline: "10 Sep 2026", body: "Volunteer with ORIC innovation programs and gain exposure to events, research showcases, and startup support.", applyLink: "https://oric.muet.edu.pk/apply/innovation-volunteer" },
  { id: 21, type: "Competition", title: "Hacktober Fest Hackathon", audience: ["undergraduate"], status: "Open", meta: "Software Department", location: "Software Department", date: "27-07-2026", time: "10am to 2pm", duration: "3 days", organizedBy: "Software Engineering Department", interestedCount: 34, body: "Student teams compete with prototypes, research ideas, and startup concepts for mentor review." },
  { id: 22, type: "Talk", title: "TEDxMUET: Founders Stories 2026", audience: ["undergraduate"], status: "Open", meta: "Main Auditorium", location: "Main Auditorium", date: "02-08-2026", time: "11am to 12pm", duration: "1 hour", organizedBy: "ORIC", interestedCount: 48, body: "Founders and alumni share practical journeys from first idea to market launch." },
  { id: 23, type: "Job Fair", title: "MUET Career Fair 2026", audience: ["undergraduate"], status: "Open", meta: "Central Library Lawn", location: "Central Library Lawn", date: "15-08-2026", time: "9am to 4pm", duration: "1 day", organizedBy: "ORIC", interestedCount: 126, body: "Meet employers, submit resumes, and explore graduate trainee and internship openings." },
  { id: 24, type: "Academic Event", title: "Annual Book Fair", audience: ["undergraduate"], status: "Open", meta: "Central Library", location: "Central Library", date: "22-08-2026", time: "10am to 3pm", duration: "1 day", organizedBy: "Central Library", interestedCount: 57, body: "Browse academic titles, research references, and reading resources curated for MUET students." },
  { id: 25, type: "Entertainment", title: "MUET Gala 2026", audience: ["undergraduate"], status: "Open", meta: "Student Activity Center", location: "Student Activity Center", date: "29-08-2026", time: "5pm to 8pm", duration: "3 hours", organizedBy: "MUET", interestedCount: 92, body: "A campus celebration with performances, networking, and student community activities." },
  { id: 26, type: "Other Event", title: "Community Design Sprint", audience: ["undergraduate"], status: "Open", meta: "Civil Engineering Studio", location: "Civil Engineering Studio", date: "05-09-2026", time: "10am to 1pm", duration: "2 days", interestedCount: 41, body: "Cross-disciplinary teams design quick solutions for community and campus challenges." },
  { id: 2, type: "Scholarship", title: "Need-Cum Merit Scholarship", audience: ["undergraduate"], status: "Open", meta: "SFAO - Admin Building", deadline: "18 Aug 2026", logo: SCHOLARSHIP_LOGOS.needMerit, body: "Financial support for students with demonstrated need and strong academic performance.", details: "Eligibility: enrolled undergraduate student, satisfactory academic progress, demonstrated financial need, and no major disciplinary record.\n\nSelection considers academic record, family income, supporting documents, and SFAO verification.", documentsRequired: "Filled application form\nCNIC/B-Form copy\nStudent ID card copy\nLatest transcript/result card\nParent/guardian CNIC copy\nIncome certificate or salary slip\nUtility bills\nFee voucher\nAny additional SFAO verification documents", applicationFormUrl: "/resources/scholarships/need-cum-merit-scholarship-form.txt", applyLink: "/resources/scholarships/need-cum-merit-scholarship-form.txt" },
  { id: 41, type: "Scholarship", title: "Student Advancement & Endowment Fund (SAEF)", audience: ["undergraduate"], status: "Open", meta: "SFAO - Admin Building", deadline: "25 Aug 2026", logo: SCHOLARSHIP_LOGOS.saef, body: "University advancement and endowment support for deserving students facing financial constraints.", details: "Eligibility: active student status, financial need verified by SFAO, acceptable academic standing, and complete documentation.\n\nPriority may be given to students with exceptional hardship or continuity risk.", documentsRequired: "Filled SAEF application form\nCNIC/B-Form copy\nStudent ID card copy\nAcademic transcript\nIncome proof\nGuardian CNIC\nUtility bills\nPersonal statement\nAny SFAO-required affidavit", applicationFormUrl: "/resources/scholarships/saef-scholarship-form.txt", applyLink: "/resources/scholarships/saef-scholarship-form.txt" },
  { id: 42, type: "Scholarship", title: "Financial Assistance on Poverty Basis", audience: ["undergraduate"], status: "Open", meta: "SFAO - Admin Building", deadline: "30 Aug 2026", logo: SCHOLARSHIP_LOGOS.poverty, body: "Need-based assistance for students from low-income households requiring fee or educational support.", details: "Eligibility: low-income household, enrolled student status, satisfactory conduct, and complete poverty/need verification by SFAO.\n\nApplications are reviewed after document screening and may require interview or home/income verification.", documentsRequired: "Filled application form\nCNIC/B-Form copy\nStudent ID card copy\nParent/guardian CNIC\nIncome certificate\nPoverty certificate if applicable\nUtility bills\nRent agreement if applicable\nFee challan\nLatest transcript", applicationFormUrl: "/resources/scholarships/poverty-basis-financial-assistance-form.txt", applyLink: "/resources/scholarships/poverty-basis-financial-assistance-form.txt" },
  { id: 43, type: "Scholarship", title: "Citizen Foundation Scholarship", audience: ["undergraduate"], status: "Closed", meta: "SFAO - Admin Building", deadline: "12 Sep 2026", logo: SCHOLARSHIP_LOGOS.citizen, body: "External foundation-linked support for eligible students who meet academic and financial criteria.", details: "Eligibility: students meeting foundation criteria, financial need, academic performance requirements, and SFAO verification.\n\nClosed calls remain visible for reference until the next cycle is announced.", documentsRequired: "Foundation application form\nCNIC/B-Form copy\nStudent ID card copy\nAcademic transcript\nIncome proof\nGuardian CNIC\nRecommendation or verification letter if requested\nAny foundation-specific documents", applicationFormUrl: "/resources/scholarships/citizen-foundation-scholarship-form.txt", applyLink: "/resources/scholarships/citizen-foundation-scholarship-form.txt" },
  { id: 44, type: "Scholarship", title: "Zakat based Scholarship", audience: ["undergraduate"], status: "Open", meta: "SFAO - Admin Building", deadline: "20 Sep 2026", logo: SCHOLARSHIP_LOGOS.zakat, body: "Zakat-funded scholarship support for eligible Muslim students as per applicable Zakat criteria.", details: "Eligibility: student must satisfy Zakat eligibility requirements, demonstrate financial need, and provide complete supporting documents.\n\nSFAO may require specific declarations or verification before forwarding applications.", documentsRequired: "Filled Zakat scholarship form\nCNIC/B-Form copy\nStudent ID card copy\nZakat eligibility declaration\nParent/guardian CNIC\nIncome certificate\nUtility bills\nFee voucher\nAcademic transcript", applicationFormUrl: "/resources/scholarships/zakat-based-scholarship-form.txt", applyLink: "/resources/scholarships/zakat-based-scholarship-form.txt" },
  { id: 45, type: "Scholarship", title: "USAID Scholarship", audience: ["undergraduate"], status: "Closed", meta: "SFAO - Admin Building", deadline: "05 Oct 2026", logo: SCHOLARSHIP_LOGOS.usaid, body: "USAID-linked scholarship opportunity subject to donor criteria, SFAO guidance, and announced cycles.", details: "Eligibility: based on USAID program requirements, academic standing, financial need, and complete SFAO/donor documentation.\n\nStudents should follow SFAO instructions carefully because donor-funded calls may have strict formats and deadlines.", documentsRequired: "USAID application form\nCNIC/B-Form copy\nStudent ID card copy\nAcademic transcript\nIncome proof\nGuardian CNIC\nPhotographs if requested\nDonor-required declarations\nAny SFAO checklist documents", applicationFormUrl: "/resources/scholarships/usaid-scholarship-form.txt", applyLink: "/resources/scholarships/usaid-scholarship-form.txt" },
  { id: 3, type: "Research Job", title: "RA: Applied AI for Energy Systems", audience: ["postgraduate"], status: "Open", meta: "Research assistantship", body: "Support data preparation, model training, and evaluation for energy system optimization research.", applyLink: "https://oric.muet.edu.pk/apply/ra-energy-ai" },
  { id: 4, type: "Research Grant", title: "Applied AI for Energy Systems", audience: ["postgraduate", "faculty"], status: "Open", meta: "PKR 2.5M seed support", formId: "research-grant-form", body: "Proposal call for applied AI models in energy monitoring and optimization.", applyLink: "https://oric.muet.edu.pk/apply/grant-energy-ai" },
  { id: 5, type: "Conference", title: "International Research Mobility Support", audience: ["postgraduate", "faculty"], status: "Open", meta: "Travel grant available", body: "Support for accepted papers at indexed international conferences.", applyLink: "https://oric.muet.edu.pk/apply/research-mobility" },
  { id: 6, type: "Resource", title: "ORIC Proposal Template", audience: ["undergraduate", "postgraduate", "faculty", "startup"], status: "Available", meta: "DOCX template", body: "Standard template for ORIC submissions and project proposals.", applyLink: "#" },
  { id: 31, type: "Resource", title: "FYP Thesis Guidelines", audience: ["undergraduate"], status: "Available", meta: "Guideline file", body: "Formatting, chapter structure, submission requirements, and evaluation guidance for FYP thesis writing.", applyLink: "/resources/fyp-thesis-guidelines.txt" },
  { id: 32, type: "Resource", title: "Research Methodology Guidelines", audience: ["undergraduate"], status: "Available", meta: "Guideline file", body: "Research planning, methods selection, sampling, analysis, and reporting guidance for student projects.", applyLink: "/resources/research-methodology-guidelines.txt" },
  { id: 33, type: "Resource", title: "Pitch Deck Templates", audience: ["undergraduate"], status: "Available", meta: "Template file", body: "Slide templates for startup, FYP commercialization, and innovation pitch presentations.", applyLink: "/resources/pitch-deck-templates.txt" },
  { id: 34, type: "Resource", title: "Business Model Templates", audience: ["undergraduate"], status: "Available", meta: "Template file", body: "Business model canvas and commercialization planning templates for student teams.", applyLink: "/resources/business-model-templates.txt" },
  { id: 35, type: "Resource", title: "Survey Design Guidelines & Templates", audience: ["undergraduate"], status: "Available", meta: "Guideline and template file", body: "Questionnaire design guidance, consent text, and reusable survey templates.", applyLink: "/resources/survey-design-guidelines-templates.txt" },
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
  { id: "st-demo", kind: "Startup", title: "SindhuGPT", owner: "Ghulam Hussain", ownerEmail: "23sw050@students.muet.edu.pk", department: "Software Engineering", summary: "A regional AI assistant for Sindhi knowledge access, education, and university services.", status: "Approved", needs: "Cloud credits, pilot customers, and investor introductions", image: PLACEHOLDER_IMAGES.startup },
];

export const SAMPLE_RESEARCH_PROFILES = [
  { id: 1, name: "Dr. Farah Naz", gender: "female", department: "Electrical Engineering", interests: "Smart grids, renewable energy, optimization", orcid: "0000-0002-1289-4312", scholar: "https://scholar.google.com", bio: "Researcher focused on resilient energy systems and industry collaboration." },
  { id: 2, name: "Dr. Umar Farooq", gender: "male", department: "Software Engineering", interests: "Machine learning, data platforms, civic technology", orcid: "0000-0001-7821-1150", scholar: "https://scholar.google.com", bio: "Works on applied ML and digital systems for public-sector research problems." },
  { id: 3, name: "Prof. Nadia Baloch", gender: "female", department: "Telecommunication Engineering", interests: "Wireless networks, IoT, edge computing", orcid: "0000-0003-3367-8821", scholar: "https://scholar.google.com", bio: "Leads IoT-enabled research projects with agriculture and industry partners." },
];

