'use client';

import Link from 'next/link';
import { Stethoscope, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DoctorProfile } from '@/types';
import { formatCurrency, getInitials } from '@/lib/utils';

interface DoctorCardProps {
  doctor: DoctorProfile;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(doctor.first_name, doctor.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">
              Dr. {doctor.first_name} {doctor.last_name}
            </p>
            <p className="text-sm text-primary font-medium truncate">
              {doctor.specialization}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2 pb-3">
        {doctor.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>
        )}

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span>{doctor.years_of_experience} years experience</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Stethoscope className="h-4 w-4" />
          <span>{doctor.specialization}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{formatCurrency(doctor.consultation_fee)} / visit</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/doctors/${doctor.profile_id}`}>View Profile & Book</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};