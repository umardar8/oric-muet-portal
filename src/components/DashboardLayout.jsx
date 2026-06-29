import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronLeft, LogOut, Menu, Search, Settings } from "lucide-react";
import logo from "../assets/oric-logo.webp";
import { useAuth } from "../context/AuthContext";
import { PORTAL_CONFIG } from "../portal/portalConfig";
import { getAdminNotifications, getPortalFeatures } from "../portal/portalStorage";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
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
  }, [config, user?.portalType]);

  const groupedNotifications = useMemo(() => groupNotifications(getAdminNotifications()), []);

  function handleLogout() {
    logout();
    navigate("/login");
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

        <div className="portal-sidebar__user">
          <div className="portal-avatar">{user.avatar}</div>
          {!collapsed && (
            <div>
              <strong>{getSidebarName(user)}</strong>
              <span>{getSidebarMeta(user, config)}</span>
            </div>
          )}
        </div>

        <nav className="portal-sidebar__nav">
          <span className="portal-sidebar__section">Overview</span>
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

        <button className="portal-signout portal-settings-link" onClick={() => navigate("/dashboard/settings")}>
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </button>

        <button className="portal-signout" onClick={handleLogout}>
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
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
              <input placeholder="Search portal..." />
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
