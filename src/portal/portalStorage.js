import { PORTAL_CONFIG, PORTAL_TYPES, SAMPLE_FORMS, SAMPLE_LISTINGS, SAMPLE_POSTS, SAMPLE_RESEARCH_PROFILES } from "./portalConfig";
import { addNotification, readNotifications, readUsers, writeUsers } from "./portalAuth";
import { apiGetPortalState, apiSavePortalState } from "./apiClient";

const SUBMISSIONS_KEY = "oricPortalSubmissions";
const FEATURE_FLAGS_KEY = "oricPortalFeatureFlags";
const POSTS_KEY = "oricPortalPosts";
const LISTINGS_KEY = "oricPortalListings";
const PROFILES_KEY = "oricPortalResearchProfiles";
const FORMS_KEY = "oricPortalForms";
const ANALYTICS_KEY = "oricPortalAnalyticsOverrides";
const FEEDBACK_FORM_ASSIGNMENTS_KEY = "oricPortalFeedbackFormAssignments";
const PERSISTED_KEYS = [
  SUBMISSIONS_KEY,
  FEATURE_FLAGS_KEY,
  POSTS_KEY,
  LISTINGS_KEY,
  PROFILES_KEY,
  FORMS_KEY,
  ANALYTICS_KEY,
  FEEDBACK_FORM_ASSIGNMENTS_KEY,
  "oricPortalUsers",
  "oricPortalNotifications",
];

export function readJson(key, fallback) {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    return stored ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  persistJson(key, value);
}

function persistJson(key, value) {
  apiSavePortalState(key, value).catch(() => {
    // Offline/local development keeps using localStorage; the next write will retry MySQL.
  });
}

export async function hydratePortalStorage() {
  try {
    const { state } = await apiGetPortalState();
    if (!state || typeof state !== "object") return false;
    PERSISTED_KEYS.forEach((key) => {
      if (state[key] !== undefined && state[key] !== null) {
        localStorage.setItem(key, JSON.stringify(state[key]));
      }
    });
    return true;
  } catch {
    return false;
  }
}

export function persistPortalSnapshot() {
  PERSISTED_KEYS.forEach((key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value !== null && value !== undefined) persistJson(key, value);
    } catch {
      // Ignore invalid cached data.
    }
  });
}

export function getFeatureFlags() {
  const flags = readJson(FEATURE_FLAGS_KEY, {
    "startup-seed": false,
    "ip-registration": false,
    "project-monitoring": false,
    mentorship: false,
  });
  persistJson(FEATURE_FLAGS_KEY, flags);
  return flags;
}

export function setFeatureFlag(key, enabled) {
  const flags = getFeatureFlags();
  const next = { ...flags, [key]: enabled };
  writeJson(FEATURE_FLAGS_KEY, next);
  addNotification({
    type: "feature-flag",
    title: enabled ? "Feature enabled" : "Feature disabled",
    body: `${key} was ${enabled ? "enabled" : "disabled"} by admin.`,
    portalType: PORTAL_TYPES.ADMIN,
  });
  return next;
}

export function getPortalFeatures(portalType) {
  const config = PORTAL_CONFIG[portalType];
  const flags = getFeatureFlags();
  return (config?.features || []).map((feature) => ({
    ...feature,
    enabled: flags[feature.key] ?? feature.enabled,
  }));
}

export function getPosts() {
  const posts = readJson(POSTS_KEY, null);
  if (posts) {
    const retiredSampleTitles = [
      "Innovation Scholarship Call",
      "Interdepartmental Innovation Challenge",
      "Founder Talk: From FYP to Startup",
      "MUET Tech Job Fair",
      "Undergraduate Research Poster Day",
      "Innovation Social Evening",
    ];
    const currentPosts = posts.filter((post) => !retiredSampleTitles.includes(post.title));
    const updatedPosts = currentPosts.map((post) => {
      const sample = SAMPLE_POSTS.find((item) => item.title === post.title);
      return sample ? { ...sample, ...post, formId: post.formId || sample.formId } : post;
    });
    const merged = [
      ...updatedPosts,
      ...SAMPLE_POSTS.filter((sample) => !currentPosts.some((post) => post.title === sample.title)),
    ];
    if (JSON.stringify(merged) !== JSON.stringify(posts)) writeJson(POSTS_KEY, merged);
    return merged;
  }
  writeJson(POSTS_KEY, SAMPLE_POSTS);
  return SAMPLE_POSTS;
}

