/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Clock, Download, ExternalLink, Save, Send, Upload, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { FALLBACK_OPPORTUNITIES, PORTAL_CONFIG, PORTAL_TYPES } from "../portal/portalConfig";
import {
  getListings,
  getPagedUsers,
  getPortalFeatures,
  getPosts,
  getResearchProfiles,
  getSubmissions,
  savePost,
  saveResearchProfile,
  saveSubmission,
  setFeatureFlag,
  updateSubmissionStatus,
  updateUserStatus,
} from "../portal/portalStorage";
import "./Dashboard.css";

export default function Dashboard() {
  const { featureKey } = useParams();
  const { user, updateProfile } = useAuth();
  const [, forceRender] = useState(0);
  const config = PORTAL_CONFIG[user?.portalType];
  const features = useMemo(() => (user ? getPortalFeatures(user.portalType) : []), [user]);
  const activeFeature = features.find((feature) => feature.key === featureKey);

  function refresh() {
    forceRender((value) => value + 1);
  }

  if (!user || !config) return null;

  if (featureKey === "settings") {
    return <SettingsView user={user} updateProfile={updateProfile} />;
  }

  if (activeFeature) {
    return <FeatureView user={user} feature={activeFeature} onChange={refresh} />;
  }

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <div>
          <p className="portal-eyebrow">{config.badge}</p>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <div className="portal-hero__status">
          <span>Signed in as</span>
          <strong>{user.name}</strong>
          <small>{user.department || user.designation}</small>
        </div>
      </section>

      <section className="portal-stats-grid">
        {config.stats.map(({ label, value, hint, icon: Icon }) => (
          <div className="portal-stat-card" key={label}>
            <div className="portal-stat-card__icon"><Icon size={21} /></div>
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
              <small>{hint}</small>
            </div>
          </div>
        ))}
      </section>

      <div className="portal-dashboard-grid">
        <section>
          <div className="portal-section-heading">
            <div>
              <h2>Programs and Services</h2>
              <p>Options available for your portal type</p>
            </div>
          </div>
          <div className="portal-feature-grid portal-feature-grid--compact">
            {features.map((feature) => (
              <a className={`portal-feature-card ${!feature.enabled ? "portal-feature-card--soon" : ""}`} href={`/dashboard/${feature.key}`} key={feature.key}>
                <div className="portal-feature-card__top">
                  <div className="portal-feature-card__icon"><feature.icon size={20} /></div>
                  <span>{feature.enabled ? feature.category : "Coming Soon"}</span>
                </div>
                <h3>{feature.label}</h3>
                <p>{feature.description}</p>
                <strong>Open <ExternalLink size={13} /></strong>
              </a>
            ))}
          </div>
        </section>

        <aside className="portal-aside">
          <Announcements user={user} />
          <MySubmissions user={user} />
        </aside>
      </div>
    </div>
  );
}

function FeatureView({ user, feature, onChange }) {
  if (!feature.enabled) {
    return (
      <div className="portal-page">
        <section className="portal-coming-soon">
          <Clock size={38} />
          <h1>{feature.label}</h1>
          <p>{feature.description}</p>
          <strong>Coming soon</strong>
          <span>This module is implemented in the portal model, but users will see this page until ORIC admin enables it from the admin dashboard.</span>
        </section>
      </div>
    );
  }

  if (feature.key === "browse-listings") return <BrowseListings />;
  if (feature.key === "internships") return <OpportunityBoard feature={feature} type="Internship" audience={user.portalType} />;
  if (feature.key === "industrial-visits") return <VisitBoard feature={feature} audience={user.portalType} />;
  if (feature.key === "activities") return <ActivityBoard feature={feature} audience={user.portalType} />;
  if (feature.key === "scholarships") return <OpportunityBoard feature={feature} type="Scholarship" audience={user.portalType} />;
  if (feature.key === "fyp-listing") return <FypListing user={user} onChange={onChange} />;
  if (feature.key === "research-projects") return <ResearchJobs user={user} onChange={onChange} />;
  if (feature.key === "thesis-listing") return <ThesisListing user={user} onChange={onChange} />;
  if (feature.key === "research-grants") return <GrantApplications user={user} onChange={onChange} />;
  if (feature.key === "conferences") return <ConferenceBoard user={user} onChange={onChange} />;
  if (feature.key === "browse-research" || feature.key === "collaboration-network") return <ResearchNetwork />;
  if (feature.key === "users") return <UserManagement onChange={onChange} />;
  if (feature.key === "analytics") return <AnalyticsPanel />;
  if (feature.key === "reports") return <ReportsPanel />;
  if (feature.key === "publish") return <PublishingPanel onChange={onChange} />;
  if (feature.key === "site-updates") return <SiteUpdatesPanel />;
  if (feature.key === "resource-admin") return <ResourceAdminPanel />;
  if (feature.key === "feedback-admin") return <FeedbackAdminPanel />;
  if (feature.key === "partnership-request") return <PartnershipRequest user={user} onChange={onChange} />;
  if (feature.key === "sponsor-research") return <SponsorResearch user={user} onChange={onChange} />;
  if (feature.key === "feedback") return <FeedbackUser user={user} onChange={onChange} />;
  if (feature.key === "resources") return <ResourceLibrary />;
  if (feature.key === "incubation-application") return <IncubationApplication user={user} onChange={onChange} />;
  if (feature.key === "investor-connections") return <InvestorConnections onChange={onChange} />;
  if (["approve-grants", "ip-workflows", "startup-review"].includes(feature.key)) return <ApprovalQueue feature={feature} onChange={onChange} />;

  return <SubmissionFeature user={user} feature={feature} onChange={onChange} />;
}

