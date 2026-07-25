'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you! Your message has been sent. Our team will contact you shortly.');
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-16">
          <div className="section-container text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-600/80 text-xs font-semibold uppercase tracking-wider text-primary-200">
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Contact MediCare+</h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Have questions or need assistance? Reach out to our customer care or clinical support team.
            </p>
          </div>
        </section>

        <section className="py-16 bg-slate-50/50">
          <div className="section-container space-y-12">
            {/* 3 Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat-card flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Phone Support</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">+254 700 123 456</p>
                  <p className="text-[11px] text-teal-600 font-semibold mt-1">24/7 Helpline Available</p>
                </div>
              </div>

              <div className="stat-card flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Email Inquiry</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">support@medicare.co.ke</p>
                  <p className="text-[11px] text-teal-600 font-semibold mt-1">Response within 2 hours</p>
                </div>
              </div>

              <div className="stat-card flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Main Clinic</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Upper Hill Medical Centre</p>
                  <p className="text-[11px] text-primary-700 font-semibold mt-1">Nairobi, Kenya</p>
                </div>
              </div>
            </div>

            {/* Form + Map & Working Hours */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-border/60 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Send Us a Message</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Fill out the form below and our staff will respond promptly.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                    <h3 className="font-bold text-lg">Message Sent Successfully!</h3>
                    <p className="text-xs text-emerald-700 max-w-md mx-auto">
                      Thank you for contacting MediCare+. We have received your inquiry and will reach back via email or phone.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="rounded-xl border-emerald-300 text-emerald-800">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Your Full Name</label>
                        <Input
                          required
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Email Address</label>
                        <Input
                          required
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Phone Number</label>
                        <Input
                          placeholder="+254 712 345678"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Subject</label>
                        <Input
                          required
                          placeholder="General Inquiry"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Message</label>
                      <Textarea
                        required
                        rows={4}
                        placeholder="How can we assist you today?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="rounded-xl resize-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full rounded-xl bg-primary-600 hover:bg-primary-700 font-bold gap-2">
                      <Send className="h-4 w-4" /> Send Message
                    </Button>
                  </form>
                )}
              </div>

              {/* Working Hours & Map */}
              <div className="lg:col-span-5 space-y-6">
                {/* Working Hours Card */}
                <div className="bg-white p-6 rounded-3xl shadow-card border border-border/60 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">Clinic Hours</h3>
                  </div>

                  <div className="divide-y divide-border/50 text-xs sm:text-sm">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-muted-foreground font-medium">Monday – Friday</span>
                      <span className="font-bold text-foreground">8:00 AM – 8:00 PM</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-muted-foreground font-medium">Saturday</span>
                      <span className="font-bold text-foreground">9:00 AM – 5:00 PM</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-muted-foreground font-medium">Sunday & Holidays</span>
                      <span className="font-bold text-red-600">Emergency Only</span>
                    </div>
                  </div>
                </div>

                {/* Google Maps Iframe Embed */}
                <div className="bg-white p-2 rounded-3xl shadow-card border border-border/60 overflow-hidden aspect-[4/3] relative">
                  <iframe
                    title="Nairobi Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.27744388147!2d36.815!3d-1.286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d720b0c6e1%3A0xb21469e38d7d3d78!2sUpper%20Hill%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '1.25rem' }}
                    allowFullScreen={false}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-xs">
        <p>© {new Date().getFullYear()} MediCare+. All rights reserved.</p>
      </footer>
    </div>
  );
}
