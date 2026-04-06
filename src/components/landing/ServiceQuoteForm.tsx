'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

interface ServiceQuoteFormProps {
  serviceName: string;
}

export function ServiceQuoteForm({ serviceName }: ServiceQuoteFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: '',
    service: serviceName,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          message: '',
          service: serviceName,
        });
      } else {
        setError('Failed to send request. Please try again or call us directly.');
      }
    } catch (err) {
      setError('An error occurred. Please try again or call us at (954) 289-6718.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSuccess) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
        <p className="text-slate-600">
          Thank you! We&apos;ll contact you within 24 hours to discuss your {serviceName} needs.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-100/80 border border-slate-700 rounded-xl p-8 sticky top-24">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Get a Free Quote</h3>
      <p className="text-slate-600 mb-6">
        Fill out the form below and we&apos;ll contact you within 24 hours
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-600 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-slate-700 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-600 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-slate-700 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            placeholder="(954) 289-6718"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-600 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-slate-700 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-slate-600 mb-2">
            Property Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-slate-700 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            placeholder="123 Main St, Pompano Beach, FL"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-slate-600 mb-2">
            Tell us about your project
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-slate-700 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition resize-none"
            placeholder="Describe your HVAC needs, timeline, or any specific questions..."
          ></textarea>
        </div>

        <input type="hidden" name="service" value={formData.service} />

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-slate-900 font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-slate-900 border-t-transparent"></span>
              Sending...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Request Free Quote
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 text-center">
          By submitting this form, you agree to be contacted about your HVAC project.
        </p>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <p className="text-sm text-slate-500 text-center mb-3">
          Prefer to call? We&apos;re here to help!
        </p>
        <a
          href="tel:+19542896718"
          className="block text-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-lg transition"
        >
          Call: (954) 289-6718
        </a>
      </div>
    </div>
  );
}
