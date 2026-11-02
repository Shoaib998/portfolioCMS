import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  uploadResume,
  type Profile as ProfileData,
} from "../../services/profile.service";

const emptyProfile: ProfileData = {
  headline: "",
  designation: "",
  bio: "",
  phone: "",
  alternatePhone: "",
  website: "",
  location: "",
  country: "",
  github: "",
  linkedin: "",
  facebook: "",
  instagram: "",
  twitter: "",
  profileImage: "",
  resume: "",
};

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "block text-sm font-medium text-slate-700";

const Profile = () => {
  const [form, setForm] = useState<ProfileData>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getProfile();
      setForm({ ...emptyProfile, ...(data ?? {}) });
    } catch {
      setError("Profile load nahi ho saka. Please check your server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setMessage("");
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        headline: form.headline || undefined,
        designation: form.designation || undefined,
        bio: form.bio || undefined,
        phone: form.phone || undefined,
        alternatePhone: form.alternatePhone || undefined,
        website: form.website || undefined,
        location: form.location || undefined,
        country: form.country || undefined,
        github: form.github || undefined,
        linkedin: form.linkedin || undefined,
        facebook: form.facebook || undefined,
        instagram: form.instagram || undefined,
        twitter: form.twitter || undefined,
      };

      const updated = await updateProfile(payload);
      setForm((previous) => ({ ...previous, ...updated }));
      setMessage("Profile updated successfully.");
    } catch (err: unknown) {
      const responseMessage =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "message" in err.response.data
          ? String(err.response.data.message)
          : "Profile save nahi ho saka. Fields check karke dobara try karein.";

      setError(responseMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setUploadingImage(true);
    setError("");
    setMessage("");

    try {
      const updated = await uploadProfileImage(file);
      setForm((previous) => ({ ...previous, ...updated }));
      setMessage("Profile image uploaded successfully.");
    } catch {
      setError("Image upload failed. Please check the file and server.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Please select a PDF resume.");
      return;
    }

    setUploadingResume(true);
    setError("");
    setMessage("");

    try {
      const updated = await uploadResume(file);
      setForm((previous) => ({ ...previous, ...updated }));
      setMessage("Resume uploaded successfully.");
    } catch {
      setError("Resume upload failed. Please try again.");
    } finally {
      setUploadingResume(false);
    }
  };

  const imageUrl = form.profileImage
    ? `http://localhost:5000${form.profileImage}`
    : "";

  const resumeUrl = form.resume
    ? `http://localhost:5000${form.resume}`
    : "";

  if (loading) {
    return (
      <div className="p-8 text-sm text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Profile Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your portfolio information, contact details and social links.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void loadProfile()}
            className="shrink-0 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <section className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Profile Image</h2>

          <div className="mt-5 flex justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                className="h-32 w-32 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-100 text-4xl font-semibold text-slate-400">
                {(form.user?.fullName || "A").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <p className="mt-3 text-center font-semibold text-slate-800">
            {form.user?.fullName || "Portfolio Owner"}
          </p>
          <p className="text-center text-sm text-slate-500">
            {form.user?.email || ""}
          </p>

          <label className="mt-5 block cursor-pointer rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50">
            {uploadingImage ? "Uploading image..." : "Upload new image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <h2 className="font-semibold text-slate-900">Resume / CV</h2>
            <p className="mt-1 text-xs text-slate-500">
              Upload your resume in PDF format.
            </p>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-sm font-medium text-blue-600 hover:underline"
              >
                View current resume
              </a>
            )}

            <label className="mt-4 block cursor-pointer rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50">
              {uploadingResume ? "Uploading resume..." : "Upload PDF resume"}
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleResume}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>
          </div>
        </section>

        <form onSubmit={handleSave} className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Basic Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Headline</label>
                <input
                  name="headline"
                  value={form.headline ?? ""}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Building modern web experiences"
                />
              </div>

              <div>
                <label className={labelClass}>Designation</label>
                <input
                  name="designation"
                  value={form.designation ?? ""}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Frontend Developer"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Bio / About</label>
                <textarea
                  name="bio"
                  value={form.bio ?? ""}
                  onChange={handleChange}
                  rows={6}
                  className={inputClass}
                  placeholder="Write your professional introduction..."
                />
                <p className="mt-1 text-xs text-slate-500">
                  Write at least 20 characters if you enter a bio.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Contact & Location
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["phone", "Phone"],
                ["alternatePhone", "Alternate Phone"],
                ["website", "Website URL"],
                ["location", "City / Location"],
                ["country", "Country"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input
                    name={name}
                    value={String(form[name as keyof ProfileData] ?? "")}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={label}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Social Media Links
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["github", "GitHub URL"],
                ["linkedin", "LinkedIn URL"],
                ["facebook", "Facebook URL"],
                ["instagram", "Instagram URL"],
                ["twitter", "Twitter / X URL"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input
                    type="url"
                    name={name}
                    value={String(form[name as keyof ProfileData] ?? "")}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="https://"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => void loadProfile()}
              disabled={saving}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Reload
            </button>

            <button
              type="submit"
              disabled={saving || uploadingImage || uploadingResume}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
