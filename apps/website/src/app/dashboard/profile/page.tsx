"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { FadeIn } from "@/components/dashboard/fade-in";

import {
  LogOut,
  Loader2,
  User,
  Mail,
  Calendar,
  Camera,
  Check,
  X,
  Save,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // ── Editable fields ──────────────────────────────────────
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ── Image upload state ──────────────────────────────────
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Profile — Kairo";
  }, []);

  // Sync form fields with session data
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      setBio((session.user as any).bio ?? "");
    }
  }, [session]);

  // Reset dirty state after save
  const resetDirty = useCallback(() => {
    setIsDirty(false);
  }, []);

  // ── Save handler ─────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || null, bio: bio.trim() || null }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save");
      }

      const data = await res.json();

      // Update session so sidebar and other components reflect the new name
      await update({ name: data.user.name });

      setSaveMessage({ type: "success", text: "Profile saved." });
      resetDirty();
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  // ── Cancel handler ──────────────────────────────────────
  const handleCancel = () => {
    setName(session?.user?.name ?? "");
    setBio((session?.user as any)?.bio ?? "");
    setIsDirty(false);
    setSaveMessage(null);
  };

  // ── Loading / unauthenticated states ────────────────────
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/60" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const user = session?.user;
  const currentImage = previewUrl ?? user?.image ?? null;

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────── */}
      <FadeIn delay={0}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account settings and public profile.
          </p>
        </div>
      </FadeIn>

      {/* ── Profile Card ──────────────────────────────────── */}
      <FadeIn delay={150}>
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-6">
          {/* Avatar with upload */}
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <div className="group relative h-20 w-20 shrink-0">
              <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-border">
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt={name || "Avatar"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <User className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Upload overlay */}
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/40">
                <Camera className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // Show preview immediately
                    const objectUrl = URL.createObjectURL(file);
                    setPreviewUrl(objectUrl);

                    // Upload via API
                    setIsUploading(true);
                    try {
                      const formData = new FormData();
                      formData.append("file", file);

                      const res = await fetch("/api/user/profile/image", {
                        method: "POST",
                        body: formData,
                      });

                      if (!res.ok) {
                        throw new Error("Upload failed");
                      }

                      const data = await res.json();
                      setPreviewUrl(data.image);
                      setSaveMessage({
                        type: "success",
                        text: "Profile picture updated.",
                      });
                      await update({ image: data.image });
                    } catch {
                      // Revert preview on error
                      setPreviewUrl(null);
                      setSaveMessage({
                        type: "error",
                        text: "Failed to upload image",
                      });
                    } finally {
                      setIsUploading(false);
                      setTimeout(() => setSaveMessage(null), 4000);
                    }
                  }}
                />
              </label>

              {/* Upload spinner */}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground/60 text-center sm:text-left">
              Click to change photo
            </p>
          </div>

          {/* Name & bio */}
          <div className="flex-1 space-y-4 min-w-0">
            {/* Name */}
            <div>
              <label
                htmlFor="profile-name"
                className="block text-xs font-medium text-muted-foreground/80 mb-1.5"
              >
                Display Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsDirty(true);
                }}
                maxLength={80}
                placeholder="Your name"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 transition-colors focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              />
              <p className="mt-1 text-xs text-muted-foreground/40">
                {name.length}/80 characters
              </p>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="profile-bio"
                className="block text-xs font-medium text-muted-foreground/80 mb-1.5"
              >
                Bio
              </label>
              <textarea
                id="profile-bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setIsDirty(true);
                }}
                maxLength={500}
                rows={3}
                placeholder="A short description of yourself..."
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 transition-colors focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              />
              <p className="mt-1 text-xs text-muted-foreground/40">
                {bio.length}/500 characters
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? "Saving..." : "Save changes"}
              </button>

              {isDirty && (
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              )}

              {/* Save feedback */}
              {saveMessage && (
                <span
                  className={`inline-flex items-center gap-1 text-sm ${
                    saveMessage.type === "success"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {saveMessage.type === "success" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  {saveMessage.text}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      </FadeIn>

      {/* ── Account Details ────────────────────────────────── */}
      <FadeIn delay={300}>
      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Account Details
        </h2>
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {/* GitHub */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <svg className="h-4 w-4 text-muted-foreground/60 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">GitHub</p>
              <p className="text-xs text-muted-foreground/60">
                Connected
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
              Active
            </span>
          </div>

          {/* Email */}
          {user?.email && (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Mail className="h-4 w-4 text-muted-foreground/60 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                  {user.email}
                </p>
                <p className="text-xs text-muted-foreground/60">Email</p>
              </div>
            </div>
          )}

          {/* Member since */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Calendar className="h-4 w-4 text-muted-foreground/60 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">Member</p>
              <p className="text-xs text-muted-foreground/60">
                KairoCLI
              </p>
            </div>
          </div>
        </div>
      </div>
      </FadeIn>

      {/* ── Danger Zone ──────────────────────────────────── */}
      <FadeIn delay={450}>
      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Actions
        </h2>
        <div className="rounded-xl border border-border bg-card p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
      </FadeIn>
    </div>
  );
}
