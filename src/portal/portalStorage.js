import { PORTAL_CONFIG, PORTAL_TYPES, SAMPLE_LISTINGS, SAMPLE_POSTS, SAMPLE_RESEARCH_PROFILES } from "./portalConfig";
import { addNotification, readNotifications, readUsers, writeUsers } from "./portalAuth";

const SUBMISSIONS_KEY = "oricPortalSubmissions";
const FEATURE_FLAGS_KEY = "oricPortalFeatureFlags";
const POSTS_KEY = "oricPortalPosts";
const LISTINGS_KEY = "oricPortalListings";
const PROFILES_KEY = "oricPortalResearchProfiles";

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
}

export function getFeatureFlags() {
  return readJson(FEATURE_FLAGS_KEY, {
    "startup-seed": false,
    "ip-registration": false,
    "project-monitoring": false,
    mentorship: false,
  });
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
  if (posts) return posts;
  writeJson(POSTS_KEY, SAMPLE_POSTS);
  return SAMPLE_POSTS;
}

export function savePost(post) {
  const posts = getPosts();
  const next = [{ id: Date.now(), status: "Open", ...post }, ...posts];
  writeJson(POSTS_KEY, next);
  addNotification({
    type: "post-published",
    title: "New item published",
    body: `${post.title} was published for ${post.audience.join(", ")}.`,
    portalType: PORTAL_TYPES.ADMIN,
  });
  return next;
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
  return readJson(SUBMISSIONS_KEY, []);
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
