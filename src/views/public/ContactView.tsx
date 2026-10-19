import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ContactViewProps {
  onNavigate: (tab: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'Agency Partnership & Enterprise Inquiries',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Get in Touch</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Global & Regional Offices</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Contact the SitePilot AI team.</h1>
          <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
            Have questions about custom agency quotas, Nigerian Paystack billing, international wire transfers, or dedicated enterprise instances? We respond within 1 business day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Contact Details */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white">Support & Sales Enquiries</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>support@sitepilot.ai</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>partnerships@sitepilot.ai</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-sm font-semibold text-white">Regional Focus</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                SitePilot AI operates global infrastructure with dedicated regional support coverage for Nigeria and West Africa (GMT+1), the United Kingdom (GMT/BST), and North America (EST/PST).
              </p>
            </div>

            <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl text-xs text-slate-300 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>We never scrape private customer contacts or send unsolicited promotional marketing.</span>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Message Dispatched</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Thank you for reaching out. A SitePilot AI technical director will reply to {formData.email} shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tunde Adeleke"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Business Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tunde@agency.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Company / Agency Name</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Apex Digital Lagos"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Inquiry Topic</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Agency Partnership & Enterprise Inquiries">Agency Partnership & Enterprise Inquiries</option>
                    <option value="Paystack & Local Billing Support">Paystack & Local African Currency Billing</option>
                    <option value="API Integration & Custom Webhooks">API Integration & Custom Webhooks</option>
                    <option value="Technical Question">Technical Question on Lighthouse Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">How can we assist?</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your client load, agency requirements, or technical questions..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
