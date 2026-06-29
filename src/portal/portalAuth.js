import { DEFAULT_CREDENTIALS, DEPARTMENT_CODES, PORTAL_TYPES } from "./portalConfig";

const USERS_KEY = "oricPortalUsers";
const SESSION_KEY = "oricPortalSession";
const NOTIFICATIONS_KEY = "oricPortalNotifications";

export function getInitials(name = "ORIC User") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function inferDepartmentFromEmail(email = "") {
  const local = email.split("@")[0] || "";
  const normalized = local.toUpperCase();
  const codes = Object.keys(DEPARTMENT_CODES).sort((a, b) => b.length - a.length);
  const matched = codes.find((code) => normalized.endsWith(code));
  return matched ? DEPARTMENT_CODES[matched] : "";
}

export function inferPortalTypeFromEmail(email = "") {
  const normalized = email.trim().toLowerCase();
  const local = normalized.split("@")[0] || "";

  if (normalized.endsWith("@students.muet.edu.pk")) {
    return local.includes("phd") || local.includes("me")
      ? PORTAL_TYPES.POSTGRADUATE
      : PORTAL_TYPES.UNDERGRADUATE;
  }

  if (normalized.endsWith("@faculty.muet.edu.pk")) {
    return PORTAL_TYPES.FACULTY;
  }

  if (normalized.endsWith("@admin.muet.edu.pk")) {
    return PORTAL_TYPES.FACULTY;
  }

  return null;
}

export function isOfficialUniversityEmail(email = "") {
  return Boolean(inferPortalTypeFromEmail(email));
}

export function readUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function writeSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", "oric-portal-demo-token");
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

export function addNotification(notification) {
  const existing = readNotifications();
  const next = [
    {
      id: crypto?.randomUUID?.() || String(Date.now()),
      createdAt: new Date().toISOString(),
      read: false,
      ...notification,
    },
    ...existing,
  ];
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
}

