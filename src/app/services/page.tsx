'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Stethoscope, Heart, Sparkles, Baby, Bone, Smile, ArrowRight, CheckCircle2 } from 'lucide-react';

const serviceCategories = [
  {
    name: 'General Consultation',
    icon: Stethoscope,
    description: 'Comprehensive health check-ups, preventive advice, and diagnosis for routine or general health concerns.',
    conditions: ['Routine Check-ups', 'Flu & Respiratory Infections', 'Blood Pressure Screening', 'Lifestyle & Nutrition Guidance'],
    fee: 'From KES 2,000',
  },
  {
    name: 'Cardiology',
    icon: Heart,
    description: 'Specialized diagnostic tests and treatment for heart conditions, hypertension, and cardiovascular diseases.',
    conditions: ['Hypertension & High Cholesterol', 'Arrhythmia & Palpitations', 'ECG & Echocardiogram Analysis', 'Post-Heart Surgery Follow-up'],
    fee: 'From KES 4,500',
  },
  {
    name: 'Dermatology',
    icon: Sparkles,
    description: 'Diagnosis and care for conditions affecting the skin, hair, and nails, including aesthetic consultations.',
    conditions: ['Acne & Eczema', 'Psoriasis Treatment', 'Skin Allergies', 'Cosmetic Skin Assessments'],
    fee: 'From KES 3,500',
  },
  {
    name: 'Paediatrics & Child Care',
    icon: Baby,
    description: 'Medical care dedicated to infants, children, and adolescents, including developmental assessments.',
    conditions: ['Childhood Immunizations', 'Growth & Development Tracking', 'Paediatric Infections', 'Allergy Management'],
    fee: 'From KES 2,500',
  },
  {
    name: 'Orthopaedics',
    icon: Bone,
    description: 'Surgical and non-surgical treatments for musculoskeletal disorders, joint replacement, and sports injuries.',
    conditions: ['Joint & Back Pain', 'Fracture Rehabilitation', 'Arthritis Management', 'Sports Medicine'],
    fee: 'From KES 4,000',
  },
  {
    name: 'Dental Care',
    icon: Smile,
    description: 'Preventative, restorative, and cosmetic dental treatments performed by experienced dental specialists.',
    conditions: ['Teeth Cleaning & Scaling', 'Root Canal & Fillings', 'Cosmetic Whitening', 'Orthodontic Assessments'],
    fee: 'From KES 3,000',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary-900 text-white py-20">
          <div className="section-container text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-700 text-xs font-semibold uppercase tracking-wider text-primary-200">
              Medical Specialties
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Comprehensive Medical Services
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore specialized medical departments and book direct consultations with board-certified doctors.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-slate-50/50">
          <div className="section-container space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCategories.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="stat-card flex flex-col justify-between space-y-6 hover:shadow-card-hover transition-all border border-border/60">
                    <div className="space-y-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
                        <Icon className="h-7 w-7 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                        <p className="text-xs font-semibold text-teal-600 mt-0.5">{item.fee}</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-border/40">
                        <p className="text-xs font-bold text-foreground">Conditions Treated:</p>
                        <ul className="space-y-1.5 text-xs text-muted-foreground">
                          {item.conditions.map((c) => (
                            <li key={c} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <Button asChild className="w-full rounded-xl bg-primary-600 hover:bg-primary-700 text-xs font-semibold gap-1.5">
                        <Link href={`/doctors?specialization=${encodeURIComponent(item.name)}`}>
                          Find {item.name} Specialist <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
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
