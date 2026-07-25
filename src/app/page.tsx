'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  ArrowRight,
  Star,
  CheckCircle2,
  UserPlus,
  Search,
  CalendarCheck,
  Stethoscope,
  Heart,
  Sparkles,
  Baby,
  Bone,
  Smile,
  Plus,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { DoctorCard } from '@/components/doctors/DoctorsCard';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { useDoctors } from '@/hooks/useDoctors';

const services = [
  {
    icon: Stethoscope,
    name: 'General Consultation',
    description: 'Comprehensive health check-ups and personalized treatment plans for everyday health needs.',
  },
  {
    icon: Heart,
    name: 'Cardiology',
    description: 'Expert cardiac diagnostic assessments, ECGs, and heart health management plans.',
  },
  {
    icon: Sparkles,
    name: 'Dermatology',
    description: 'Advanced skin treatments, acne care, cosmetic consultations, and dermatological surgery.',
  },
  {
    icon: Baby,
    name: 'Paediatrics & Child Care',
    description: 'Specialized healthcare, immunization, and growth monitoring for infants and children.',
  },
  {
    icon: Bone,
    name: 'Orthopaedics',
    description: 'Bone, joint, and spine care including sports injuries and rehabilitation services.',
  },
  {
    icon: Smile,
    name: 'Dental Care',
    description: 'Complete oral health solutions from preventative routine cleaning to cosmetic dentistry.',
  },
];

const testimonials = [
  {
    image: '/images/testimonial-1.jpg',
    name: 'Amina Mohamed',
    location: 'Nairobi, Kenya',
    rating: 5,
    quote: 'MediCare+ transformed how I manage my family healthcare. Booking a specialist took under two minutes, and the consultation was top class.',
  },
  {
    image: '/images/testimonial-2.jpg',
    name: 'David Ochieng',
    location: 'Mombasa, Kenya',
    rating: 5,
    quote: 'The M-Pesa payment integration and automated SMS reminders made my appointment experience completely seamless. Highly recommended!',
  },
  {
    image: '/images/testimonial-3.jpg',
    name: 'Grace Wambui',
    location: 'Kisumu, Kenya',
    rating: 5,
    quote: 'As someone with a busy schedule, being able to see doctor availability in real-time saved me hours of phone calls and waiting.',
  },
];

