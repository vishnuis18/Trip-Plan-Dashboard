import React, { useState } from 'react';
import { Users, UserPlus, Mail, Shield, Check, Copy, Crown, Edit, Eye, ThumbsUp, ThumbsDown, Coins } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import { SettleUpModal } from '../../components/SettleUpModal';
import confetti from 'canvas-confetti';

export const TripMembersTab = () => {
  const { activeTrip, activities } = useTrip();
  const { user } = useAuth();

  const [members, setMembers] = useState([
    {
      id: 'mem_1',
      name: user?.name || 'Shihab',
      email: user?.email || 'shihab@tripplan.com',
      role: 'Owner',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      joinedAt: 'Trip Creator'
    },
    {
      id: 'mem_2',
      name: 'Aiden Vance',
      email: 'aiden.v@gmail.com',
      role: 'Editor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      joinedAt: 'Invited 3 days ago'
    }
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember = {
      id: 'mem_' + Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(inviteEmail)}`,
      joinedAt: 'Invited just now'
    };

    setMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/share/${activeTrip?._id || 'trip-tokyo-2025'}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const roleBadges = {
    Owner: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Crown },
    Editor: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Edit },
    Viewer: { color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', icon: Eye }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Group Members & Permissions — {activeTrip?.destination || 'Tokyo, Japan'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Plan collaboratively, propose activities, vote on stops, and share trip expenses
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsSettleUpOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all shadow-sm"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Settle Up Expenses</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 text-xs font-semibold border border-blue-500/30 transition-all shadow-sm"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
          </button>

          <button
            onClick={() => window.open(`/share/${activeTrip?._id || 'trip-tokyo-2025'}`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-all shadow-sm"
            title="Open read-only share view in new tab"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Preview Public View</span>
          </button>
        </div>
      </div>

      <SettleUpModal 
        isOpen={isSettleUpOpen} 
        onClose={() => setIsSettleUpOpen(false)} 
        members={members} 
      />

      {/* Invite Member Card */}
      <form onSubmit={handleInvite} className="p-5 rounded-3xl bg-[#121927] border border-white/[0.08] shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            placeholder="Invite by collaborator email (e.g. friend@example.com)..."
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full bg-[#18233C] border border-white/10 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <select
          value={inviteRole}
          onChange={(e) => setInviteRole(e.target.value)}
          className="bg-[#18233C] border border-white/10 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
        >
          <option value="Editor">Editor (Can edit activities)</option>
          <option value="Viewer">Viewer (Read-only)</option>
        </select>

        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Send Invite</span>
        </button>
      </form>

      {/* Members List */}
      <div className="rounded-3xl bg-[#121927] border border-white/[0.08] shadow-xl overflow-hidden divide-y divide-white/[0.04]">
        <div className="p-4 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Active Collaborators ({members.length})</span>
          <span>Access Level</span>
        </div>

        {members.map((member) => {
          const badge = roleBadges[member.role] || roleBadges.Viewer;
          const RoleIcon = badge.icon;
          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{member.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
                  {member.joinedAt}
                </span>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${badge.color}`}>
                  <RoleIcon className="w-3 h-3" />
                  <span>{member.role}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Voting Summary Box */}
      <div className="p-5 rounded-3xl bg-[#121927] border border-white/[0.08] shadow-xl flex flex-col gap-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Group Activity Votes (Sample Stops)</span>
        </h3>
        <p className="text-xs text-slate-400">
          Members can vote thumbs up or thumbs down on each proposed itinerary item.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {activities.slice(0, 4).map((act) => (
            <div
              key={act._id}
              className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <span className="text-xs font-semibold text-white block truncate">{act.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">{act.time} · {act.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                  <ThumbsUp className="w-3 h-3" />
                  <span>2</span>
                </button>
                <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-[11px] font-bold border border-rose-500/20">
                  <ThumbsDown className="w-3 h-3" />
                  <span>0</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
