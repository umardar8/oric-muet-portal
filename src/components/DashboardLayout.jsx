import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronLeft, LogOut, Menu, Search, Settings } from "lucide-react";
import logo from "../assets/oric-logo.webp";
import { useAuth } from "../context/AuthContext";
import { PORTAL_CONFIG, PORTAL_TYPES } from "../portal/portalConfig";
import {
  getAdminNotifications,
  getForms,
  getListings,
  getPagedUsers,
  getPortalFeatures,
  getPosts,
  getResearchProfiles,
  getSubmissions,
  hydratePortalStorage,
  persistPortalSnapshot,
} from "../portal/portalStorage";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [storageVersion, setStorageVersion] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const config = PORTAL_CONFIG[user?.portalType];

  const navItems = useMemo(() => {
    if (!user?.portalType) return [];
    return [
      { key: "dashboard", label: "Dashboard", to: "/dashboard", icon: config.stats[0]?.icon, end: true },
      ...getPortalFeatures(user.portalType).map((feature) => ({
        key: feature.key,
        label: feature.label,
        to: `/dashboard/${feature.key}`,
        icon: feature.icon,
        enabled: feature.enabled,
      })),
    ];
  }, [config, user?.portalType, storageVersion]);

  useEffect(() => {
    let active = true;
    hydratePortalStorage().then(() => {
      persistPortalSnapshot();
      if (active) setStorageVersion((value) => value + 1);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setSearchOpen(false);
  }, [location.pathname]);

  const groupedNotifications = useMemo(() => groupNotifications(getAdminNotifications()), [storageVersion]);
  const searchResults = useMemo(
    () => buildSearchResults(searchQuery, user, navItems),
    [searchQuery, user, navItems, storageVersion],
  );

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function openSearchResult(result) {
    setSearchQuery("");
    setSearchOpen(false);
    navigate(result.to);
  }

  if (!user || !config) {
    return (
      <div className="portal-auth-required">
        <div>
          <h1>Portal access required</h1>
          <p>Please sign in with your MUET email or assigned portal credentials.</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`portal-layout ${collapsed ? "portal-layout--collapsed" : ""}`}>
      {mobileOpen && <button className="portal-overlay" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}

      <aside className={`portal-sidebar ${mobileOpen ? "portal-sidebar--open" : ""}`}>
        <div className="portal-sidebar__brand">
          <img src={logo} alt="ORIC MUET" />
          {!collapsed && (
            <div>
              <strong>ORIC Portal</strong>
              <span>MUET Jamshoro</span>
            </div>
          )}
          <button onClick={() => setCollapsed((value) => !value)} className="portal-sidebar__collapse">
            {collapsed ? <Menu size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        <div className="portal-sidebar__divider" aria-hidden="true" />

        <nav className="portal-sidebar__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.end}
                title={collapsed ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `portal-navlink ${isActive ? "portal-navlink--active" : ""}`}
              >
                {Icon && <Icon size={18} />}
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.enabled === false && <small>Soon</small>}
              </NavLink>
            );
          })}
        </nav>

        <div className="portal-sidebar__footer">
          <div className="portal-sidebar__user">
            <div className="portal-avatar">{user.avatar}</div>
            {!collapsed && (
              <div className="portal-sidebar__user-copy">
                <strong>{getSidebarName(user)}</strong>
                <span>{getSidebarMeta(user, config)}</span>
              </div>
            )}
            <button
              className="portal-profile-settings"
              title="Settings"
              aria-label="Open settings"
              onClick={() => {
                setMobileOpen(false);
                navigate("/dashboard/settings");
              }}
            >
              <Settings size={17} />
            </button>
          </div>

          <button className="portal-signout" onClick={handleLogout}>
            <LogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <button className="portal-mobile-menu" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="portal-breadcrumb">
            <span>ORIC</span>
            <span>/</span>
            <strong>{resolveTitle(location.pathname, navItems)}</strong>
          </div>
          <div className="portal-topbar__actions">
            <div className="portal-search">
              <Search size={16} />
              <input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                  if (event.key === "Enter" && searchResults[0]) {
                    event.preventDefault();
                    openSearchResult(searchResults[0]);
                  }
                }}
                placeholder="Search portal..."
              />
              {searchOpen && searchQuery.trim() && (
                <div className="portal-search-results">
                  {searchResults.length === 0 && <p className="portal-empty">No results found.</p>}
                  {searchResults.map((result) => (
                    <button key={`${result.type}-${result.id}`} onMouseDown={(event) => event.preventDefault()} onClick={() => openSearchResult(result)}>
                      <span>
                        <strong>{result.title}</strong>
                        <small>{result.type} - {result.meta}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="portal-icon-btn" title="Notifications" onClick={() => setNotificationsOpen((value) => !value)}>
              <Bell size={18} />
              {groupedNotifications.total > 0 && <span>{groupedNotifications.total}</span>}
            </button>
            {notificationsOpen && (
              <div className="portal-notification-popover">
                <div className="portal-notification-popover__header">
                  <strong>Notifications</strong>
                  <small>{groupedNotifications.groups.length} groups</small>
                </div>
                {groupedNotifications.groups.length === 0 && <p className="portal-empty">No notifications yet.</p>}
                {groupedNotifications.groups.map((group) => (
                  <div className="portal-notification-group" key={group.type}>
                    <button onClick={() => setOpenGroup(openGroup === group.type ? null : group.type)}>
                      <span>
                        <strong>{group.latest.title}</strong>
                        <small>{group.count} {group.count === 1 ? "item" : "items"} - latest from {group.latest.actorName || group.latest.portalType || "portal"}</small>
                      </span>
                      <b>{openGroup === group.type ? "Hide" : "View"}</b>
                    </button>
                    {openGroup === group.type && (
                      <div className="portal-notification-items">
                        {group.items.map((note) => (
                          <article key={note.id}>
                            <strong>{note.title}</strong>
                            <p>{note.body}</p>
                            <small>{new Date(note.createdAt).toLocaleString()}</small>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function resolveTitle(pathname, navItems) {
  const match = navItems.find((item) => item.to === pathname);
  if (pathname === "/dashboard/settings") return "Settings";
  return match?.label || "Dashboard";
}

function groupNotifications(notifications) {
  const byType = notifications.reduce((groups, notification) => {
    const type = notification.type || "activity";
    groups[type] = groups[type] || [];
    groups[type].push(notification);
    return groups;
  }, {});

  const groups = Object.entries(byType).map(([type, items]) => ({
    type,
    items,
    count: items.length,
    latest: items[0],
  }));

  return { total: notifications.length, groups };
}

function getSidebarName(user) {
  if (user.portalType === "admin") return "Admin";
  return user.name;
}

function getSidebarMeta(user, config) {
  if (user.portalType === "industry") return user.companyName || "Industry Partner";
  if (user.portalType === "startup") return user.startupName || "Startup Incubatee";
  return `${config.badge} - ${user.department || "ORIC"}`;
}

function buildSearchResults(query, user, navItems) {
  const needle = query.trim().toLowerCase();
  if (!needle || !user) return [];

  const results = [];
  const addResult = (result) => {
    const haystack = [result.title, result.type, result.meta, result.body].join(" ").toLowerCase();
    if (haystack.includes(needle)) results.push(result);
  };

  navItems.forEach((item) => {
    if (item.enabled === false) return;
    addResult({
      id: item.key,
      title: item.label,
      type: "Section",
      meta: item.to === "/dashboard" ? "Portal overview" : "Dashboard module",
      body: item.label,
      to: item.to,
    });
  });

  getPosts()
    .filter((post) => user.portalType === PORTAL_TYPES.ADMIN || post.audience?.includes(user.portalType))
    .forEach((post) => {
      addResult({
        id: `post-${post.id}`,
        title: post.title,
        type: post.type || "Post",
        meta: post.meta || post.status || "Published item",
        body: [post.body, post.deadline, post.details, post.documentsRequired].join(" "),
        to: user.portalType === PORTAL_TYPES.ADMIN ? "/dashboard/publish" : getPostSearchTarget(post),
      });
    });

  getListings().forEach((listing) => {
    if (user.portalType !== PORTAL_TYPES.ADMIN && user.portalType !== PORTAL_TYPES.INDUSTRY && user.portalType !== PORTAL_TYPES.STARTUP) return;
    addResult({
      id: `listing-${listing.id}`,
      title: listing.title,
      type: listing.kind || "Listing",
      meta: listing.department || listing.status || "Portal listing",
      body: [listing.summary, listing.owner, listing.needs].join(" "),
      to: user.portalType === PORTAL_TYPES.INDUSTRY ? "/dashboard/browse-listings" : "/dashboard/startup-review",
    });
  });

  getResearchProfiles().forEach((profile) => {
    if (![PORTAL_TYPES.ADMIN, PORTAL_TYPES.FACULTY, PORTAL_TYPES.INDUSTRY].includes(user.portalType)) return;
    addResult({
      id: `profile-${profile.id}`,
      title: profile.name,
      type: "Research Profile",
      meta: profile.department || "Research network",
      body: [profile.bio, profile.interests, profile.orcid].join(" "),
      to: user.portalType === PORTAL_TYPES.INDUSTRY ? "/dashboard/browse-research" : "/dashboard/collaboration-network",
    });
  });

  getSubmissions()
    .filter((submission) => user.portalType === PORTAL_TYPES.ADMIN || submission.actorId === user.id)
    .forEach((submission) => {
      addResult({
        id: `submission-${submission.id}`,
        title: submission.title,
        type: "Submission",
        meta: submission.status || submission.portalType || "Portal activity",
        body: [submission.summary, submission.details, submission.actorName].join(" "),
        to: user.portalType === PORTAL_TYPES.ADMIN ? "/dashboard/approve-grants" : "/dashboard",
      });
    });

  if (user.portalType === PORTAL_TYPES.ADMIN) {
    getForms().forEach((form) => {
      addResult({
        id: `form-${form.id}`,
        title: form.name,
        type: "Form",
        meta: `${form.fields?.length || 0} fields`,
        body: [form.description, ...(form.fields || []).map((field) => field.label)].join(" "),
        to: "/dashboard/forms-admin",
      });
    });

    getPagedUsers(1, needle).users.forEach((portalUser) => {
      addResult({
        id: `user-${portalUser.id}`,
        title: portalUser.name,
        type: "User",
        meta: portalUser.portalType || portalUser.email || "Portal account",
        body: [portalUser.email, portalUser.username, portalUser.department, portalUser.status].join(" "),
        to: "/dashboard/users",
      });
    });
  }

  return results.slice(0, 8);
}

function getPostSearchTarget(post) {
  if (post.type === "Scholarship") return "/dashboard/scholarships";
  if (["Internship", "Workshop", "Bootcamp", "Industrial Visit", "Other Opportunity"].includes(post.type)) return "/dashboard/internships";
  if (["Competition", "Talk", "Job Fair", "Academic Event", "Entertainment", "Other Event"].includes(post.type)) return "/dashboard/activities";
  if (post.type === "Resource") return "/dashboard/resources";
  if (post.type === "Research Job") return "/dashboard/research-projects";
  if (post.type === "Research Grant") return "/dashboard/research-grants";
  if (post.type === "Conference") return "/dashboard/conferences";
  return "/dashboard";
}