export default function LandingPage() {
  const { data: doctorsData } = useDoctors({ limit: 4 });
  const doctors = doctorsData?.data ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* 2b. Hero Section */}
        <section className="relative overflow-hidden gradient-hero py-12 lg:py-20 border-b border-border/40">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column Text */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary-700 shadow-xs backdrop-blur-xs">
                  <ShieldCheck className="h-4 w-4 text-primary-600" />
                  <span>Trusted Healthcare Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary-900 leading-[1.1]">
                  Quality Healthcare <br className="hidden sm:inline" />
                  <span className="text-primary-600">You Can Trust</span>
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Connect with verified medical specialists, book real-time appointments, and manage your health consultations effortlessly in one secure platform.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8 bg-primary-600 hover:bg-primary-700 shadow-card text-base font-bold h-13">
                    <Link href="/doctors">
                      Book Appointment <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 border-primary-200 text-primary-800 hover:bg-primary-50 text-base font-semibold h-13">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>

              {/* Right Column Image & Overlays */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Hero Doctor Image Container */}
                  <div className="relative rounded-3xl overflow-hidden shadow-card-strong border-4 border-white aspect-[4/5] bg-primary-100">
                    <OptimizedImage
                      src="/images/hero-doctor.jpg"
                      alt="Doctor Consultation"
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>

                  {/* Top-Right Floating Doctor Card */}
                  <div className="absolute -top-4 -right-4 sm:top-4 sm:-right-6 glass-card p-3 rounded-2xl flex items-center gap-3 shadow-card-strong animate-in fade-in zoom-in duration-500">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      JW
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Dr. Jane W.</p>
                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available Today
                      </span>
                    </div>
                  </div>

                  {/* Bottom-Left Floating Stats Card */}
                  <div className="absolute -bottom-6 -left-4 sm:bottom-6 sm:-left-6 glass-card p-4 rounded-2xl shadow-card-strong flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="h-12 w-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-extrabold text-lg shadow-card">
                      10+
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Years Experience</p>
                      <p className="text-xs text-muted-foreground font-medium">25+ Expert Doctors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2c. Stats Bar */}
        <section className="bg-white border-b border-border/60 py-10">
          <div className="section-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-border/60">
              <div className="p-2">
                <p className="text-3xl sm:text-4xl font-extrabold text-primary-600">10+</p>
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">Years Experience</p>
              </div>
              <div className="p-2 pt-6 sm:pt-2">
                <p className="text-3xl sm:text-4xl font-extrabold text-primary-600">25+</p>
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">Expert Doctors</p>
              </div>
              <div className="p-2 pt-6 sm:pt-2">
                <p className="text-3xl sm:text-4xl font-extrabold text-primary-600">15K+</p>
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">Patients Served</p>
              </div>
              <div className="p-2 pt-6 sm:pt-2">
                <p className="text-3xl sm:text-4xl font-extrabold text-primary-600">5+</p>
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">Clinic Locations</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2d. Services Section */}
        <section className="py-20 bg-slate-50/50">
          <div className="section-container space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Our <span className="relative inline-block text-primary-600">Services<span className="absolute bottom-0 left-0 right-0 h-1 bg-teal-500 rounded-full" /></span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Comprehensive healthcare services designed around your wellbeing and lifestyle
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="stat-card hover:shadow-card-hover transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                        <Icon className="h-7 w-7 stroke-[2]" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-border/40">
                      <Link
                        href={`/doctors?specialization=${encodeURIComponent(item.name)}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors"
                      >
                        Learn More <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2e. Why Choose Us Section */}
        <section className="py-20 bg-white">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Image */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-card-strong aspect-[4/3]">
                  <OptimizedImage
                    src="/images/clinic-interior.jpg"
                    alt="Modern Clinic Interior"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Floating Rating Badge Bottom-Right */}
                <div className="absolute -bottom-6 -right-2 sm:bottom-6 sm:right-6 glass-card p-4 rounded-2xl shadow-card-strong flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Star className="h-6 w-6 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">4.9★ Patient Rating</p>
                    <p className="text-xs text-muted-foreground">Based on 2,000+ reviews</p>
                  </div>
                </div>
              </div>

              {/* Right Features */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Why Choose Us</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                    World-Class Care Tailored To Your Needs
                  </h2>
                </div>

                <div className="space-y-4 pt-2">
                  {[
                    { title: 'Experienced & Verified Doctors', desc: 'All medical doctors are fully board-certified with years of clinical expertise.' },
                    { title: 'Advanced Medical Technology', desc: 'Equipped with modern diagnostic tools and digital health integrations.' },
                    { title: 'Patient-Centered Care', desc: 'Compassionate, personalized treatment plans prioritizing comfort and wellness.' },
                    { title: '24/7 Support & Scheduling', desc: 'Round-the-clock digital appointment management and emergency support.' },
                  ].map((feature) => (
                    <div key={feature.title} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="h-9 w-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5 border border-teal-100">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-foreground">{feature.title}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2f. Featured Doctors Section */}
        <section className="py-20 bg-slate-50/50">
          <div className="section-container space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                Meet Our Doctors
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Consult with our leading board-certified specialists
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.length > 0
                ? doctors.slice(0, 4).map((doc) => <DoctorCard key={doc.profile_id} doctor={doc} />)
                : Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-80 rounded-2xl bg-white animate-pulse border border-border/50" />
                  ))}
            </div>

            <div className="text-center pt-4">
              <Button asChild size="lg" className="rounded-full px-8 bg-primary-600 hover:bg-primary-700 font-bold">
                <Link href="/doctors">View All Doctors</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 2g. How It Works Section */}
        <section className="py-20 bg-white">
          <div className="section-container space-y-16">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                How It Works
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Book your appointment in three simple steps
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {/* Connector line on desktop */}
              <div className="hidden md:block absolute top-1/3 left-1/6 right-1/6 h-0.5 border-t-2 border-dashed border-primary-200 -z-0" />

              {[
                { step: '1', title: 'Create Account', desc: 'Sign up securely in under a minute with basic details.', icon: UserPlus },
                { step: '2', title: 'Find a Doctor', desc: 'Filter specialists by department, consultation fee, or rating.', icon: Search },
                { step: '3', title: 'Book Appointment', desc: 'Select your preferred time slot and confirm instant booking.', icon: CalendarCheck },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="relative z-10 flex flex-col items-center space-y-4 p-6 bg-white rounded-2xl">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-3xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-card border border-primary-100">
                        <Icon className="h-9 w-9 stroke-[2]" />
                      </div>
                      <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2h. Testimonials Section */}
        <section className="py-20 bg-slate-50/50">
          <div className="section-container space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                What Our Patients Say
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Real feedback from patients who trust MediCare+
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <div key={idx} className="stat-card flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/90 italic leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden shrink-0 border border-primary-100">
                      <OptimizedImage src={t.image} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2i. CTA Banner */}
        <section className="bg-primary-600 text-white py-16">
          <div className="section-container text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-primary-100 text-base sm:text-lg leading-relaxed">
              Join thousands of patients who trust MediCare+ for fast, reliable, and professional healthcare services.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8 bg-white text-primary-700 hover:bg-primary-50 font-bold h-13 text-base shadow-card">
                <Link href="/doctors">Book Appointment</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 border-white text-white hover:bg-white/10 font-semibold h-13 text-base">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* 2j. Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
        <div className="section-container space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo + Tagline */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">
                  <Plus className="h-6 w-6 stroke-[3]" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  MediCare<span className="text-primary-400">+</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Kenya’s premier digital healthcare system connecting patients with top board-certified doctors for consultations and treatments.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/doctors" className="hover:text-white transition-colors">Find Doctors</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-white uppercase tracking-wider">Services</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/services" className="hover:text-white transition-colors">General Consultation</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Cardiology</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Dermatology</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Paediatrics</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Dental Care</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</p>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-primary-400 shrink-0 mt-1" />
                  <span>Upper Hill Medical Centre, Nairobi, Kenya</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-primary-400 shrink-0" />
                  <span>+254 700 123 456</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-primary-400 shrink-0" />
                  <span>support@medicare.co.ke</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} MediCare+. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
