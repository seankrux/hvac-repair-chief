'use client';

import { useState } from 'react';
import { Phone, ArrowRight, CheckCircle } from 'lucide-react';

interface CompactQuoteFormProps {
  serviceName: string;
}

export function CompactQuoteForm({ serviceName }: CompactQuoteFormProps) {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, service: serviceName }),
      });

      if (response.ok) {
        setIsSuccess(true);
      }
    } catch {
      // Silently fail - user can call instead
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-6 flex items-center gap-4">
        <CheckCircle className="h-8 w-8 text-green-400 flex-shrink-0" />
        <div>
          <p className="font-bold text-slate-900">Request Received!</p>
          <p className="text-sm text-slate-600">We&apos;ll call you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-cyan-600/10 to-cyan-700/10 border border-cyan-500/30 rounded-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Get Your Free {serviceName} Quote</h3>
          <p className="text-sm text-slate-600">Quick response within 24 hours</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 flex-1">
          <input
            type="text"
            name="name"
            required
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="flex-1 px-4 py-3 bg-white border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 text-sm"
          />
          <input
            type="tel"
            name="phone"
            required
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="flex-1 px-4 py-3 bg-white border border-slate-600 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 text-sm"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-cyan-600 hover:bg-cyan-700 text-slate-900 font-bold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : (
              <>Get Quote <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>
      </div>

      <div className="mt-4 pt-4 border-t border-cyan-500/20 flex items-center justify-center gap-2 text-sm">
        <Phone className="h-4 w-4 text-cyan-600" />
        <span className="text-slate-600">Or call now:</span>
        <a href="tel:+19542896718" className="text-cyan-600 font-bold hover:text-cyan-500">(954) 289-6718</a>
      </div>
    </div>
  );
}
