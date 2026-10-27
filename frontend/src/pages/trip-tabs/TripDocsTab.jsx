import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plane, 
  Hotel, 
  Ticket, 
  ShieldCheck, 
  Download, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Calendar, 
  Lock,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import confetti from 'canvas-confetti';

export const TripDocsTab = () => {
  const { activeTrip } = useTrip();
  const tripId = activeTrip?._id || 'default_trip';
  const destination = activeTrip?.destination || 'Tokyo, Japan';

  const defaultDocs = [
    {
      id: 'doc_1',
      title: 'Japan Airlines Flight JL006 (JFK → HND)',
      category: 'Flights',
      provider: 'Japan Airlines',
      confirmationCode: 'JL-9482XQ',
      date: 'May 14, 2025 • 11:20 AM',
      details: 'Terminal 1 • Seat 14A • Non-stop 14h 25m',
      fileSize: '1.8 MB',
      status: 'Confirmed'
    },
    {
      id: 'doc_2',
      title: 'Park Hyatt Tokyo Reservation (4 Nights)',
      category: 'Stays',
      provider: 'World of Hyatt',
      confirmationCode: 'HYATT-772910',
      date: 'May 14 - May 18, 2025',
      details: 'Deluxe View King • Check-in 15:00',
      fileSize: '820 KB',
      status: 'Confirmed'
    },
    {
      id: 'doc_3',
      title: 'teamLab Planets Tokyo — Timed Entry Pass',
      category: 'Tickets',
      provider: 'teamLab Planets',
      confirmationCode: 'TL-88301',
      date: 'May 15, 2025 • 02:00 PM',
      details: '2x Adult General Admission • Fast-track QR',
      fileSize: '450 KB',
      status: 'Ready'
    },
    {
      id: 'doc_4',
      title: 'JR Whole Japan Rail Pass (7 Days)',
      category: 'Tickets',
      provider: 'JR Central',
      confirmationCode: 'JRP-992147',
      date: 'May 14 - May 21, 2025',
      details: 'Ordinary Car • Exchange Voucher Order',
      fileSize: '1.2 MB',
      status: 'Voucher Ready'
    },
    {
      id: 'doc_5',
      title: 'Allianz Global Comprehensive Travel Shield',
      category: 'Insurance',
      provider: 'Allianz Partners',
      confirmationCode: 'ALZ-550182-US',
      date: 'May 13 - May 22, 2025',
      details: '$250,000 Med Evac + Trip Interruption Coverage',
      fileSize: '2.4 MB',
      status: 'Active Policy'
    }
  ];

  const storageKey = `tripplan_docs_${tripId}`;

  const [docs, setDocs] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultDocs;
    } catch {
      return defaultDocs;
    }
  });

  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Flights',
    provider: '',
    confirmationCode: '',
    date: '',
    details: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(docs));
    } catch (e) {
      console.warn('Could not save docs:', e);
    }
  }, [docs, storageKey]);

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteDoc = (id) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newDoc = {
      id: 'doc_' + Date.now(),
      title: formData.title.trim(),
      category: formData.category,
      provider: formData.provider.trim() || 'Provider',
      confirmationCode: formData.confirmationCode.trim() || 'REF-' + Math.floor(100000 + Math.random() * 900000),
      date: formData.date.trim() || 'Trip Dates',
      details: formData.details.trim() || 'Verified confirmation voucher',
      fileSize: '1.2 MB',
      status: 'Confirmed'
    };

    setDocs((prev) => [newDoc, ...prev]);
    setFormData({
      title: '',
      category: 'Flights',
      provider: '',
      confirmationCode: '',
      date: '',
      details: ''
    });
    setShowUploadModal(false);

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Flights': return <Plane className="w-5 h-5 text-blue-400" />;
      case 'Stays': return <Hotel className="w-5 h-5 text-purple-400" />;
      case 'Tickets': return <Ticket className="w-5 h-5 text-amber-400" />;
      case 'Insurance': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      default: return <FileText className="w-5 h-5 text-cyan-400" />;
    }
  };

  const filteredDocs = docs.filter((doc) => {
    const matchesCategory = filterCategory === 'All' || doc.category === filterCategory;
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.confirmationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Flights', 'Stays', 'Tickets', 'Insurance'];

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Bookings & Documents Vault</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              Offline Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Secure vouchers, flight passes, hotel confirmations, and insurance for {destination}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Booking / Voucher</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#141B2D]/70 border border-white/[0.07] backdrop-blur-md">
          <p className="text-[11px] font-medium text-slate-400">Total Documents</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-white">{docs.length}</span>
            <span className="text-[11px] text-slate-400">items</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/70 border border-white/[0.07] backdrop-blur-md">
          <p className="text-[11px] font-medium text-slate-400">Flight Passes</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-400">
              {docs.filter(d => d.category === 'Flights').length}
            </span>
            <span className="text-[11px] text-slate-400">tickets</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/70 border border-white/[0.07] backdrop-blur-md">
          <p className="text-[11px] font-medium text-slate-400">Hotel & Stays</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-purple-400">
              {docs.filter(d => d.category === 'Stays').length}
            </span>
            <span className="text-[11px] text-slate-400">booked</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141B2D]/70 border border-white/[0.07] backdrop-blur-md">
          <p className="text-[11px] font-medium text-slate-400">Attraction Passes</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-400">
              {docs.filter(d => d.category === 'Tickets').length}
            </span>
            <span className="text-[11px] text-slate-400">passes</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121927]/60 p-2 rounded-2xl border border-white/[0.06]">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, PNR, provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#18233C]/80 border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#141B2D]/40 border border-white/[0.05] flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No documents found</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            {searchQuery 
              ? `No documents matching "${searchQuery}". Try clearing your search.` 
              : 'Add your flight reservations, hotel vouchers, or city passes here for fast offline access.'}
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs font-semibold border border-blue-500/30 transition-all"
          >
            + Add First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => {
            const isCopied = copiedId === doc.id;
            return (
              <div
                key={doc.id}
                className="group relative p-5 rounded-2xl bg-[#141B2D]/80 hover:bg-[#18233C]/90 border border-white/[0.07] hover:border-blue-500/40 transition-all shadow-md flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {getCategoryIcon(doc.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {doc.category}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[10px] font-semibold text-slate-300">
                            {doc.provider}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                          {doc.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      title="Remove document"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Details & Dates */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-300 bg-black/20 p-3 rounded-xl border border-white/[0.04]">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{doc.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 pl-5.5 leading-relaxed">
                      {doc.details}
                    </p>
                  </div>
                </div>

                {/* Footer Bar: PNR & Download */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-xs">
                  {/* PNR Code Pill */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">REF:</span>
                    <button
                      onClick={() => handleCopyCode(doc.id, doc.confirmationCode)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/10 transition-all"
                      title="Click to copy confirmation code"
                    >
                      <span>{doc.confirmationCode}</span>
                      {isCopied ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Download / View Button */}
                  <button
                    onClick={() => {
                      alert(`Opening secure preview for: ${doc.title} (${doc.fileSize})`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 border border-blue-500/30 text-xs font-semibold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View Pass</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-[#121927] border border-white/10 shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-white mb-1">Add Travel Document / Voucher</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a booking reference or boarding voucher to your {destination} trip vault.
            </p>

            <form onSubmit={handleAddDocument} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ANA Flight NH106, Shibuya Excel Hotel"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Flights">Flights</option>
                    <option value="Stays">Stays</option>
                    <option value="Tickets">Tickets</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Provider
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JAL, Hyatt, Klook"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    PNR / Confirmation #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7K892X"
                    value={formData.confirmationCode}
                    onChange={(e) => setFormData({ ...formData, confirmationCode: e.target.value })}
                    className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. May 15, 10:00 AM"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Seat, Room or Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Terminal 2, Seat 12K, Breakfast included"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-[#18233C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/20"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
