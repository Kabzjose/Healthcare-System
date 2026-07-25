'use client';

import React from 'react';
import Link from 'next/link';
import { Stethoscope, Star, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DoctorProfile } from '@/types';
import { formatCurrency, getInitials } from '@/lib/utils';

interface DoctorCardProps {
  doctor: DoctorProfile;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const initials = getInitials(doctor.first_name, doctor.last_name);

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-border/60 rounded-2xl group bg-white">
      {/* Top Gradient Banner with centered avatar */}
      <div className="h-24 bg-gradient-to-r from-primary-600 to-teal-600 relative flex items-center justify-center">
        <div className="absolute -bottom-6 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-white p-1 shadow-card">
            <div className="h-full w-full rounded-full bg-primary-50 text-primary-700 font-bold text-lg flex items-center justify-center border border-primary-100">
              {initials}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="pt-9 pb-4 px-5 text-center flex-1 flex flex-col items-center">
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary-600 transition-colors">
          Dr. {doctor.first_name} {doctor.last_name}
        </h3>
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mt-0.5">
          {doctor.specialization}
        </p>

        {/* Rating row (static 4.9 representation) */}
        <div className="flex items-center gap-1.5 mt-2 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-medium text-amber-800 border border-amber-200/50">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>4.9 (120+ reviews)</span>
        </div>

        {doctor.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-3 text-center">
            {doctor.bio}
          </p>
        )}

        <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border/50 text-xs">
          <div className="flex flex-col items-center p-2 rounded-xl bg-muted/40">
            <span className="text-muted-foreground text-[10px]">Experience</span>
            <span className="font-bold text-foreground mt-0.5">{doctor.years_of_experience} Years</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-primary-50/50 text-primary-900">
            <span className="text-muted-foreground text-[10px]">Consultation</span>
            <span className="font-bold text-primary-700 mt-0.5">{formatCurrency(doctor.consultation_fee)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-5 px-5 flex gap-2">
        <Button variant="outline" size="sm" asChild className="flex-1 rounded-xl text-xs">
          <Link href={`/doctors/${doctor.profile_id}`}>View Profile</Link>
        </Button>
        <Button size="sm" asChild className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold shadow-sm hover:shadow-md text-xs gap-1">
          <Link href={`/book/${doctor.profile_id}`}>
            Book Now <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};