export function savePost(post) {
  const posts = getPosts();
  const existingId = post.id;
  const normalized = { id: existingId || Date.now(), status: "Open", interestedCount: 0, interestedUserIds: [], ...post };
  const next = existingId
    ? posts.map((item) => String(item.id) === String(existingId) ? { ...item, ...normalized } : item)
    : [normalized, ...posts];
  writeJson(POSTS_KEY, next);
  addNotification({
    type: "post-published",
    title: existingId ? "Item updated" : "New item published",
    body: `${post.title} was ${existingId ? "updated" : "published"} for ${post.audience.join(", ")}.`,
    portalType: PORTAL_TYPES.ADMIN,
  });
  return next;
}

export function markPostInterested(postId, userId) {
  const posts = getPosts();
  let updatedPost = null;
  const next = posts.map((post) => {
    if (String(post.id) !== String(postId)) return post;
    const interestedUserIds = post.interestedUserIds || [];
    if (interestedUserIds.includes(userId)) {
      updatedPost = post;
      return post;
    }
    updatedPost = {
      ...post,
      interestedUserIds: [...interestedUserIds, userId],
      interestedCount: Number(post.interestedCount || 0) + 1,
    };
    return updatedPost;
  });
  writeJson(POSTS_KEY, next);
  if (updatedPost) {
    addNotification({
      type: "event-interest",
      title: "Event interest recorded",
      body: `${updatedPost.title} now has ${updatedPost.interestedCount || 0} interested students.`,
      portalType: PORTAL_TYPES.ADMIN,
    });
  }
  return next;
}

export function getForms() {
  const forms = readJson(FORMS_KEY, null);
  if (forms) {
    const updatedForms = forms.map((form) => {
      const sample = SAMPLE_FORMS.find((item) => item.id === form.id);
      return sample ? { ...sample, ...form, fields: form.fields?.length ? form.fields : sample.fields } : form;
    });
    const merged = [
      ...updatedForms,
      ...SAMPLE_FORMS.filter((sample) => !forms.some((form) => form.id === sample.id)),
    ];
    if (JSON.stringify(merged) !== JSON.stringify(forms)) writeJson(FORMS_KEY, merged);
    return merged;
  }
  writeJson(FORMS_KEY, SAMPLE_FORMS);
  return SAMPLE_FORMS;
}

export function saveForm(form) {
  const forms = getForms();
  const id = form.id || `form-${Date.now()}`;
  const next = [{ ...form, id, updatedAt: new Date().toISOString() }, ...forms.filter((item) => item.id !== id)];
  writeJson(FORMS_KEY, next);
  addNotification({
    type: "form-saved",
    title: "Form saved",
    body: `${form.name} is available for published posts.`,
    portalType: PORTAL_TYPES.ADMIN,
  });
  return next;
}

export function getFeedbackFormAssignments() {
  const assignments = readJson(FEEDBACK_FORM_ASSIGNMENTS_KEY, null);
  const defaults = {
    [PORTAL_TYPES.UNDERGRADUATE]: "feedback-form",
    [PORTAL_TYPES.POSTGRADUATE]: "feedback-form",
    [PORTAL_TYPES.FACULTY]: "feedback-form",
    [PORTAL_TYPES.INDUSTRY]: "feedback-form",
    [PORTAL_TYPES.STARTUP]: "feedback-form",
  };
  const next = { ...defaults, ...(assignments || {}) };
  if (JSON.stringify(next) !== JSON.stringify(assignments)) writeJson(FEEDBACK_FORM_ASSIGNMENTS_KEY, next);
  return next;
}

export function saveFeedbackFormAssignments(assignments) {
  const next = { ...getFeedbackFormAssignments(), ...assignments };
  writeJson(FEEDBACK_FORM_ASSIGNMENTS_KEY, next);
  addNotification({
    type: "feedback-form",
    title: "Feedback form assignment updated",
    body: "Portal feedback form assignments were updated by admin.",
    portalType: PORTAL_TYPES.ADMIN,
  });
  return next;
}

