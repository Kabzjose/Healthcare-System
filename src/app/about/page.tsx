'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { DoctorCard } from '@/components/doctors/DoctorsCard';
import { Button } from '@/components/ui/button';
import { Heart, ShieldCheck, Award, Lightbulb, Target, Eye, Calendar, ArrowRight } from 'lucide-react';
import { useDoctors } from '@/hooks/useDoctors';

export default function AboutPage() {
  const { data: doctorsData } = useDoctors({ limit: 4 });
  const doctors = doctorsData?.data ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* 3a. Hero Section with dark overlay */}
        <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40">
            <OptimizedImage
              src="/images/about-hero.jpg"
              alt="Medical Team"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="relative z-10 section-container text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-600/80 text-xs font-semibold uppercase tracking-wider">
              About MediCare+
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Transforming Healthcare Access Across Kenya
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              We connect patients with qualified healthcare professionals, streamlining medical appointments and treatment management.
            </p>
          </div>
        </section>

        {/* 3b. Mission & Vision Section */}
        <section className="py-20 bg-white">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                      <Target className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    To make quality healthcare easily accessible, transparent, and efficient for every patient by combining modern digital tools with exceptional clinical expertise.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Eye className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    To be East Africa&apos;s most trusted healthcare technology ecosystem, recognized for clinical excellence, patient satisfaction, and health innovation.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-card-strong aspect-[4/3]">
                  <OptimizedImage
                    src="/images/team-meeting.jpg"
                    alt="Medical Team Meeting"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3c. Core Values Section */}
        <section className="py-20 bg-slate-50/50">
          <div className="section-container space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                Our Core Values
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                The principles guiding our care delivery every day
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Compassion', desc: 'Empathy and human warmth at every stage of patient care.', icon: Heart },
                { title: 'Excellence', desc: 'Uncompromising clinical standards and continuous medical training.', icon: Award },
                { title: 'Integrity', desc: 'Transparent pricing, strict data privacy, and ethical practice.', icon: ShieldCheck },
                { title: 'Innovation', desc: 'Leveraging technology to remove friction from health management.', icon: Lightbulb },
              ].map((val) => {
                const Icon = val.icon;
                return (
                  <div key={val.title} className="stat-card space-y-4 hover:shadow-card-hover transition-all">
                    <div className="h-12 w-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{val.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3d. Team Stats Bar */}
        <section className="bg-primary-600 text-white py-12">
          <div className="section-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold">2020</p>
                <p className="text-xs sm:text-sm font-medium text-primary-100 mt-1">Founded In</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold">25+</p>
                <p className="text-xs sm:text-sm font-medium text-primary-100 mt-1">Verified Doctors</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold">15,000+</p>
                <p className="text-xs sm:text-sm font-medium text-primary-100 mt-1">Happy Patients</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold">99%</p>
                <p className="text-xs sm:text-sm font-medium text-primary-100 mt-1">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3e. Featured Team */}
        <section className="py-20 bg-white">
          <div className="section-container space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold text-foreground">Meet Our Medical Leadership</h2>
              <p className="text-muted-foreground text-sm">Board-certified specialists leading clinical excellence</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.length > 0
                ? doctors.slice(0, 4).map((doc) => <DoctorCard key={doc.profile_id} doctor={doc} />)
                : Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
                  ))}
            </div>
          </div>
        </section>

        {/* 3f. Story Timeline */}
        <section className="py-20 bg-slate-50/50">
          <div className="section-container space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold text-foreground">Our Journey</h2>
              <p className="text-muted-foreground text-sm">Key milestones in our history</p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {[
                { year: '2020', title: 'Founded', desc: 'Launched as a digital clinic scheduling tool in Nairobi.' },
                { year: '2021', title: 'M-Pesa Integration', desc: 'Integrated instant local mobile payment processing.' },
                { year: '2023', title: '10K Patients', desc: 'Crossed milestone of 10,000 completed consultations.' },
                { year: '2025+', title: 'Nationwide Expansion', desc: 'Expanding specialized health services across Kenya.' },
              ].map((m) => (
                <div key={m.year} className="stat-card space-y-2">
                  <span className="text-2xl font-extrabold text-primary-600">{m.year}</span>
                  <h3 className="font-bold text-foreground text-base">{m.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                </div>
              ))}
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