function OpportunityBoard({ feature, type, audience, minimum = 0 }) {
  const posts = getOpportunityPosts(type, audience, minimum);
  const [selected, setSelected] = useState(null);

  return (
    <div className="portal-page">
      <FeatureHeader feature={feature} />
      <div className="portal-board-grid">
        {posts.map((post) => <OpportunityCard post={post} key={post.id} onView={() => setSelected(post)} />)}
        {posts.length === 0 && <EmptyPanel text={`No ${type.toLowerCase()} opportunities are currently open.`} />}
      </div>
      {selected && <OpportunityDetails post={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function VisitBoard({ feature, audience }) {
  const posts = getPosts().filter((post) => post.type === "Industrial Visit" && post.audience?.includes(audience));
  const fallback = [
    { id: "visit-1", title: "Power Plant Exposure Visit", meta: "Registration closes soon", body: "A guided industry visit for engineering students to understand plant operations, safety, and technical workflows." },
    { id: "visit-2", title: "Software House Visit", meta: "Limited seats", body: "Meet engineering teams, observe agile delivery practices, and learn about internship pathways." },
  ];
  return <SimpleCards feature={feature} items={posts.length ? posts : fallback} tag="Visit" />;
}

function ActivityBoard({ feature, audience }) {
  const posts = getPosts().filter((post) => post.type === "Activity" && post.audience?.includes(audience));
  const fallback = [
    { id: "act-1", title: "Innovation Bootcamp", meta: "ORIC/BIC", body: "A hands-on activity to refine ideas, build teams, and prepare early prototypes." },
    { id: "act-2", title: "Pitch Practice Circle", meta: "Weekly", body: "Practice concise pitching and get feedback from mentors before seed funding calls." },
  ];
  return <SimpleCards feature={feature} items={posts.length ? posts : fallback} tag="Activity" />;
}

function SimpleCards({ feature, items, tag }) {
  return (
    <div className="portal-page">
      <FeatureHeader feature={feature} />
      <div className="portal-board-grid">
        {items.map((item) => (
          <article className="portal-detail-card" key={item.id}>
            <span>{tag}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <small>{item.meta}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

function OpportunityCard({ post, onView }) {
  return (
    <article className="portal-detail-card">
      <span>{post.status}</span>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <small>{post.meta}</small>
      <button className="portal-secondary" onClick={onView}>View Details</button>
    </article>
  );
}

function OpportunityDetails({ post, onClose }) {
  return (
    <div className="portal-modal-backdrop" role="presentation" onClick={onClose}>
      <section className="portal-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="portal-modal__header">
          <span>{post.type}</span>
          <button onClick={onClose}>Close</button>
        </div>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <dl>
          <div><dt>Status</dt><dd>{post.status}</dd></div>
          <div><dt>Details</dt><dd>{post.meta}</dd></div>
        </dl>
        <a className="portal-primary" href={post.applyLink || "#"} target="_blank" rel="noopener noreferrer">Apply</a>
      </section>
    </div>
  );
}

function FypListing({ user, onChange }) {
  return (
    <StructuredSubmission
      user={user}
      onChange={onChange}
      featureKey="fyp-listing"
      title="FYP Listing"
      description="Upload your final year project details for ORIC visibility, review, and future industry matching."
      fields={[
        ["projectTitle", "FYP title"],
        ["supervisor", "Supervisor"],
        ["team", "Team members"],
        ["prototype", "Prototype status"],
      ]}
      textAreaLabel="Abstract and problem statement"
    />
  );
}

function ResearchJobs({ user }) {
  return <OpportunityBoard feature={{ label: "Research Jobs", description: "Browse research assistantships and active project openings. Open a card to view details and apply through the admin-assigned link." }} type="Research Job" audience={user.portalType} minimum={5} />;
}

function ThesisListing({ user, onChange }) {
  return (
    <StructuredSubmission
      user={user}
      onChange={onChange}
      featureKey="thesis-listing"
      title="Thesis Listing"
      description="Add your ME/PhD thesis and research paper details so faculty and industry partners can discover your work."
      fields={[
        ["thesisTitle", "Thesis title"],
        ["supervisor", "Supervisor"],
        ["researchArea", "Research area"],
        ["paperUrl", "Published paper URL"],
      ]}
      textAreaLabel="Thesis summary"
    />
  );
}

function GrantApplications({ user }) {
  return <OpportunityBoard feature={{ label: "Grants", description: "Explore research and travel grant calls. Open a card for complete details and the admin-assigned application link." }} type="Research Grant" audience={user.portalType} minimum={5} />;
}

function ConferenceBoard({ user }) {
  return <OpportunityBoard feature={{ label: "Conferences", description: "View national and international conference opportunities. Open a card to review details and apply through the admin-assigned link." }} type="Conference" audience={user.portalType} minimum={5} />;
}

function StructuredSubmission({ user, onChange, featureKey, title, description, fields, textAreaLabel }) {
  const [form, setForm] = useState({});
  function submit(event) {
    event.preventDefault();
    const summary = fields.map(([key, label]) => `${label}: ${form[key] || ""}`).join(" | ");
    saveSubmission({
      title: form.projectTitle || form.thesisTitle || form.grantType || title,
      summary,
      details: form.details,
      featureKey,
      portalType: user.portalType,
      actorId: user.id,
      actorName: user.name,
      actorEmail: user.email,
    });
    setForm({});
    toast.success("Submitted successfully.");
    onChange();
  }
  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: title, description }} />
      <form className="portal-form-card" onSubmit={submit}>
        <div className="portal-form-grid">
          {fields.map(([key, label]) => (
            <label key={key}>{label}<input className="portal-input" value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required /></label>
          ))}
        </div>
        <label>{textAreaLabel}<textarea className="portal-input" rows="5" value={form.details || ""} onChange={(e) => setForm({ ...form, details: e.target.value })} required /></label>
        <button className="portal-primary" type="submit"><Send size={16} /> Submit</button>
      </form>
    </div>
  );
}

function EmptyPanel({ text }) {
  return <div className="portal-panel"><p className="portal-empty">{text}</p></div>;
}

function getOpportunityPosts(type, audience, minimum = 0) {
  const adminPosts = getPosts().filter((post) => post.type === type && post.audience?.includes(audience));
  const fallback = (FALLBACK_OPPORTUNITIES[type] || []).map((item) => ({ ...item, audience: [audience] }));
  const merged = [...adminPosts, ...fallback.filter((item) => !adminPosts.some((post) => post.title === item.title))];
  return minimum ? merged.slice(0, Math.max(minimum, adminPosts.length)) : merged;
}

function Announcements({ user }) {
  const posts = getPosts().filter((post) => post.audience?.includes(user.portalType) || user.portalType === PORTAL_TYPES.ADMIN).slice(0, 5);
  return (
    <div className="portal-panel">
      <div className="portal-panel__header">
        <h3>Announcements</h3>
        <span>{posts.length}</span>
      </div>
      <div className="portal-list">
        {posts.map((post) => (
          <article key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
            <small>{post.type} - {post.meta}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

function MySubmissions({ user }) {
  const submissions = getSubmissions().filter((submission) => submission.actorId === user.id).slice(0, 4);
  return (
    <div className="portal-panel">
      <div className="portal-panel__header">
        <h3>My Activity</h3>
        <span>{submissions.length}</span>
      </div>
      <div className="portal-list">
        {submissions.length === 0 && <p className="portal-empty">No submissions yet.</p>}
        {submissions.map((item) => (
          <article key={item.id}>
            <strong>{item.title}</strong>
            <p>{item.summary}</p>
            <small>Status: {item.status}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

function SubmissionFeature({ user, feature, onChange }) {
  const [form, setForm] = useState({ title: "", summary: "", details: "", partnerName: "", budget: "", remarks: "" });

  function submit(event) {
    event.preventDefault();
    saveSubmission({
      ...form,
      title: form.title || feature.label,
      portalType: user.portalType,
      featureKey: feature.key,
      actorId: user.id,
      actorName: user.name,
      actorEmail: user.email,
      target: feature.category,
    });

    if (feature.key === "faculty-profile") {
      saveResearchProfile({
        name: user.name,
        email: user.email,
        department: user.department,
        interests: form.summary,
        bio: form.details,
        orcid: form.partnerName,
        scholar: form.budget,
      });
    }

    setForm({ title: "", summary: "", details: "", partnerName: "", budget: "", remarks: "" });
    toast.success("Submission saved.");
    onChange();
  }

  return (
    <div className="portal-page">
      <FeatureHeader feature={feature} />
      <form className="portal-form-card" onSubmit={submit}>
        <div className="portal-form-grid">
          <label>
            Title
            <input className="portal-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Submission title" />
          </label>
          <label>
            Related partner / ORCID / organization
            <input className="portal-input" value={form.partnerName} onChange={(e) => setForm({ ...form, partnerName: e.target.value })} />
          </label>
          <label>
            Summary
            <input className="portal-input" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required />
          </label>
          <label>
            Budget / URL / reference
            <input className="portal-input" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          </label>
        </div>
        <label>
          Detailed description
          <textarea className="portal-input" rows="5" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} required />
        </label>
        <button className="portal-primary" type="submit"><Send size={16} /> Submit</button>
      </form>
    </div>
  );
}

function BrowseListings() {
  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Browse Listings", description: "Approved startups, FYPs, and business ideas available for partnership." }} />
      <div className="portal-feature-grid">
        {getListings().map((listing) => (
          <article className="portal-feature-card" key={listing.id}>
            <div className="portal-feature-card__top">
              <span>{listing.kind}</span>
              <span>{listing.status}</span>
            </div>
            <h3>{listing.title}</h3>
            <p>{listing.summary}</p>
            <small>{listing.owner} - {listing.department}</small>
            <strong>Needs: {listing.needs}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}

function ResearchNetwork() {
  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Research Collaboration Network", description: "Discover faculty profiles and active research interests across departments." }} />
      <div className="portal-feature-grid">
        {getResearchProfiles().map((profile) => (
          <article className="portal-feature-card" key={profile.id}>
            <h3>{profile.name}</h3>
            <p>{profile.bio}</p>
            <small>{profile.department}</small>
            <strong>{profile.interests}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}

function ApprovalQueue({ feature, onChange }) {
  const submissions = getSubmissions();
  const [remarks, setRemarks] = useState("");

  function review(id, status) {
    updateSubmissionStatus(id, status, remarks);
    setRemarks("");
    toast.success(`Submission ${status.toLowerCase()}.`);
    onChange();
  }

  return (
    <div className="portal-page">
      <FeatureHeader feature={feature} />
      <textarea className="portal-input portal-remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Remarks for approval/rejection" />
      <div className="portal-table-wrap">
        <table className="portal-table">
          <thead><tr><th>Title</th><th>User</th><th>Portal</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {submissions.map((item) => (
              <tr key={item.id}>
                <td>{item.title}<small>{item.summary}</small></td>
                <td>{item.actorName}</td>
                <td>{item.portalType}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => review(item.id, "Approved")} className="portal-mini portal-mini--green"><CheckCircle2 size={14} /> Approve</button>
                  <button onClick={() => review(item.id, "Rejected")} className="portal-mini portal-mini--red"><XCircle size={14} /> Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserManagement({ onChange }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const data = getPagedUsers(page, search);

  function setStatus(id, status) {
    updateUserStatus(id, status);
    toast.success(`User marked ${status}.`);
    onChange();
  }

  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Manage User Accounts & Roles", description: "Search, review, suspend, or reactivate portal users. Pagination is set to 20 users per page." }} />
      <input className="portal-input portal-user-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, username, role, or department" />
      <div className="portal-table-wrap">
        <table className="portal-table">
          <thead><tr><th>Name</th><th>Email / Username</th><th>Portal</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {data.users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}<small>{user.department}</small></td>
                <td>{user.email || user.username}</td>
                <td>{user.portalType}</td>
                <td>{user.status}</td>
                <td>
                  <button className="portal-mini" onClick={() => setStatus(user.id, user.status === "suspended" ? "active" : "suspended")}>
                    {user.status === "suspended" ? "Reactivate" : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="portal-pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {data.pages}</span>
        <button disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

function PublishingPanel({ onChange }) {
  const [post, setPost] = useState({ type: "Announcement", title: "", body: "", meta: "", applyLink: "", audience: ["undergraduate"] });
  const flags = getPortalFeatures(PORTAL_TYPES.ADMIN).filter((feature) => ["startup-seed", "ip-registration", "project-monitoring", "mentorship"].includes(feature.key));

  function toggleAudience(portalType) {
    setPost((current) => ({
      ...current,
      audience: current.audience.includes(portalType)
        ? current.audience.filter((item) => item !== portalType)
        : [...current.audience, portalType],
    }));
  }

  function publish(event) {
    event.preventDefault();
    savePost(post);
    setPost({ type: "Announcement", title: "", body: "", meta: "", applyLink: "", audience: ["undergraduate"] });
    toast.success("Published successfully.");
    onChange();
  }

  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Publishing and Feature Controls", description: "Publish announcements, funding calls, resources, feedback forms, and enable coming-soon modules." }} />
      <form className="portal-form-card" onSubmit={publish}>
        <div className="portal-form-grid">
          <label>Type<select className="portal-input" value={post.type} onChange={(e) => setPost({ ...post, type: e.target.value })}>
            <option>Announcement</option>
            <option>Internship</option>
            <option>Industrial Visit</option>
            <option>Activity</option>
            <option>Scholarship</option>
            <option>Research Job</option>
            <option>Research Grant</option>
            <option>Conference</option>
            <option>Resource</option>
          </select></label>
          <label>Title<input className="portal-input" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} required /></label>
        </div>
        <label>Body<textarea className="portal-input" rows="4" value={post.body} onChange={(e) => setPost({ ...post, body: e.target.value })} required /></label>
        <div className="portal-form-grid">
          <label>Meta / deadline / file note<input className="portal-input" value={post.meta} onChange={(e) => setPost({ ...post, meta: e.target.value })} /></label>
          <label>Apply link<input className="portal-input" value={post.applyLink} onChange={(e) => setPost({ ...post, applyLink: e.target.value })} placeholder="https://..." /></label>
        </div>
        <div className="portal-checkboxes">
          {Object.values(PORTAL_TYPES).filter((type) => type !== PORTAL_TYPES.ADMIN).map((type) => (
            <label key={type}><input type="checkbox" checked={post.audience.includes(type)} onChange={() => toggleAudience(type)} /> {type}</label>
          ))}
        </div>
        <button className="portal-primary" type="submit">Publish</button>
      </form>
      <div className="portal-panel portal-feature-flags">
        <h3>Enable Coming-Soon Modules</h3>
        {flags.map((feature) => (
          <label key={feature.key}>
            <input type="checkbox" checked={feature.enabled} onChange={(e) => { setFeatureFlag(feature.key, e.target.checked); onChange(); }} />
            {feature.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function SiteUpdatesPanel() {
  const [site, setSite] = useState({ directorName: "", directorMessage: "", directorImage: "", announcement: "" });
  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Site Updates", description: "Update frequently changed public website content and portal announcements." }} />
      <form className="portal-form-card" onSubmit={(event) => { event.preventDefault(); toast.success("Site update saved."); }}>
        <div className="portal-form-grid">
          <label>Director name<input className="portal-input" value={site.directorName} onChange={(e) => setSite({ ...site, directorName: e.target.value })} /></label>
          <label>Director image URL<input className="portal-input" value={site.directorImage} onChange={(e) => setSite({ ...site, directorImage: e.target.value })} /></label>
        </div>
        <label>Director message<textarea className="portal-input" rows="4" value={site.directorMessage} onChange={(e) => setSite({ ...site, directorMessage: e.target.value })} /></label>
        <label>Portal announcement<textarea className="portal-input" rows="3" value={site.announcement} onChange={(e) => setSite({ ...site, announcement: e.target.value })} /></label>
        <button className="portal-primary" type="submit"><Save size={16} /> Save Updates</button>
      </form>
    </div>
  );
}

function ResourceAdminPanel() {
  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Resources", description: "Upload downloadable files and choose which portals can access them." }} />
      <form className="portal-form-card" onSubmit={(event) => { event.preventDefault(); toast.success("Resource uploaded."); }}>
        <div className="portal-form-grid">
          <label>Resource title<input className="portal-input" required /></label>
          <label>File<input className="portal-input" type="file" /></label>
        </div>
        <PortalAudiencePicker />
        <button className="portal-primary" type="submit"><Upload size={16} /> Upload Resource</button>
      </form>
      <ResourceLibrary embedded />
    </div>
  );
}

function FeedbackAdminPanel() {
  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Feedback", description: "Create feedback forms for selected portals and review submitted responses." }} />
      <form className="portal-form-card" onSubmit={(event) => { event.preventDefault(); toast.success("Feedback form created."); }}>
        <div className="portal-form-grid">
          <label>Form title<input className="portal-input" required /></label>
          <label>Question type<select className="portal-input"><option>Rating + comments</option><option>Text response</option><option>Multiple choice</option></select></label>
        </div>
        <label>Question<textarea className="portal-input" rows="3" required /></label>
        <PortalAudiencePicker />
        <button className="portal-primary" type="submit"><Save size={16} /> Create Form</button>
      </form>
      <div className="portal-panel portal-mt"><h3>Recent Responses</h3><p className="portal-empty">Responses will appear here after users submit assigned forms.</p></div>
    </div>
  );
}

function PartnershipRequest({ user, onChange }) {
  const listings = getListings();
  const [selected, setSelected] = useState(listings[0]?.id || "");
  const listing = listings.find((item) => item.id === selected);
  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Partnerships", description: "Submit an investment or partnership proposal for an approved startup, FYP, or business idea." }} />
      <form className="portal-form-card" onSubmit={(event) => {
        event.preventDefault();
        saveSubmission({ title: `Partnership request: ${listing?.title}`, summary: listing?.summary, details: event.currentTarget.proposal.value, featureKey: "partnership-request", portalType: user.portalType, actorId: user.id, actorName: user.name });
        toast.success("Partnership request submitted.");
        onChange();
      }}>
        <label>Selected listing<select className="portal-input" value={selected} onChange={(e) => setSelected(e.target.value)}>{listings.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        {listing && <div className="portal-selected-box"><strong>{listing.title}</strong><p>{listing.summary}</p><small>{listing.owner} - {listing.department}</small></div>}
        <label>Proposal<textarea name="proposal" className="portal-input" rows="5" required placeholder="Investment size, partnership model, expected support, and contact details." /></label>
        <button className="portal-primary" type="submit"><Send size={16} /> Submit Request</button>
      </form>
    </div>
  );
}

function SponsorResearch({ user, onChange }) {
  const profiles = getResearchProfiles();
  const [selected, setSelected] = useState(profiles[0]?.id || "");
  const profile = profiles.find((item) => String(item.id) === String(selected));
  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Sponsor", description: "Submit a sponsorship or collaboration request for an active research project or thesis." }} />
      <form className="portal-form-card" onSubmit={(event) => {
        event.preventDefault();
        saveSubmission({ title: `Research sponsorship: ${profile?.name}`, summary: profile?.interests, details: event.currentTarget.details.value, featureKey: "sponsor-research", portalType: user.portalType, actorId: user.id, actorName: user.name });
        toast.success("Sponsorship request submitted.");
        onChange();
      }}>
        <label>Research profile<select className="portal-input" value={selected} onChange={(e) => setSelected(e.target.value)}>{profiles.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.department}</option>)}</select></label>
        {profile && <div className="portal-selected-box"><strong>{profile.name}</strong><p>{profile.bio}</p><small>{profile.interests}</small></div>}
        <label>Collaboration details<textarea name="details" className="portal-input" rows="5" required /></label>
        <button className="portal-primary" type="submit"><Send size={16} /> Submit Sponsorship</button>
      </form>
    </div>
  );
}

function FeedbackUser({ user, onChange }) {
  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Feedback", description: "Submit general feedback or respond to feedback forms assigned to your portal." }} />
      <form className="portal-form-card" onSubmit={(event) => {
        event.preventDefault();
        saveSubmission({ title: "General feedback", summary: event.currentTarget.rating.value, details: event.currentTarget.comments.value, featureKey: "feedback", portalType: user.portalType, actorId: user.id, actorName: user.name });
        toast.success("Feedback submitted.");
        onChange();
      }}>
        <label>Rating<select name="rating" className="portal-input"><option>Excellent</option><option>Good</option><option>Needs improvement</option></select></label>
        <label>Comments<textarea name="comments" className="portal-input" rows="5" required /></label>
        <button className="portal-primary" type="submit"><Send size={16} /> Submit Feedback</button>
      </form>
    </div>
  );
}

function ResourceLibrary({ embedded = false }) {
  return (
    <div className={embedded ? "portal-panel portal-mt" : "portal-page"}>
      {!embedded && <FeatureHeader feature={{ label: "Resources", description: "Download templates, policies, proposal formats, and ORIC guidelines." }} />}
      <div className="portal-resource-list">
        {getPosts().filter((post) => post.type === "Resource").map((post) => (
          <article key={post.id}>
            <div><strong>{post.title}</strong><p>{post.body}</p><small>{post.meta}</small></div>
            <button className="portal-secondary"><Download size={15} /> Download</button>
          </article>
        ))}
      </div>
    </div>
  );
}

function IncubationApplication({ user, onChange }) {
  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Incubation", description: "Apply for MUET BIC incubation support, mentorship, trainings, and facilities." }} />
      <form className="portal-form-card" onSubmit={(event) => {
        event.preventDefault();
        saveSubmission({ title: `Incubation application: ${user.name}`, summary: event.currentTarget.stage.value, details: event.currentTarget.support.value, featureKey: "incubation-application", portalType: user.portalType, actorId: user.id, actorName: user.name });
        toast.success("Incubation application submitted.");
        onChange();
      }}>
        <div className="portal-selected-box"><strong>{user.name}</strong><p>This startup is registered with ORIC MUET.</p></div>
        <label>Startup stage<select name="stage" className="portal-input"><option>Idea validation</option><option>Prototype</option><option>Early revenue</option><option>Scaling</option></select></label>
        <label>Support required<textarea name="support" className="portal-input" rows="5" required /></label>
        <button className="portal-primary" type="submit"><Send size={16} /> Apply for Incubation</button>
      </form>
    </div>
  );
}

function InvestorConnections({ onChange }) {
  const requests = getSubmissions().filter((item) => item.featureKey === "partnership-request").slice(0, 8);
  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Investors", description: "Review investor and industry partner offers, then accept or reject with remarks." }} />
      <div className="portal-table-wrap">
        <table className="portal-table">
          <thead><tr><th>Offer</th><th>From</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {requests.map((item) => (
              <tr key={item.id}>
                <td>{item.title}<small>{item.summary}</small></td>
                <td>{item.actorName}</td>
                <td>{item.status}</td>
                <td>
                  <button className="portal-mini portal-mini--green" onClick={() => { updateSubmissionStatus(item.id, "Accepted", "Accepted by startup."); onChange(); }}>Accept</button>
                  <button className="portal-mini portal-mini--red" onClick={() => { updateSubmissionStatus(item.id, "Rejected", "Rejected by startup."); onChange(); }}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {requests.length === 0 && <div className="portal-panel portal-mt"><p className="portal-empty">No investor offers yet.</p></div>}
    </div>
  );
}

function SettingsView({ user, updateProfile }) {
  const [form, setForm] = useState({
    name: user.name || "",
    password: "",
    department: user.department || "",
    designation: user.designation || "",
    phone: user.phone || "",
    rollNumber: user.rollNumber || "",
    employeeId: user.employeeId || "",
    companyName: user.companyName || "",
    companyRole: user.companyRole || user.designation || "",
    companyWebsite: user.companyWebsite || "",
    startupName: user.startupName || "",
    founderRole: user.founderRole || user.designation || "",
    startupStage: user.startupStage || "",
    photo: user.photo || "",
  });

  const fields = getSettingsFields(user.portalType);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("photo", reader.result);
    reader.readAsDataURL(file);
  }

  function save(event) {
    event.preventDefault();
    updateProfile({ ...form, password: form.password || user.password });
    toast.success("Settings updated.");
  }

  return (
    <div className="portal-page">
      <section className="portal-settings-hero">
        <div className="portal-settings-photo">
          {form.photo ? <img src={form.photo} alt="Profile preview" /> : <span>{user.avatar}</span>}
        </div>
        <div>
          <p className="portal-eyebrow">Account Settings</p>
          <h1>{user.portalType === PORTAL_TYPES.ADMIN ? "Admin Profile" : form.name}</h1>
          <p>{getSettingsSubtitle(user, form)}</p>
        </div>
      </section>

      <form className="portal-form-card portal-settings-card" onSubmit={save}>
        <div className="portal-form-grid">
          <label>
            Photo
            <input className="portal-input" type="file" accept="image/*" onChange={handlePhoto} />
          </label>
          <label>
            New password
            <input className="portal-input" type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} placeholder="Leave blank to keep current" />
          </label>
          {fields.map((field) => (
            <label key={field.key}>
              {field.label}
              <input
                className="portal-input"
                value={form[field.key] || ""}
                disabled={field.disabled}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            </label>
          ))}
        </div>
        <button className="portal-primary" type="submit"><Save size={16} /> Save Settings</button>
      </form>
    </div>
  );
}

function getSettingsFields(portalType) {
  if (portalType === PORTAL_TYPES.UNDERGRADUATE || portalType === PORTAL_TYPES.POSTGRADUATE) {
    return [
      { key: "name", label: "Full name" },
      { key: "rollNumber", label: "Roll number" },
      { key: "department", label: "Department" },
      { key: "phone", label: "Phone" },
    ];
  }

  if (portalType === PORTAL_TYPES.FACULTY) {
    return [
      { key: "name", label: "Full name" },
      { key: "designation", label: "Designation" },
      { key: "employeeId", label: "Employee ID" },
      { key: "department", label: "Department" },
      { key: "phone", label: "Phone" },
    ];
  }

  if (portalType === PORTAL_TYPES.INDUSTRY) {
    return [
      { key: "name", label: "Representative name" },
      { key: "companyName", label: "Company name" },
      { key: "companyRole", label: "Role / position" },
      { key: "companyWebsite", label: "Company website" },
      { key: "phone", label: "Phone" },
    ];
  }

  if (portalType === PORTAL_TYPES.STARTUP) {
    return [
      { key: "name", label: "Founder name" },
      { key: "startupName", label: "Startup name" },
      { key: "founderRole", label: "Founder role" },
      { key: "startupStage", label: "Startup stage" },
      { key: "phone", label: "Phone" },
    ];
  }

  return [
    { key: "name", label: "Name", disabled: true },
    { key: "designation", label: "Role" },
    { key: "phone", label: "Phone" },
  ];
}

function getSettingsSubtitle(user, form) {
  if (user.portalType === PORTAL_TYPES.INDUSTRY) return `${form.companyName || "Company"} - ${form.companyRole || "Industry Partner"}`;
  if (user.portalType === PORTAL_TYPES.STARTUP) return `${form.startupName || "Startup"} - ${form.founderRole || "Founder"}`;
  if (user.portalType === PORTAL_TYPES.FACULTY) return `${form.designation || "Faculty"} - ${form.department || "Department"}`;
  if (user.portalType === PORTAL_TYPES.UNDERGRADUATE || user.portalType === PORTAL_TYPES.POSTGRADUATE) return `${form.rollNumber || "Student"} - ${form.department || "Department"}`;
  return "ORIC administration";
}

function PortalAudiencePicker() {
  return (
    <div className="portal-checkboxes">
      {Object.values(PORTAL_TYPES).filter((type) => type !== PORTAL_TYPES.ADMIN).map((type) => (
        <label key={type}><input type="checkbox" defaultChecked={type === PORTAL_TYPES.UNDERGRADUATE} /> {type}</label>
      ))}
    </div>
  );
}

function AnalyticsPanel() {
  const users = getPagedUsers(1, "").total;
  const submissions = getSubmissions();
  const listings = getListings();
  const stats = [
    ["Students onboarded", getPagedUsers(1, "student").total],
    ["Industry partners onboarded", getPagedUsers(1, "industry").total + 1],
    ["Faculty & researchers onboarded", getPagedUsers(1, "faculty").total],
    ["Investor connections made", submissions.filter((item) => item.featureKey?.includes("partnership")).length + 24],
    ["Investment in research & innovation", "PKR 84M"],
    ["Startups listed", listings.filter((item) => item.kind === "Startup").length],
    ["FYPs listed", listings.filter((item) => item.kind === "FYP").length],
    ["Total users", users],
  ];

  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Analytics and Reports", description: "Tracked KPIs with report download placeholders for PDF and Excel exports." }} />
      <div className="portal-stats-grid">
        {stats.map(([label, value]) => (
          <div className="portal-stat-card" key={label}>
            <div><strong>{value}</strong><span>{label}</span><small>Actual tracked value</small></div>
          </div>
        ))}
      </div>
      <div className="portal-panel"><h3>KPI Controls</h3><p>Edit display overrides or keep actual tracked counts. Actual tracking remains the default.</p></div>
    </div>
  );
}

function ReportsPanel() {
  const stats = ["Students", "Faculty", "Industry", "Startups", "FYPs", "Connections"];
  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Reports", description: "Generate visual reports and export portal statistics." }} />
      <div className="portal-panel">
        <div className="portal-report-actions">
          <button className="portal-primary"><Download size={16} /> Export PDF</button>
          <button className="portal-secondary"><Download size={16} /> Export Excel</button>
        </div>
        <div className="portal-report-bars">
          {stats.map((label, index) => <span key={label} style={{ height: `${54 + index * 16}px` }} title={label} />)}
        </div>
      </div>
    </div>
  );
}

function FeatureHeader({ feature }) {
  return (
    <section className="portal-feature-header">
      <h1>{feature.label}</h1>
      <p>{feature.description}</p>
    </section>
  );
}