export function getAnalyticsOverrides() {
  const overrides = readJson(ANALYTICS_KEY, {});
  persistJson(ANALYTICS_KEY, overrides);
  return overrides;
}

export function saveAnalyticsOverrides(overrides) {
  writeJson(ANALYTICS_KEY, overrides);
  addNotification({
    type: "analytics-saved",
    title: "Analytics updated",
    body: "Admin KPI display values were saved.",
    portalType: PORTAL_TYPES.ADMIN,
  });
  return overrides;
}

export function getListings() {
  const listings = readJson(LISTINGS_KEY, null);
  if (listings) return listings;
  writeJson(LISTINGS_KEY, SAMPLE_LISTINGS);
  return SAMPLE_LISTINGS;
}

export function saveListing(listing) {
  const listings = getListings();
  const next = [{ id: Date.now(), status: "Pending", ...listing }, ...listings];
  writeJson(LISTINGS_KEY, next);
  return next;
}

export function updateListingImage(listingId, image) {
  const listings = getListings();
  const next = listings.map((listing) =>
    String(listing.id) === String(listingId) ? { ...listing, image } : listing,
  );
  writeJson(LISTINGS_KEY, next);
  addNotification({
    type: "listing-image",
    title: "Listing image updated",
    body: `Listing #${listingId} image was updated.`,
    portalType: PORTAL_TYPES.STARTUP,
  });
  return next;
}

export function getResearchProfiles() {
  const profiles = readJson(PROFILES_KEY, null);
  if (profiles) return profiles;
  writeJson(PROFILES_KEY, SAMPLE_RESEARCH_PROFILES);
  return SAMPLE_RESEARCH_PROFILES;
}

export function saveResearchProfile(profile) {
  const profiles = getResearchProfiles();
  const next = [{ id: Date.now(), ...profile }, ...profiles.filter((item) => item.email !== profile.email)];
  writeJson(PROFILES_KEY, next);
  addNotification({
    type: "research-profile",
    title: "Research profile updated",
    body: `${profile.name} updated a faculty research profile.`,
    actorName: profile.name,
    portalType: PORTAL_TYPES.FACULTY,
  });
  return next;
}

export function getSubmissions() {
  const submissions = readJson(SUBMISSIONS_KEY, []);
  persistJson(SUBMISSIONS_KEY, submissions);
  return submissions;
}

export function saveSubmission(submission) {
  const submissions = getSubmissions();
  const next = [
    {
      id: Date.now(),
      status: "Pending",
      createdAt: new Date().toISOString(),
      ...submission,
    },
    ...submissions,
  ];
  writeJson(SUBMISSIONS_KEY, next);
  addNotification({
    type: "submission",
    title: "New submission received",
    body: `${submission.actorName} submitted ${submission.title}.`,
    actorName: submission.actorName,
    portalType: submission.portalType,
  });
  return next;
}

export function updateSubmissionStatus(id, status, remarks = "") {
  const next = getSubmissions().map((submission) =>
    submission.id === id ? { ...submission, status, remarks, reviewedAt: new Date().toISOString() } : submission,
  );
  writeJson(SUBMISSIONS_KEY, next);
  addNotification({
    type: "submission-reviewed",
    title: `Submission ${status.toLowerCase()}`,
    body: `Submission #${id} was marked ${status}.`,
    portalType: PORTAL_TYPES.ADMIN,
  });
  return next;
}

export function getAdminNotifications() {
  return readNotifications();
}

export function getPagedUsers(page = 1, search = "") {
  const all = readUsers();
  const needle = search.toLowerCase();
  const filtered = all.filter((user) =>
    [user.name, user.email, user.username, user.portalType, user.department].some((value) =>
      String(value || "").toLowerCase().includes(needle),
    ),
  );
  const pageSize = 20;
  return {
    users: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    pages: Math.max(1, Math.ceil(filtered.length / pageSize)),
  };
}

export function updateUserStatus(userId, status) {
  const users = readUsers();
  const next = users.map((user) => (user.id === userId ? { ...user, status } : user));
  writeUsers(next);
  return next;
}