export function readNotifications() {
  try {
    const stored = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function buildUserFromSignup(data) {
  const portalType = inferPortalTypeFromEmail(data.email);
  const department = data.department || inferDepartmentFromEmail(data.email);

  return {
    id: crypto?.randomUUID?.() || String(Date.now()),
    fullName: data.fullName.trim(),
    name: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    username: data.email.trim().toLowerCase(),
    password: data.password,
    department,
    phone: data.phone || "",
    rollNumber: data.rollNumber || "",
    employeeId: data.employeeId || "",
    designation: data.designation || "",
    portalType,
    role: portalType,
    status: "active",
    avatar: getInitials(data.fullName),
    createdAt: new Date().toISOString(),
  };
}

export function loginWithCredentials(identifier, password) {
  const normalized = identifier.trim().toLowerCase();

  if (normalized === DEFAULT_CREDENTIALS.undergraduate.username && password === DEFAULT_CREDENTIALS.undergraduate.password) {
    return {
      success: true,
      user: {
        id: "default-undergraduate",
        name: "Sarfaraz Ahmed",
        email: DEFAULT_CREDENTIALS.undergraduate.username,
        username: DEFAULT_CREDENTIALS.undergraduate.username,
        department: "Software Engineering",
        designation: "Undergraduate Student",
        rollNumber: "23SW",
        portalType: PORTAL_TYPES.UNDERGRADUATE,
        role: PORTAL_TYPES.UNDERGRADUATE,
        avatar: "SA",
        status: "active",
      },
    };
  }

  if (normalized === DEFAULT_CREDENTIALS.postgraduate.username.toLowerCase() && password === DEFAULT_CREDENTIALS.postgraduate.password) {
    return {
      success: true,
      user: {
        id: "default-postgraduate",
        name: "Aqib Ali",
        email: DEFAULT_CREDENTIALS.postgraduate.username,
        username: DEFAULT_CREDENTIALS.postgraduate.username,
        department: "Software Engineering",
        designation: "Postgraduate Student",
        rollNumber: "23MESW",
        portalType: PORTAL_TYPES.POSTGRADUATE,
        role: PORTAL_TYPES.POSTGRADUATE,
        avatar: "AA",
        status: "active",
      },
    };
  }

  if (normalized === DEFAULT_CREDENTIALS.faculty.username && password === DEFAULT_CREDENTIALS.faculty.password) {
    return {
      success: true,
      user: {
        id: "default-faculty",
        name: "Umar Farooq",
        email: DEFAULT_CREDENTIALS.faculty.username,
        username: DEFAULT_CREDENTIALS.faculty.username,
        department: "Software Engineering",
        designation: "Lecturer",
        employeeId: "MUET-SE-001",
        portalType: PORTAL_TYPES.FACULTY,
        role: PORTAL_TYPES.FACULTY,
        avatar: "UF",
        status: "active",
      },
    };
  }

  if (normalized === DEFAULT_CREDENTIALS.admin.username && password === DEFAULT_CREDENTIALS.admin.password) {
    return {
      success: true,
      user: {
        id: "default-admin",
        name: "Admin",
        username: DEFAULT_CREDENTIALS.admin.username,
        email: "admin@admin.muet.edu.pk",
        department: "ORIC Administration",
        designation: "Portal Administrator",
        portalType: PORTAL_TYPES.ADMIN,
        role: PORTAL_TYPES.ADMIN,
        avatar: "OA",
        status: "active",
      },
    };
  }

  if (normalized === DEFAULT_CREDENTIALS.industry.username && password === DEFAULT_CREDENTIALS.industry.password) {
    return {
      success: true,
      user: {
        id: "default-industry",
        name: "Sualeh Asif",
        companyName: "CursorAI",
        username: DEFAULT_CREDENTIALS.industry.username,
        department: "External Partner",
        designation: "Industry Partner",
        portalType: PORTAL_TYPES.INDUSTRY,
        role: PORTAL_TYPES.INDUSTRY,
        avatar: "SA",
        status: "active",
      },
    };
  }

  if (normalized === DEFAULT_CREDENTIALS.startup.username && password === DEFAULT_CREDENTIALS.startup.password) {
    return {
      success: true,
      user: {
        id: "default-startup",
        name: "Ghulam Hussain",
        startupName: "SindhuGPT",
        username: DEFAULT_CREDENTIALS.startup.username,
        department: "ORIC Approved Startup",
        designation: "Startup Founder",
        portalType: PORTAL_TYPES.STARTUP,
        role: PORTAL_TYPES.STARTUP,
        avatar: "GH",
        status: "active",
      },
    };
  }

  const user = readUsers().find((item) => {
    const email = item.email?.toLowerCase();
    const username = item.username?.toLowerCase();
    return (email === normalized || username === normalized) && item.password === password;
  });

  if (!user) {
    return { success: false, error: "Invalid credentials. Please check your username/email and password." };
  }

  if (user.status === "suspended") {
    return { success: false, error: "This account is suspended. Please contact ORIC administration." };
  }

  return { success: true, user };
}

export function registerUniversityUser(data) {
  if (!isOfficialUniversityEmail(data.email)) {
    return {
      success: false,
      error: "Use an official @students.muet.edu.pk, @faculty.muet.edu.pk, or @admin.muet.edu.pk email.",
    };
  }

  const users = readUsers();
  const exists = users.some((user) => user.email?.toLowerCase() === data.email.trim().toLowerCase());

  if (exists) {
    return { success: false, error: "An account with this email already exists." };
  }

  const user = buildUserFromSignup(data);
  const nextUsers = [...users, user];
  writeUsers(nextUsers);
  addNotification({
    type: "account-created",
    title: "New portal account created",
    body: `${user.name} joined as ${user.portalType}.`,
    portalType: user.portalType,
    actorName: user.name,
  });

  return { success: true, user };
}
