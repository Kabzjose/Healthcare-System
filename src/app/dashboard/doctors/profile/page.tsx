'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { number, z } from 'zod';
import { Stethoscope, BadgeCheck, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import {
  useMyDoctorProfile,
  useCreateDoctorProfile,
  useUpdateDoctorProfile,
} from '@/hooks/useDoctors';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

// ── Validation schema ─────────────────────────────────────────────────────────
const profileSchema = z.object({
  specialization: z
    .string({error: 'Specialization is required' })
    .min(3, 'Specialization must be at least 3 characters'),

  license_number: z
    .string({ error: 'License number is required' })
    .min(4, 'Enter a valid license number'),

  bio: z
    .string()
    .max(1000, 'Bio cannot exceed 1000 characters')
    .optional(),

  consultation_fee: z
    .string({ error: 'Consultation fee is required' })
    .min(1, 'Consultation fee is required')
    .refine((val) => {
      const n = Number(val);
      return !Number.isNaN(n) && n >= 0;
    }, 'Fee must be a non-negative number'),

  years_of_experience: z
    .string()
    .optional()
    .default('0')
    .refine((val) => {
      const n = Number(val);
      return !Number.isNaN(n) && n >= 0;
    }, 'Must be 0 or more'),
});

type ProfileFormValues = z.input<typeof profileSchema>;

// ── Specialization options ────────────────────────────────────────────────────
const SPECIALIZATIONS = [
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Gynaecology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopaedics',
  'Paediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Surgery',
  'Urology',
];

export default function DoctorProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch existing profile — will return 404 if not created yet
  const { data: profile, isLoading, error } = useMyDoctorProfile();

  const hasProfile = !!profile && !error;
  const showForm = !hasProfile || isEditing;

  const { mutateAsync: createProfile, isPending: isCreating, error: createError } =
    useCreateDoctorProfile();

  const { mutateAsync: updateProfile, isPending: isUpdating, error: updateError } =
    useUpdateDoctorProfile();

  const isPending = isCreating || isUpdating;
  const apiError = (createError || updateError) as AxiosError<{ message: string }> | null;
  const errorMessage = apiError?.response?.data?.message ?? apiError?.message;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Pre-fill form when editing existing profile
  useEffect(() => {
    if (profile && isEditing) {
      reset({
        specialization: profile.specialization,
        license_number: '', // never pre-fill license for security
        bio: profile.bio ?? '',
        consultation_fee: profile.consultation_fee ? String(profile.consultation_fee) : '',
        years_of_experience: profile.years_of_experience ? String(profile.years_of_experience) : '0',
      });
    }
  }, [profile, isEditing, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      if (hasProfile) {
        await updateProfile({
          specialization: values.specialization,
          bio: values.bio,
          consultation_fee: values.consultation_fee as unknown as number,
          years_of_experience: values.years_of_experience as unknown as number,
        });
        toast({ title: 'Profile updated successfully' });
        setIsEditing(false);
      } else {
        await createProfile({
          specialization: values.specialization,
          license_number: values.license_number,
          bio: values.bio,
          consultation_fee: values.consultation_fee as unknown as number,
          years_of_experience: (values.years_of_experience ?? 0) as unknown as number,
        });
        toast({
          title: 'Profile created',
          description: 'You can now set your availability slots.',
        });
      }
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {hasProfile ? 'My Profile' : 'Complete Your Profile'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {hasProfile
              ? 'Your information visible to patients'
              : 'Fill in your details so patients can find and book you'}
          </p>
        </div>

        {hasProfile && !isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="shrink-0"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* ── View mode — show profile details ─────────────────────────────── */}
      {hasProfile && !isEditing && profile && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Stethoscope className="h-4 w-4 text-primary" />
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Specialization
                  </p>
                  <p className="mt-1 font-medium">{profile.specialization}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Experience
                  </p>
                  <p className="mt-1 font-medium">{profile.years_of_experience} years</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Consultation Fee
                  </p>
                  <p className="mt-1 font-medium text-primary">
                    {formatCurrency(profile.consultation_fee)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Profile ID
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground truncate">
                    {profile.profile_id}
                  </p>
                </div>
              </div>

              {profile.bio && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                    Bio
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next step prompt */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <BadgeCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Profile complete</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Next step — set your{' '}
                    <a
                      href="/dashboard/doctor/availability"
                      className="text-primary font-medium underline underline-offset-2"
                    >
                      availability slots
                    </a>{' '}
                    so patients can book appointments with you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Form mode — create or edit ────────────────────────────────────── */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {hasProfile ? 'Edit Your Details' : 'Doctor Profile Setup'}
            </CardTitle>
            {!hasProfile && (
              <CardDescription>
                This information will be shown to patients browsing for a doctor.
              </CardDescription>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Specialization */}
              <div>
                <Label htmlFor="specialization" className="mb-1.5 block">
                  Specialization <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="specialization"
                  placeholder="e.g. Cardiology, General Practice"
                  list="specialization-options"
                  {...register('specialization')}
                />
                {/* Datalist gives suggestions without locking the field */}
                <datalist id="specialization-options">
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
                {errors.specialization && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.specialization.message}
                  </p>
                )}
              </div>

              {/* License number — only on creation, not editable after */}
              {!hasProfile && (
                <div>
                  <Label htmlFor="license_number" className="mb-1.5 block">
                    Medical License Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="license_number"
                    placeholder="e.g. KE-MED-2024-001"
                    {...register('license_number')}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your license number cannot be changed after submission
                  </p>
                  {errors.license_number && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.license_number.message}
                    </p>
                  )}
                </div>
              )}

              {/* Consultation fee + experience — side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="consultation_fee" className="mb-1.5 block">
                    Consultation Fee (KES) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="consultation_fee"
                    type="number"
                    min="0"
                    placeholder="e.g. 3500"
                    {...register('consultation_fee')}
                  />
                  {errors.consultation_fee && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.consultation_fee.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="years_of_experience" className="mb-1.5 block">
                    Years of Experience
                  </Label>
                  <Input
                    id="years_of_experience"
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    {...register('years_of_experience')}
                  />
                  {errors.years_of_experience && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.years_of_experience.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio" className="mb-1.5 block">
                  Bio{' '}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell patients about your background, approach to care, areas of expertise..."
                  className="resize-none"
                  {...register('bio')}
                />
                {errors.bio && (
                  <p className="text-xs text-red-600 mt-1">{errors.bio.message}</p>
                )}
              </div>

              {/* Error */}
              {errorMessage && <ErrorMessage message={errorMessage} />}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      {hasProfile ? 'Saving...' : 'Creating profile...'}
                    </span>
                  ) : hasProfile ? (
                    'Save Changes'
                  ) : (
                    'Create Profile'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}