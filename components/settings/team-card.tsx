"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2, Lock, Mail, UserPlus, Users, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TeamMember } from "@/lib/team/queries";

/**
 * One shared role, not Owner/Member permission tiers: anyone invited gets
 * the same full access to reviews, settings, and billing as the account
 * owner - see lib/team/. Pro-only, same gating pattern as Franchise View.
 */
export function TeamCard({ isPro, initialMembers }: { isPro: boolean; initialMembers: TeamMember[] }) {
  if (!isPro) return <LockedTeamCard />;
  return <ActiveTeamCard initialMembers={initialMembers} />;
}

function LockedTeamCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startTrial() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "pro", trial: true }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Couldn't start checkout.");
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Couldn't start checkout.");
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          Team
        </CardTitle>
        <CardDescription>Invite teammates to help manage reviews and responses.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/20 py-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10">
            <Lock className="h-5 w-5 text-blue-600" />
          </span>
          <div>
            <p className="text-sm font-semibold">Team seats are a Pro feature</p>
            <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
              Upgrade to invite teammates with full access to your account, start with a 7-day free trial.
            </p>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button size="sm" onClick={startTrial} disabled={loading} className="mt-1 gap-1.5">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Start Free Trial
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ActiveTeamCard({ initialMembers }: { initialMembers: TeamMember[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleInvite() {
    setInviting(true);
    setError(null);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't send this invite.");
      setMembers((prev) => [
        ...prev,
        { id: data.id, invited_email: email.trim().toLowerCase(), status: "invited", invited_at: new Date().toISOString(), joined_at: null },
      ]);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Couldn't send this invite.");
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(id: string) {
    setRemovingId(id);
    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Couldn't remove this teammate.");
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      setError(err.message || "Couldn't remove this teammate.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          Team
        </CardTitle>
        <CardDescription>
          Invite teammates by email — they get full access to your reviews, responses, and settings once they sign up.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="teammate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              onKeyDown={(e) => e.key === "Enter" && !inviting && email && handleInvite()}
            />
          </div>
          <Button onClick={handleInvite} disabled={inviting || !email} className="shrink-0 gap-1.5">
            {inviting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
            Invite
          </Button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}

        {members.length > 0 && (
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{member.invited_email}</p>
                  <Badge
                    variant="outline"
                    className={
                      member.status === "active"
                        ? "border-transparent bg-emerald-500/10 text-emerald-600"
                        : "border-transparent bg-amber-500/10 text-amber-600"
                    }
                  >
                    {member.status === "active" ? (
                      <span className="inline-flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Active
                      </span>
                    ) : (
                      "Invite pending"
                    )}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemove(member.id)}
                  disabled={removingId === member.id}
                  className="shrink-0 gap-1.5 text-muted-foreground hover:text-red-600"
                >
                  {removingId === member.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
