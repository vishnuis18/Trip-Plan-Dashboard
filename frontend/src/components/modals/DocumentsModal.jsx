import React from 'react';
import { X, FileText, Download, CheckCircle2, Plane, Hotel, ShieldCheck } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export const DocumentsModal = () => {
  const { closeModal, activeTrip } = useTrip();

  const documents = activeTrip?.documents || [];

  const handleDownload = (title) => {
    alert(`Downloading ${title}...`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#121927] border border-white/10 shadow-2xl p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Trip Documents & Vouchers</h3>
            <p className="text-xs text-slate-400">
              {activeTrip?.destination ? `${activeTrip.destination} Travel Confirmations` : 'Travel Confirmations & Vouchers'}
            </p>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="py-12 px-4 rounded-2xl bg-[#141B2D]/50 border border-white/[0.05] text-center flex flex-col items-center gap-2">
            <FileText className="w-8 h-8 text-slate-400" />
            <h4 className="text-sm font-semibold text-white">No documents uploaded yet</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Upload boarding passes, hotel reservations, or transit vouchers for this trip.
            </p>
            <button
              onClick={() => alert('Select a PDF or image ticket to attach to this trip.')}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/20 transition-all inline-flex items-center gap-1.5"
            >
              <span>+ Upload Document</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {documents.map((doc) => {
              const Icon = doc.icon || FileText;
              return (
                <div
                  key={doc.id || doc._id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#18233C]/70 border border-white/[0.06] hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{doc.title}</h4>
                        {doc.status && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                            {doc.status}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{doc.details}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(doc.title)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-blue-500/20 text-slate-300 hover:text-blue-400 transition-colors shrink-0"
                    title="Download Document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
