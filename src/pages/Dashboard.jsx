/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Clock, Download, ExternalLink, Save, Send, Upload, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { FALLBACK_OPPORTUNITIES, PLACEHOLDER_IMAGES, PORTAL_CONFIG, PORTAL_TYPES } from "../portal/portalConfig";
import {
  getForms,
  getFeedbackFormAssignments,
  getAnalyticsOverrides,
  getListings,
  getPagedUsers,
  getPortalFeatures,
  getPosts,
  getResearchProfiles,
  getSubmissions,
  markPostInterested,
  savePost,
  saveForm,
  saveFeedbackFormAssignments,
  saveAnalyticsOverrides,
  saveListing,
  saveResearchProfile,
  saveSubmission,
  setFeatureFlag,
  updateListingImage,
  updateSubmissionStatus,
  updateUserStatus,
} from "../portal/portalStorage";
import "./Dashboard.css";

function readImageFile(file, callback) {
  if (!file) return;
  if (!file.type?.startsWith("image/")) {
    toast.error("Please choose a valid image file.");
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    toast.error("Please choose an image smaller than 3 MB.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function readDocumentFile(file, callback) {
  if (!file) return;
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Please choose a PDF, DOC, DOCX, or TXT file.");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Please choose a file smaller than 5 MB.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => callback(reader.result, file.name);
  reader.readAsDataURL(file);
}

function getOpportunityImage(item) {
  return item.image || item.imageUrl || item.image_url || PLACEHOLDER_IMAGES.opportunity;
}

function getListingImage(listing) {
  const kind = String(listing.kind || "").toLowerCase();
  if (listing.image || listing.imageUrl || listing.image_url) return listing.image || listing.imageUrl || listing.image_url;
  if (kind.includes("fyp")) return PLACEHOLDER_IMAGES.fyp;
  if (kind.includes("business")) return PLACEHOLDER_IMAGES.business;
  return PLACEHOLDER_IMAGES.startup;
}

function getProfileImage(profile) {
  if (profile.photo || profile.image || profile.photoUrl || profile.photo_url) {
    return profile.photo || profile.image || profile.photoUrl || profile.photo_url;
  }
  const gender = String(profile.gender || "").toLowerCase();
  if (gender === "female") return PLACEHOLDER_IMAGES.femaleProfile;
  if (gender === "male") return PLACEHOLDER_IMAGES.maleProfile;
  return PLACEHOLDER_IMAGES.neutralProfile;
}

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
  if (feature.key === "internships") return <OpportunityBoard feature={feature} audience={user.portalType} user={user} onChange={onChange} />;
  if (feature.key === "activities") return <EventBoard feature={feature} audience={user.portalType} user={user} onChange={onChange} />;
  if (feature.key === "scholarships") return <ScholarshipBoard feature={feature} audience={user.portalType} />;
  if (feature.key === "fyp-listing") return <FypListing user={user} onChange={onChange} />;
  if (feature.key === "research-projects") return <ResearchJobs user={user} onChange={onChange} />;
  if (feature.key === "thesis-listing") return <ThesisListing user={user} onChange={onChange} />;
  if (feature.key === "research-grants") return <GrantApplications user={user} onChange={onChange} />;
  if (feature.key === "conferences") return <ConferenceBoard user={user} onChange={onChange} />;
  if (feature.key === "browse-research" || feature.key === "collaboration-network") return <ResearchNetwork />;
  if (feature.key === "users") return <UserManagement onChange={onChange} />;
  if (feature.key === "analytics") return <AnalyticsPanel />;
  if (feature.key === "reports") return <ReportsPanel />;
  if (feature.key === "forms-admin") return <FormsAdminPanel onChange={onChange} />;
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

const OPPORTUNITY_TYPES = ["Internship", "Workshop", "Bootcamp", "Industrial Visit", "Other Opportunity"];
const EVENT_TYPES = ["Competition", "Talk", "Job Fair", "Academic Event", "Entertainment", "Other Event"];

function OpportunityBoard({ feature, type, audience, user, onChange = () => {}, minimum = 0 }) {
  const types = type ? [type] : OPPORTUNITY_TYPES;
  const [filter, setFilter] = useState("All");
  const posts = getOpportunityPosts(types, audience, minimum).filter((post) => filter === "All" || post.type === filter);
  const [selected, setSelected] = useState(null);
  const [applying, setApplying] = useState(null);

  return (
    <div className="portal-page">
      <FeatureHeader feature={feature} />
      {!type && <FilterTabs options={["All", ...OPPORTUNITY_TYPES]} value={filter} onChange={setFilter} />}
      <div className="portal-board-grid">
        {posts.map((post) => (
          <OpportunityCard
            post={post}
            key={post.id}
            onView={() => setSelected(post)}
            onApply={() => setApplying(post)}
          />
        ))}
        {posts.length === 0 && <EmptyPanel text={`No ${type ? type.toLowerCase() : "student"} opportunities are currently open.`} />}
      </div>
      {selected && <OpportunityDetails post={selected} onClose={() => setSelected(null)} />}
      {applying && <OpportunityApplyForm post={applying} user={user} onClose={() => setApplying(null)} onChange={onChange} />}
    </div>
  );
}

function EventBoard({ feature, audience, user, onChange }) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const posts = getPosts()
    .filter((post) => EVENT_TYPES.includes(post.type) && post.audience?.includes(audience))
    .filter((post) => filter === "All" || post.type === filter);

  function markInterested(post) {
    markPostInterested(post.id, user.id);
    toast.success("Marked as interested.");
    onChange();
  }

  return (
    <div className="portal-page">
      <FeatureHeader feature={feature} />
      <FilterTabs options={["All", ...EVENT_TYPES]} value={filter} onChange={setFilter} />
      <div className="portal-board-grid">
        {posts.map((post) => <EventCard post={post} user={user} key={post.id} onView={() => setSelected(post)} onInterested={() => markInterested(post)} />)}
        {posts.length === 0 && <EmptyPanel text="No events match this filter yet." />}
      </div>
      {selected && <EventDetails post={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ScholarshipBoard({ feature, audience }) {
  const [detailsPost, setDetailsPost] = useState(null);
  const [documentsPost, setDocumentsPost] = useState(null);
  const posts = getPosts()
    .filter((post) => post.type === "Scholarship" && post.audience?.includes(audience))
    .sort((first, second) => getScholarshipStatusRank(first.status) - getScholarshipStatusRank(second.status));

  return (
    <div className="portal-page">
      <FeatureHeader
        feature={{
          ...feature,
          description: `${feature.description}\nDownload the application form and submit it at the SFAO department through proper channel along with required documents.`,
        }}
      />
      <div className="portal-scholarship-list">
        {posts.map((post) => (
          <ScholarshipCard
            post={post}
            key={post.id}
            onDetails={() => setDetailsPost(post)}
            onDocuments={() => setDocumentsPost(post)}
          />
        ))}
        {posts.length === 0 && <EmptyPanel text="No scholarships are currently published for this portal." />}
      </div>
      {detailsPost && (
        <ScholarshipInfoModal
          post={detailsPost}
          title="Eligibility and Details"
          body={detailsPost.details || detailsPost.eligibility || detailsPost.body}
          onClose={() => setDetailsPost(null)}
        />
      )}
      {documentsPost && (
        <ScholarshipInfoModal
          post={documentsPost}
          title="Documents Required"
          body={documentsPost.documentsRequired || "Documents list will be announced by SFAO."}
          onClose={() => setDocumentsPost(null)}
        />
      )}
    </div>
  );
}

function ScholarshipCard({ post, onDetails, onDocuments }) {
  const formUrl = post.applicationFormUrl || post.applyLink || "#";
  const formName = post.applicationFormName || `${post.title.replace(/\s+/g, "-").toLowerCase()}-application-form`;
  return (
    <article className="portal-scholarship-card">
      <div className="portal-scholarship-card__main">
        <div className="portal-scholarship-card__media">
          <span className={`portal-status-pill ${String(post.status || "").toLowerCase() === "closed" ? "portal-status-pill--closed" : ""}`}>
            {post.status || "Open"}
          </span>
          <ScholarshipLogo post={post} />
        </div>
        <div>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <div className="portal-scholarship-meta">
            <small><strong>Deadline:</strong> {post.deadline || extractDeadline(post.meta) || "To be announced"}</small>
            <small><strong>Managed by:</strong> SFAO Department</small>
            <small><strong>Organized by:</strong> {post.organizedBy || "SFAO Department"}</small>
          </div>
        </div>
      </div>
      <div className="portal-scholarship-actions">
        <div>
          <button className="portal-secondary" onClick={onDetails}>Details</button>
          <button className="portal-secondary" onClick={onDocuments}>Documents Required</button>
        </div>
        <a className="portal-primary" href={formUrl} download={formUrl !== "#" ? formName : undefined}>Download Application Form</a>
      </div>
    </article>
  );
}

function ScholarshipLogo({ post }) {
  if (post.logo || post.logoUrl || post.logo_url) {
    return <img className="portal-scholarship-logo" src={post.logo || post.logoUrl || post.logo_url} alt="" loading="lazy" />;
  }
  return <div className="portal-scholarship-logo portal-scholarship-logo--fallback">{getScholarshipInitials(post.title)}</div>;
}

function getScholarshipInitials(title = "Scholarship") {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getScholarshipStatusRank(status = "") {
  return String(status).toLowerCase() === "closed" ? 1 : 0;
}

function ScholarshipInfoModal({ post, title, body, onClose }) {
  return (
    <div className="portal-modal-backdrop" role="presentation" onClick={onClose}>
      <section className="portal-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="portal-modal__header">
          <span>{post.title}</span>
          <button onClick={onClose}>Close</button>
        </div>
        <h2>{title}</h2>
        <p className="portal-preserve-lines">{body}</p>
      </section>
    </div>
  );
}

function FilterTabs({ options, value, onChange }) {
  return (
    <div className="portal-filter-tabs">
      {options.map((option) => (
        <button key={option} className={value === option ? "portal-filter-tabs__active" : ""} onClick={() => onChange(option)}>
          {option.replace(" Opportunity", "").replace(" Event", "")}
        </button>
      ))}
    </div>
  );
}

function OpportunityCard({ post, onView, onApply }) {
  return (
    <article className="portal-detail-card">
      <img className="portal-card-image" src={getOpportunityImage(post)} alt="" loading="lazy" />
      <span>{post.type}</span>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <small>{post.meta}</small>
      <small><strong>Organized by:</strong> {post.organizedBy || "To be announced"}</small>
      <small><strong>Deadline:</strong> {post.deadline || extractDeadline(post.meta) || "To be announced"}</small>
      <div className="portal-card-actions">
        <button className="portal-secondary" onClick={onView}>Details</button>
        <button className="portal-primary" onClick={onApply}>Apply</button>
      </div>
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
        <img className="portal-modal-image" src={getOpportunityImage(post)} alt="" />
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <dl>
          <div><dt>Status</dt><dd>{post.status}</dd></div>
          <div><dt>Details</dt><dd>{post.meta}</dd></div>
          <div><dt>Organized by</dt><dd>{post.organizedBy || "To be announced"}</dd></div>
          <div><dt>Deadline</dt><dd>{post.deadline || extractDeadline(post.meta) || "To be announced"}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function OpportunityApplyForm({ post, user, onClose, onChange }) {
  const formTemplate = getFormForPost(post);
  const [answers, setAnswers] = useState(() => getInitialFormAnswers(formTemplate, post, user));

  function updateAnswer(key, value) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const invalidWordField = formTemplate.fields.find((field) => field.maxWords && countWords(answers[field.key]) > field.maxWords);
    if (invalidWordField) {
      toast.error(`${invalidWordField.label} must be ${invalidWordField.maxWords} words or fewer.`);
      return;
    }
    saveSubmission({
      title: `Application: ${post.title}`,
      summary: `${formTemplate.name} submitted for ${post.title}`,
      details: JSON.stringify(answers),
      featureKey: "opportunity-application",
      portalType: user?.portalType || "portal",
      actorId: user?.id || "guest",
      actorName: user?.name || "Portal user",
      actorEmail: user?.email || "",
      target: post.title,
      formId: formTemplate.id,
      formName: formTemplate.name,
      formAnswers: answers,
    });
    toast.success("Application submitted.");
    onChange();
    onClose();
  }

  return (
    <div className="portal-modal-backdrop" role="presentation" onClick={onClose}>
      <section className="portal-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="portal-modal__header">
          <span>Apply</span>
          <button onClick={onClose}>Close</button>
        </div>
        <h2>{post.title}</h2>
        <form className="portal-modal-form" onSubmit={submit}>
          <p className="portal-form-note">{formTemplate.name}</p>
          <div className="portal-modal-form-grid">
            {formTemplate.fields.map((field) => (
              <DynamicFormField
                field={field}
                value={answers[field.key]}
                onChange={(value) => updateAnswer(field.key, value)}
                key={field.key}
              />
            ))}
          </div>
          <button className="portal-primary" type="submit"><Send size={16} /> Submit Application</button>
        </form>
      </section>
    </div>
  );
}

function DynamicFormField({ field, value, onChange, editable = true }) {
  const commonProps = {
    className: "portal-input",
    value: value || "",
    onChange: (event) => onChange(event.target.value),
    required: field.required,
    disabled: !editable || Boolean(field.auto),
  };
  const words = field.maxWords ? countWords(value) : 0;

  if (field.type === "textarea") {
    return (
      <label className="portal-dynamic-field">
        {field.label}
        <textarea {...commonProps} rows="4" />
        {field.maxWords && <small>{words}/{field.maxWords} words</small>}
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="portal-dynamic-field">
        {field.label}
        <select {...commonProps}>
          <option value="">Select</option>
          {field.options?.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  if (field.type === "radio") {
    return (
      <fieldset className="portal-dynamic-field portal-dynamic-fieldset">
        <legend>{field.label}</legend>
        <div>
          {field.options?.map((option) => (
            <label key={option}>
              <input type="radio" name={field.key} value={option} checked={value === option} required={field.required} onChange={() => onChange(option)} />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === "rating") {
    return (
      <fieldset className="portal-dynamic-field portal-dynamic-fieldset portal-rating-field">
        <legend>{field.label}</legend>
        <div>
          {[1, 2, 3, 4, 5].map((rating) => (
            <label key={rating}>
              <input type="radio" name={field.key} value={rating} checked={Number(value) === rating} required={field.required} onChange={() => onChange(rating)} />
              <span aria-hidden="true">{Number(value || 0) >= rating ? "★" : "☆"}</span>
              <small>{rating}</small>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="portal-dynamic-field portal-checkbox-field">
        <input type="checkbox" checked={Boolean(value)} required={field.required} onChange={(event) => onChange(event.target.checked)} />
        {field.label}
      </label>
    );
  }

  if (field.type === "file") {
    return (
      <label className="portal-dynamic-field">
        {field.label}
        <input className="portal-input" type="file" accept={field.accept || undefined} required={field.required && !value} onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          if (field.accept?.includes("pdf") && file.type !== "application/pdf") {
            toast.error("Please upload a PDF file.");
            event.target.value = "";
            return;
          }
          if (field.accept?.includes("image") && !file.type?.startsWith("image/")) {
            toast.error("Please upload an image file.");
            event.target.value = "";
            return;
          }
          onChange(file.name);
        }} />
        {value && <small>{value}</small>}
      </label>
    );
  }

  return (
    <label className="portal-dynamic-field">
      {field.label}
      <input {...commonProps} type={field.type || "text"} />
    </label>
  );
}

function getFormForPost(post) {
  const forms = getForms();
  const formId = post.formId || getDefaultFormId(post.type);
  return forms.find((form) => form.id === formId) || forms[0] || { id: "basic-form", name: "Application Form", fields: [] };
}

function getDefaultFormId(type) {
  if (type === "Internship") return "internship-form";
  if (type === "Workshop" || type === "Industrial Visit") return "workshop-form";
  if (type === "Bootcamp") return "bootcamp-form";
  if (type === "Research Grant") return "research-grant-form";
  return "internship-form";
}

function getInitialFormAnswers(formTemplate, post, user) {
  return formTemplate.fields.reduce((answers, field) => {
    answers[field.key] = getAutoFieldValue(field.auto, post, user);
    return answers;
  }, {});
}

function getAutoFieldValue(auto, post, user) {
  if (!auto) return "";
  if (auto === "name") return user?.name || "";
  if (auto === "postTitle") return post.title || "";
  if (auto === "rollNumber") return user?.rollNumber || user?.employeeId || "";
  if (auto === "email") return user?.email || user?.username || "";
  if (auto === "phone") return user?.phone || "";
  if (auto === "department") return user?.department || "";
  if (auto === "applicantType") return user?.portalType === PORTAL_TYPES.FACULTY ? "Faculty" : "Postgraduate Student";
  return "";
}

function countWords(value = "") {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function EventCard({ post, user, onView, onInterested }) {
  const alreadyInterested = post.interestedUserIds?.includes(user.id);
  return (
    <article className="portal-detail-card">
      <img className="portal-card-image" src={getOpportunityImage(post)} alt="" loading="lazy" />
      <span>{post.type}</span>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <EventMeta post={post} />
      <div className="portal-card-actions">
        <button className="portal-secondary" onClick={onView}>Details</button>
        <button className="portal-primary" disabled={alreadyInterested} onClick={onInterested}>
          {alreadyInterested ? "Interested" : "Interested"}
        </button>
      </div>
      <small>{Number(post.interestedCount || 0)} students interested</small>
    </article>
  );
}

function EventDetails({ post, onClose }) {
  return (
    <div className="portal-modal-backdrop" role="presentation" onClick={onClose}>
      <section className="portal-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="portal-modal__header">
          <span>{post.type}</span>
          <button onClick={onClose}>Close</button>
        </div>
        <img className="portal-modal-image" src={getOpportunityImage(post)} alt="" />
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <dl>
          <div><dt>Location</dt><dd>{post.location || post.meta || "To be announced"}</dd></div>
          <div><dt>Date</dt><dd>{post.date || "To be announced"}</dd></div>
          <div><dt>Time</dt><dd>{post.time || "To be announced"}</dd></div>
          <div><dt>Duration</dt><dd>{post.duration || "To be announced"}</dd></div>
          <div><dt>Organized by</dt><dd>{post.organizedBy || "To be announced"}</dd></div>
          <div><dt>Interested</dt><dd>{Number(post.interestedCount || 0)} students</dd></div>
        </dl>
      </section>
    </div>
  );
}

function EventMeta({ post }) {
  return (
    <div className="portal-card-meta">
      <small><strong>Location:</strong> {post.location || post.meta || "To be announced"}</small>
      <small><strong>Date:</strong> {post.date || "To be announced"}</small>
      <small><strong>Time:</strong> {post.time || "To be announced"}</small>
      <small><strong>Duration:</strong> {post.duration || "To be announced"}</small>
      <small><strong>Organized by:</strong> {post.organizedBy || "To be announced"}</small>
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

function GrantApplications({ user, onChange }) {
  return <OpportunityBoard feature={{ label: "Grants", description: "Explore research and travel grant calls. Open a card for complete details and apply through the assigned form." }} type="Research Grant" audience={user.portalType} user={user} onChange={onChange} minimum={5} />;
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
      image: form.image,
    });
    if (featureKey === "fyp-listing") {
      saveListing({
        kind: "FYP",
        title: form.projectTitle || title,
        owner: user.name,
        ownerEmail: user.email,
        department: user.department,
        summary: form.details,
        needs: "Admin review and industry matching",
        image: form.image,
      });
    }
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
        <label>Listing image
          <input className="portal-input" type="file" accept="image/*" onChange={(e) => readImageFile(e.target.files?.[0], (image) => setForm({ ...form, image }))} />
        </label>
        {form.image && <img className="portal-upload-preview" src={form.image} alt="Submission preview" />}
        <button className="portal-primary" type="submit"><Send size={16} /> Submit</button>
      </form>
    </div>
  );
}

function EmptyPanel({ text }) {
  return <div className="portal-panel"><p className="portal-empty">{text}</p></div>;
}

function getOpportunityPosts(types, audience, minimum = 0) {
  const typeList = Array.isArray(types) ? types : [types];
  const adminPosts = getPosts().filter((post) => typeList.includes(post.type) && post.audience?.includes(audience));
  const fallback = typeList.flatMap((type) => (FALLBACK_OPPORTUNITIES[type] || []).map((item) => ({ ...item, audience: [audience] })));
  const merged = [...adminPosts, ...fallback.filter((item) => !adminPosts.some((post) => post.title === item.title))];
  return minimum ? merged.slice(0, Math.max(minimum, adminPosts.length)) : merged;
}

function extractDeadline(meta = "") {
  const match = String(meta).match(/deadline:\s*(.+)$/i);
  return match?.[1];
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
  const [form, setForm] = useState({ title: "", summary: "", details: "", partnerName: "", budget: "", remarks: "", image: "", gender: "" });

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
        photo: form.image || user.photo,
        gender: form.gender,
      });
    }

    setForm({ title: "", summary: "", details: "", partnerName: "", budget: "", remarks: "", image: "", gender: "" });
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
        {feature.key === "faculty-profile" && (
          <>
            <div className="portal-form-grid">
              <label>
                Gender
                <select className="portal-input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </label>
              <label>
                Profile image
                <input className="portal-input" type="file" accept="image/*" onChange={(e) => readImageFile(e.target.files?.[0], (image) => setForm({ ...form, image }))} />
              </label>
            </div>
            {form.image && <img className="portal-upload-preview" src={form.image} alt="Research profile preview" />}
          </>
        )}
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
            <img className="portal-card-image" src={getListingImage(listing)} alt="" loading="lazy" />
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
            <img className="portal-profile-image" src={getProfileImage(profile)} alt="" loading="lazy" />
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
  const initialPost = { type: "Announcement", title: "", body: "", meta: "", organizedBy: "", deadline: "", location: "", date: "", time: "", duration: "", details: "", documentsRequired: "", applicationFormUrl: "", applicationFormName: "", logo: "", applyLink: "", formId: "", image: "", audience: ["undergraduate"] };
  const [post, setPost] = useState(initialPost);
  const flags = getPortalFeatures(PORTAL_TYPES.ADMIN).filter((feature) => ["startup-seed", "ip-registration", "project-monitoring", "mentorship"].includes(feature.key));
  const published = getPosts();
  const forms = getForms();
  const isOpportunity = OPPORTUNITY_TYPES.includes(post.type);
  const isEvent = EVENT_TYPES.includes(post.type);
  const isScholarship = post.type === "Scholarship";
  const canAttachForm = [...OPPORTUNITY_TYPES, "Research Grant", "Research Job", "Conference"].includes(post.type);

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
    savePost({
      ...post,
      status: isScholarship ? post.status || "Open" : post.status,
      formId: canAttachForm ? post.formId || getDefaultFormId(post.type) : "",
      applyLink: isScholarship ? post.applicationFormUrl || post.applyLink : post.applyLink,
    });
    setPost(initialPost);
    toast.success(post.id ? "Updated successfully." : "Published successfully.");
    onChange();
  }

  function editPost(item) {
    setPost({
      ...initialPost,
      ...item,
      audience: item.audience || ["undergraduate"],
      applicationFormUrl: item.applicationFormUrl || item.applyLink || "",
      applicationFormName: item.applicationFormName || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Publishing and Feature Controls", description: "Publish announcements, funding calls, resources, feedback forms, and enable coming-soon modules." }} />
      <form className="portal-form-card" onSubmit={publish}>
        <div className="portal-form-grid">
          <label>Type<select className="portal-input" value={post.type} onChange={(e) => setPost({ ...post, type: e.target.value })}>
            <option>Announcement</option>
            {OPPORTUNITY_TYPES.map((type) => <option key={type}>{type}</option>)}
            {EVENT_TYPES.map((type) => <option key={type}>{type}</option>)}
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
          <label>Organized by<input className="portal-input" value={post.organizedBy || ""} onChange={(e) => setPost({ ...post, organizedBy: e.target.value })} placeholder="ORIC / Department / Society" /></label>
          <label>Apply link<input className="portal-input" value={post.applyLink} onChange={(e) => setPost({ ...post, applyLink: e.target.value })} placeholder="https://..." /></label>
        </div>
        {canAttachForm && (
          <label>Attach application form<select className="portal-input" value={post.formId || getDefaultFormId(post.type)} onChange={(e) => setPost({ ...post, formId: e.target.value })}>
            {forms.map((form) => <option key={form.id} value={form.id}>{form.name}</option>)}
          </select></label>
        )}
        {(isOpportunity || isScholarship) && (
          <label>Opportunity deadline<input className="portal-input" value={post.deadline} onChange={(e) => setPost({ ...post, deadline: e.target.value })} placeholder="15 Aug 2026" required /></label>
        )}
        {isScholarship && (
          <>
            <div className="portal-form-grid">
              <label>Status<select className="portal-input" value={post.status || "Open"} onChange={(e) => setPost({ ...post, status: e.target.value })}>
                <option>Open</option>
                <option>Closed</option>
              </select></label>
              <label>Application form download URL<input className="portal-input" value={post.applicationFormUrl || ""} onChange={(e) => setPost({ ...post, applicationFormUrl: e.target.value, applyLink: e.target.value })} placeholder="/resources/scholarships/form.pdf" required /></label>
            </div>
            <div className="portal-form-grid">
              <label>Scholarship logo URL<input className="portal-input" value={post.logo || ""} onChange={(e) => setPost({ ...post, logo: e.target.value })} placeholder="https://..." /></label>
              <label>Upload scholarship logo
                <input className="portal-input" type="file" accept="image/*" onChange={(e) => readImageFile(e.target.files?.[0], (image) => setPost({ ...post, logo: image }))} />
              </label>
            </div>
            {post.logo && <img className="portal-upload-preview portal-logo-preview" src={post.logo} alt="Scholarship logo preview" />}
            <label>Upload application form
              <input className="portal-input" type="file" accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={(e) => readDocumentFile(e.target.files?.[0], (url, name) => setPost({ ...post, applicationFormUrl: url, applyLink: url, applicationFormName: name }))} />
              {post.applicationFormName && <small>{post.applicationFormName}</small>}
            </label>
            <label>Details / eligibility criteria<textarea className="portal-input" rows="5" value={post.details || ""} onChange={(e) => setPost({ ...post, details: e.target.value })} required /></label>
            <label>Documents required<textarea className="portal-input" rows="5" value={post.documentsRequired || ""} onChange={(e) => setPost({ ...post, documentsRequired: e.target.value })} required /></label>
            <div className="portal-selected-box">
              <strong>SFAO handling note</strong>
              <p>Scholarship cards will tell students to contact the SFAO office at the Admin Building with complete documents and the filled application form.</p>
            </div>
          </>
        )}
        {isEvent && (
          <div className="portal-form-grid">
            <label>Location<input className="portal-input" value={post.location} onChange={(e) => setPost({ ...post, location: e.target.value })} placeholder="Software Department" required /></label>
            <label>Date<input className="portal-input" value={post.date} onChange={(e) => setPost({ ...post, date: e.target.value })} placeholder="27-07-2026" required /></label>
            <label>Time<input className="portal-input" value={post.time} onChange={(e) => setPost({ ...post, time: e.target.value })} placeholder="10am to 2pm" required /></label>
            <label>Duration<input className="portal-input" value={post.duration} onChange={(e) => setPost({ ...post, duration: e.target.value })} placeholder="3 days" required /></label>
          </div>
        )}
        <label>Card image
          <input className="portal-input" type="file" accept="image/*" onChange={(e) => readImageFile(e.target.files?.[0], (image) => setPost({ ...post, image }))} />
        </label>
        {post.image && <img className="portal-upload-preview" src={post.image} alt="Post preview" />}
        <div className="portal-checkboxes">
          {Object.values(PORTAL_TYPES).filter((type) => type !== PORTAL_TYPES.ADMIN).map((type) => (
            <label key={type}><input type="checkbox" checked={post.audience.includes(type)} onChange={() => toggleAudience(type)} /> {type}</label>
          ))}
        </div>
        <div className="portal-report-actions">
          <button className="portal-primary" type="submit">{post.id ? "Update Post" : "Publish"}</button>
          {post.id && <button className="portal-secondary" type="button" onClick={() => setPost(initialPost)}>Cancel Edit</button>}
        </div>
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
      <div className="portal-panel portal-mt">
        <h3>Published Items</h3>
        <div className="portal-table-wrap portal-mt">
          <table className="portal-table">
            <thead><tr><th>Title</th><th>Type</th><th>Audience</th><th>Deadline / Event</th><th>Interested</th><th>Action</th></tr></thead>
            <tbody>
              {published.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}<small>{item.body}</small></td>
                  <td>{item.type}</td>
                  <td>{item.audience?.join(", ")}</td>
                  <td>{EVENT_TYPES.includes(item.type) ? `${item.location || item.meta || "TBA"} - ${item.date || "TBA"}` : item.deadline || extractDeadline(item.meta) || item.meta || "TBA"}</td>
                  <td>{EVENT_TYPES.includes(item.type) ? Number(item.interestedCount || 0) : "-"}</td>
                  <td><button className="portal-mini" onClick={() => editPost(item)}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FormsAdminPanel({ onChange }) {
  const forms = getForms();
  const [selectedId, setSelectedId] = useState(forms[0]?.id || "");
  const selectedForm = forms.find((form) => form.id === selectedId) || forms[0];
  const [draft, setDraft] = useState(() => cloneFormDraft(selectedForm));

  function loadForm(id) {
    const form = forms.find((item) => item.id === id);
    setSelectedId(id);
    setDraft(cloneFormDraft(form));
  }

  function updateDraftField(index, key, value) {
    setDraft((current) => ({
      ...current,
      fields: current.fields.map((field, fieldIndex) => fieldIndex === index ? { ...field, [key]: value } : field),
    }));
  }

  function addField() {
    setDraft((current) => ({
      ...current,
      fields: [...current.fields, { key: `field${current.fields.length + 1}`, label: "New Field", type: "text", required: false }],
    }));
  }

  function removeField(index) {
    setDraft((current) => ({
      ...current,
      fields: current.fields.filter((_, fieldIndex) => fieldIndex !== index),
    }));
  }

  function submit(event) {
    event.preventDefault();
    const normalizedFields = draft.fields.map((field) => ({
      ...field,
      key: normalizeFieldKey(field.key || field.label),
      options: ["select", "radio"].includes(field.type)
        ? String(field.optionsText || field.options?.join(",") || "").split(",").map((item) => item.trim()).filter(Boolean)
        : undefined,
      optionsText: undefined,
    }));
    saveForm({ ...draft, id: draft.id || `form-${Date.now()}`, fields: normalizedFields });
    toast.success("Form saved.");
    onChange();
  }

  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Create Forms", description: "Build reusable application forms and attach them to internships, workshops, bootcamps, visits, grants, and collaboration posts." }} />
      <div className="portal-dashboard-grid">
        <section>
          <form className="portal-form-card" onSubmit={submit}>
            <div className="portal-form-grid">
              <label>Start from saved form<select className="portal-input" value={selectedId} onChange={(e) => loadForm(e.target.value)}>
                {forms.map((form) => <option key={form.id} value={form.id}>{form.name}</option>)}
              </select></label>
              <label>Form name<input className="portal-input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required /></label>
            </div>
            <label>Description<textarea className="portal-input" rows="3" value={draft.description || ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
            <div className="portal-form-builder">
              <div className="portal-panel__header">
                <h3>Fields</h3>
                <button type="button" className="portal-mini" onClick={addField}>Add Field</button>
              </div>
              {draft.fields.map((field, index) => (
                <div className="portal-form-builder__row" key={`${field.key}-${index}`}>
                  <input className="portal-input" value={field.label} onChange={(e) => updateDraftField(index, "label", e.target.value)} placeholder="Field label" />
                  <select className="portal-input" value={field.type} onChange={(e) => updateDraftField(index, "type", e.target.value)}>
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="url">URL</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="textarea">Textarea</option>
                    <option value="select">Select</option>
                    <option value="radio">Radio</option>
                    <option value="rating">1-5 Rating</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="file">File Upload</option>
                  </select>
                  <input className="portal-input" value={field.optionsText || field.options?.join(", ") || ""} disabled={!["select", "radio"].includes(field.type)} onChange={(e) => updateDraftField(index, "optionsText", e.target.value)} placeholder="Options comma separated" />
                  <label className="portal-inline-check"><input type="checkbox" checked={Boolean(field.required)} onChange={(e) => updateDraftField(index, "required", e.target.checked)} /> Required</label>
                  <button type="button" className="portal-mini portal-mini--red" onClick={() => removeField(index)}>Remove</button>
                </div>
              ))}
            </div>
            <button className="portal-primary" type="submit"><Save size={16} /> Save Form</button>
          </form>
        </section>
        <aside className="portal-aside">
          <div className="portal-panel">
            <div className="portal-panel__header"><h3>Saved Forms</h3><span>{forms.length}</span></div>
            <div className="portal-list">
              {forms.map((form) => (
                <article key={form.id}>
                  <strong>{form.name}</strong>
                  <p>{form.description}</p>
                  <small>{form.fields.length} fields</small>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function cloneFormDraft(form) {
  return {
    id: form?.id || "",
    name: form?.name || "Custom Form",
    description: form?.description || "",
    fields: (form?.fields || []).map((field) => ({ ...field, optionsText: field.options?.join(", ") || "" })),
  };
}

function normalizeFieldKey(value = "") {
  const key = String(value).trim().replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase()).replace(/[^a-zA-Z0-9]/g, "");
  return key ? key.charAt(0).toLowerCase() + key.slice(1) : `field${Date.now()}`;
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
  const forms = getForms();
  const assignments = getFeedbackFormAssignments();
  const [draft, setDraft] = useState(assignments);
  const feedbackSubmissions = getSubmissions().filter((submission) => submission.featureKey === "feedback");
  const feedbackPortals = [
    PORTAL_TYPES.UNDERGRADUATE,
    PORTAL_TYPES.POSTGRADUATE,
    PORTAL_TYPES.FACULTY,
    PORTAL_TYPES.INDUSTRY,
    PORTAL_TYPES.STARTUP,
  ];

  function submit(event) {
    event.preventDefault();
    saveFeedbackFormAssignments(draft);
    toast.success("Feedback form assignments saved.");
  }

  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Feedback", description: "Create feedback forms for selected portals and review submitted responses." }} />
      <form className="portal-form-card" onSubmit={submit}>
        <p className="portal-form-note">Edit the default feedback form in Create Forms, or create a new form there and assign it below.</p>
        <div className="portal-form-grid">
          {feedbackPortals.map((portalType) => (
            <label key={portalType}>
              {PORTAL_CONFIG[portalType].shortTitle} feedback form
              <select className="portal-input" value={draft[portalType] || "feedback-form"} onChange={(event) => setDraft({ ...draft, [portalType]: event.target.value })}>
                {forms.map((form) => <option key={form.id} value={form.id}>{form.name}</option>)}
              </select>
            </label>
          ))}
        </div>
        <button className="portal-primary" type="submit"><Save size={16} /> Save Feedback Forms</button>
      </form>
      <div className="portal-panel portal-mt">
        <div className="portal-panel__header"><h3>Recent Responses</h3><span>{feedbackSubmissions.length}</span></div>
        {feedbackSubmissions.length === 0 ? (
          <p className="portal-empty">Responses will appear here after users submit assigned forms.</p>
        ) : (
          <div className="portal-table-wrap portal-mt">
            <table className="portal-table">
              <thead><tr><th>User</th><th>Portal</th><th>Form</th><th>Submitted</th><th>Response</th></tr></thead>
              <tbody>
                {feedbackSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.actorName}<small>{submission.actorEmail}</small></td>
                    <td>{PORTAL_CONFIG[submission.portalType]?.shortTitle || submission.portalType}</td>
                    <td>{submission.formName || "Feedback Form"}</td>
                    <td>{new Date(submission.createdAt).toLocaleString()}</td>
                    <td><FeedbackAnswerSummary answers={submission.formAnswers} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
  const formTemplate = getFeedbackFormForPortal(user.portalType);
  const [answers, setAnswers] = useState(() => getInitialFormAnswers(formTemplate, { title: "Portal Feedback" }, user));

  function updateAnswer(key, value) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    saveSubmission({
      title: "Portal feedback",
      summary: `${formTemplate.name} submitted`,
      details: JSON.stringify(answers),
      featureKey: "feedback",
      portalType: user.portalType,
      actorId: user.id,
      actorName: user.name,
      actorEmail: user.email || user.username || "",
      formId: formTemplate.id,
      formName: formTemplate.name,
      formAnswers: answers,
    });
    toast.success("Feedback submitted.");
    setAnswers(getInitialFormAnswers(formTemplate, { title: "Portal Feedback" }, user));
    onChange();
  }

  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Feedback", description: "Submit general feedback or respond to feedback forms assigned to your portal." }} />
      <form className="portal-form-card" onSubmit={submit}>
        <p className="portal-form-note">{formTemplate.name}</p>
        <div className="portal-modal-form-grid">
          {formTemplate.fields.map((field) => (
            <DynamicFormField
              field={field}
              value={answers[field.key]}
              onChange={(value) => updateAnswer(field.key, value)}
              key={field.key}
            />
          ))}
        </div>
        <button className="portal-primary" type="submit"><Send size={16} /> Submit Feedback</button>
      </form>
    </div>
  );
}

function getFeedbackFormForPortal(portalType) {
  const forms = getForms();
  const assignments = getFeedbackFormAssignments();
  const formId = assignments[portalType] || "feedback-form";
  return forms.find((form) => form.id === formId) || forms.find((form) => form.id === "feedback-form") || forms[0] || { id: "feedback-form", name: "Feedback Form", fields: [] };
}

function FeedbackAnswerSummary({ answers = {} }) {
  const entries = Object.entries(answers).filter(([, value]) => value !== "" && value !== undefined && value !== null);
  if (!entries.length) return <span className="portal-empty">No response data.</span>;
  return (
    <div className="portal-answer-summary">
      {entries.slice(0, 6).map(([key, value]) => (
        <span key={key}><strong>{toTitleLabel(key)}:</strong> {String(value)}</span>
      ))}
      {entries.length > 6 && <small>+{entries.length - 6} more fields</small>}
    </div>
  );
}

function toTitleLabel(value = "") {
  return String(value)
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function ResourceLibrary({ embedded = false }) {
  return (
    <div className={embedded ? "portal-panel portal-mt" : "portal-page"}>
      {!embedded && <FeatureHeader feature={{ label: "Resources", description: "Download templates, policies, proposal formats, and ORIC guidelines." }} />}
      <div className="portal-resource-list">
        {getPosts().filter((post) => post.type === "Resource").map((post) => (
          <article key={post.id}>
            <div><strong>{post.title}</strong><p>{post.body}</p><small>{post.meta}</small></div>
            <a className="portal-secondary" href={post.applyLink || "#"} download><Download size={15} /> Download</a>
          </article>
        ))}
      </div>
    </div>
  );
}

function IncubationApplication({ user, onChange }) {
  const startupListing = getListings().find((listing) =>
    String(listing.title || "").toLowerCase() === String(user.startupName || user.name || "").toLowerCase()
    || String(listing.owner || "").toLowerCase() === String(user.name || "").toLowerCase()
    || String(listing.ownerEmail || "").toLowerCase() === String(user.email || "").toLowerCase(),
  );

  function changeStartupImage(file) {
    if (!startupListing) {
      toast.error("No approved startup listing is linked with this account yet.");
      return;
    }
    readImageFile(file, (image) => {
      updateListingImage(startupListing.id, image);
      toast.success("Startup listing image updated.");
      onChange();
    });
  }

  return (
    <div className="portal-page">
      <FeatureHeader feature={{ label: "Incubation", description: "Apply for MUET BIC incubation support, mentorship, trainings, and facilities." }} />
      <section className="portal-form-card portal-startup-media">
        <img src={startupListing ? getListingImage(startupListing) : PLACEHOLDER_IMAGES.startup} alt="" />
        <div>
          <p className="portal-eyebrow">Industry Listing Image</p>
          <h3>{startupListing?.title || user.startupName || "Startup profile"}</h3>
          <p>This image appears on your approved startup card when industry partners browse listings.</p>
          <label className="portal-file-action">
            <Upload size={16} /> Change Image
            <input type="file" accept="image/*" onChange={(event) => changeStartupImage(event.target.files?.[0])} />
          </label>
        </div>
      </section>
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
  const overrides = getAnalyticsOverrides();
  const [, forceRender] = useState(0);
  const baseStats = [
    ["Students onboarded", getPagedUsers(1, "student").total],
    ["Industry partners onboarded", getPagedUsers(1, "industry").total + 1],
    ["Faculty & researchers onboarded", getPagedUsers(1, "faculty").total],
    ["Investor connections made", submissions.filter((item) => item.featureKey?.includes("partnership")).length + 24],
    ["Investment in research & innovation", "PKR 84M"],
    ["Startups listed", listings.filter((item) => item.kind === "Startup").length],
    ["FYPs listed", listings.filter((item) => item.kind === "FYP").length],
    ["Total users", users],
  ];
  const stats = baseStats.map(([label, value]) => [label, overrides[label] || value]);

  function saveMetric(event, label) {
    event.preventDefault();
    const value = event.currentTarget.metricValue.value;
    saveAnalyticsOverrides({ ...overrides, [label]: value });
    toast.success("KPI saved.");
    forceRender((current) => current + 1);
  }

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
      <div className="portal-panel portal-mt">
        <h3>KPI Controls</h3>
        <div className="portal-kpi-editor">
          {baseStats.map(([label, value]) => (
            <form key={label} onSubmit={(event) => saveMetric(event, label)}>
              <label>{label}<input className="portal-input" name="metricValue" defaultValue={overrides[label] || value} /></label>
              <button className="portal-mini" type="submit">Save</button>
            </form>
          ))}
        </div>
      </div>
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
