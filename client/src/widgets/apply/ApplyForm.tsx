"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller, Path, FieldErrors  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ChevronRight, ChevronLeft, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

// Define the validation schema using discriminated union for better role-based logic
const formSchema = z.discriminatedUnion('role', [
    z.object({
        role: z.literal('agency'),
        fullName: z.string().min(2, 'Representative name is required'),
        email: z.email('Invalid work email'),
        agencyName: z.string().min(2, 'Agency name is required'),
        companyWebsite: z.url('Invalid website URL'),
        linkedinCompany: z.url('Invalid LinkedIn URL'),
        teamSize: z.string().min(1, 'Team size is required'),
        foundedYear: z.string().length(4, 'Invalid year (e.g. 2024)'),
    }),
    z.object({
        role: z.enum(['developer', 'designer', 'finance', 'product', 'project']),
        fullName: z.string().min(2, 'Full name is required'),
        email: z.email('Invalid email address'),
        linkedin: z.url('Invalid LinkedIn URL'),
        experience: z.string().min(1, 'Experience is required'),
        portfolio: z.url('Invalid portfolio URL').optional().or(z.literal('')),
    }),
]);

type ApplyFormData = z.infer<typeof formSchema>;
type AgencyErrors = FieldErrors<Extract<ApplyFormData, { role: 'agency' }>>;
type TalentErrors = FieldErrors<
    Extract<ApplyFormData, { role: 'developer' | 'designer' | 'finance' | 'product' | 'project' }>
>;

interface ApplyFormProps {
  onSuccess: () => void;
}

export default function ApplyForm({ onSuccess }: ApplyFormProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        control,
        trigger,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ApplyFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: 'developer',
            fullName: '',
            email: '',
            // Talent fields
            linkedin: '',
            experience: '',
            portfolio: '',
            // Agency fields
            agencyName: '',
            companyWebsite: '',
            linkedinCompany: '',
            teamSize: '',
            foundedYear: '',
        } as ApplyFormData,
    });

    const role = watch('role');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const onSubmit = async (data: ApplyFormData) => {
        if (!resumeFile) {
            toast.error('File missing', {
                description:
                    data.role === 'agency'
                        ? 'Please upload your company profile.'
                        : 'Please upload your resume.',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataPayload = new FormData();
            formDataPayload.append('full_name', data.fullName);
            formDataPayload.append('email', data.email);

            if (data.role === 'agency') {
                formDataPayload.append('role', 'agency');
                formDataPayload.append('agency_name', data.agencyName);
                formDataPayload.append('company_website', data.companyWebsite);
                formDataPayload.append('linkedin_company_page', data.linkedinCompany);
                formDataPayload.append('team_size', data.teamSize);
                formDataPayload.append('founded_year', data.foundedYear);
            } else {
                const roleLabels: Record<string, string> = {
                    developer: 'Software Developer',
                    designer: 'Designer',
                    finance: 'Finance Expert',
                    product: 'Product Manager',
                    project: 'Project Manager'
                };
                formDataPayload.append('role', 'talent');
                formDataPayload.append('title', roleLabels[data.role] || data.role);
                formDataPayload.append('category', data.role);
                formDataPayload.append('experience', data.experience);
                formDataPayload.append('linkedin', data.linkedin);
                if (data.portfolio) formDataPayload.append('portfolio', data.portfolio);
            }

            formDataPayload.append('password', 'ChangesRequired123!');
            formDataPayload.append('resume', resumeFile);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/applications/submit`,
                {
                    method: 'POST',
                    body: formDataPayload,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit application");
            }

            toast.success("Details Submitted");
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Submission failed", {
                description: error instanceof Error ? error.message : "Something went wrong. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalSteps = role === 'agency' ? 2 : 3;
    const progress = (step / totalSteps) * 100;

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 flex">
                <motion.div
                    className="h-full bg-[#204ecf]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-12">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">Basic Information</h2>
                                <p className="text-gray-500">Let&apos;s start with the basics.</p>
                            </div>

                            {/* Role Toggle */}
                            <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 border border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setValue('role', 'developer')}
                                    className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all duration-200 ${role !== 'agency' ? 'bg-white text-[#204ecf] shadow-md scale-[1.02]' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Apply as Talent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue('role', 'agency')}
                                    className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all duration-200 ${role === 'agency' ? 'bg-white text-[#204ecf] shadow-md scale-[1.02]' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Apply as Agency
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-black font-semibold">
                                        {role === 'agency' ? 'Representative Name' : 'Full Name'}{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="fullName"
                                        {...register('fullName')}
                                        placeholder={role === 'agency' ? 'Jane Smith' : 'John Doe'}
                                        className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                    />
                                    {errors.fullName && (
                                        <p className="text-xs text-red-500 ml-1">
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-black font-semibold">
                                        {role === 'agency' ? 'Work Email' : 'Email Address'}{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register('email')}
                                        placeholder="john@example.com"
                                        className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-500 ml-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {role === 'agency' ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="agencyName"
                                                className="text-black font-semibold"
                                            >
                                                Agency Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="agencyName"
                                                {...register('agencyName' as Path<ApplyFormData>)}
                                                placeholder="Creative Solutions Ltd."
                                                className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                            />
                                            {(errors as AgencyErrors).agencyName && (
                                                <p className="text-xs text-red-500 ml-1">
                                                    {(errors as AgencyErrors).agencyName?.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="companyWebsite"
                                                className="text-black font-semibold"
                                            >
                                                Company Website{' '}
                                                <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="companyWebsite"
                                                {...register(
                                                    'companyWebsite' as Path<ApplyFormData>
                                                )}
                                                placeholder="https://agency.com"
                                                className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                            />
                                            {(errors as AgencyErrors).companyWebsite && (
                                                <p className="text-xs text-red-500 ml-1">
                                                    {
                                                        (errors as AgencyErrors).companyWebsite
                                                            ?.message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="linkedinCompany"
                                                className="text-black font-semibold"
                                            >
                                                LinkedIn Company Page{' '}
                                                <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="linkedinCompany"
                                                {...register(
                                                    'linkedinCompany' as Path<ApplyFormData>
                                                )}
                                                placeholder="https://linkedin.com/company/agency"
                                                className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                            />
                                            {(errors as AgencyErrors).linkedinCompany && (
                                                <p className="text-xs text-red-500 ml-1">
                                                    {
                                                        (errors as AgencyErrors).linkedinCompany
                                                            ?.message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="teamSize"
                                                    className="text-black font-semibold"
                                                >
                                                    Team Size{' '}
                                                    <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="teamSize"
                                                    {...register('teamSize' as Path<ApplyFormData>)}
                                                    placeholder="e.g. 15"
                                                    className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                                />
                                                {(errors as AgencyErrors).teamSize && (
                                                    <p className="text-xs text-red-500 ml-1">
                                                        {(errors as AgencyErrors).teamSize?.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="foundedYear"
                                                    className="text-black font-semibold"
                                                >
                                                    Year Founded{' '}
                                                    <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="foundedYear"
                                                    {...register(
                                                        'foundedYear' as Path<ApplyFormData>
                                                    )}
                                                    placeholder="e.g. 2015"
                                                    className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                                />
                                                {(errors as AgencyErrors).foundedYear && (
                                                    <p className="text-xs text-red-500 ml-1">
                                                        {
                                                            (errors as AgencyErrors).foundedYear
                                                                ?.message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-black font-semibold">
                                            Primary Role <span className="text-red-500">*</span>
                                        </Label>
                                        <Controller
                                            name="role"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf] text-black">
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectItem value="developer">
                                                            Software Developer
                                                        </SelectItem>
                                                        <SelectItem value="designer">
                                                            Designer
                                                        </SelectItem>
                                                        <SelectItem value="finance">
                                                            Finance Expert
                                                        </SelectItem>
                                                        <SelectItem value="product">
                                                            Product Manager
                                                        </SelectItem>
                                                        <SelectItem value="project">
                                                            Project Manager
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.role && (
                                            <p className="text-xs text-red-500 ml-1">
                                                {errors.role.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Button
                                type="button"
                                onClick={async () => {
                                    const fields: Path<ApplyFormData>[] = ['fullName', 'email'];
                                    if (role === 'agency') {
                                        fields.push(
                                            'agencyName' as Path<ApplyFormData>,
                                            'companyWebsite' as Path<ApplyFormData>,
                                            'linkedinCompany' as Path<ApplyFormData>,
                                            'teamSize' as Path<ApplyFormData>,
                                            'foundedYear' as Path<ApplyFormData>
                                        );
                                    } else {
                                        fields.push('role');
                                    }

                                    const isValid = await trigger(fields);
                                    if (isValid) {
                                        if (role === 'agency') {
                                            setStep(3);
                                        } else {
                                            nextStep();
                                        }
                                    }
                                }}
                                className="w-full h-14 bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold rounded-xl mt-8"
                            >
                                Next Step
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && role !== 'agency' && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-6">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">
                                        Professional Details
                                    </h2>
                                    <p className="text-gray-500">
                                        Tell us about your professional background.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="linkedin" className="text-black font-semibold">
                                        LinkedIn Profile URL <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="linkedin"
                                        {...register('linkedin' as Path<ApplyFormData>)}
                                        placeholder="https://linkedin.com/in/username"
                                        className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                    />
                                    {(errors as TalentErrors).linkedin && (
                                        <p className="text-xs text-red-500 ml-1">
                                            {(errors as TalentErrors).linkedin?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="portfolio" className="text-black font-semibold">
                                        Portfolio URL (Optional)
                                    </Label>
                                    <Input
                                        id="portfolio"
                                        {...register('portfolio' as Path<ApplyFormData>)}
                                        placeholder="https://yourportfolio.com"
                                        className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                    />
                                    {(errors as TalentErrors).portfolio && (
                                        <p className="text-xs text-red-500 ml-1">
                                            {(errors as TalentErrors).portfolio?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="experience"
                                        className="text-black font-semibold"
                                    >
                                        Years of Experience <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="experience"
                                        {...register('experience' as Path<ApplyFormData>)}
                                        placeholder="5"
                                        className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                    />
                                    {(errors as TalentErrors).experience && (
                                        <p className="text-xs text-red-500 ml-1">
                                            {(errors as TalentErrors).experience?.message}
                                        </p>
                                    )}
                                </div>
                            </div>

              <div className="flex gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1 h-14 border-2 border-gray-100 font-bold rounded-xl"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                    onClick={async () => {
                                        const isValid = await trigger([
                                            'linkedin' as Path<ApplyFormData>,
                                            'experience' as Path<ApplyFormData>,
                                            'portfolio' as Path<ApplyFormData>,
                                        ]);
                                        if (isValid) nextStep();
                                    }}
                  className="flex-2 h-14 bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold rounded-xl"
                >
                  Next Step
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">
                  {role === 'agency' ? "Company Profile" : "Resume & CV"}
                </h2>
                <p className="text-gray-500">
                  {role === 'agency'
                    ? "Upload your company profile/deck (PDF)."
                    : "Upload your latest resume to complete."}
                </p>
              </div>


              <div className="border-2 border-dashed border-gray-200 rounded-4xl p-12 text-center hover:border-[#204ecf] transition-colors cursor-pointer group relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#204ecf] group-hover:text-white transition-colors">
                  <Upload className="w-8 h-8 text-[#204ecf] group-hover:text-white" />
                </div>
                <p className="font-bold text-[#1a1a2e] mb-1">
                  {resumeFile
                    ? resumeFile.name
                    : role === 'agency'
                    ? "Click to upload Company Profile"
                    : "Click to upload Resume"}
                </p>
                <p className="text-sm text-gray-500">PDF, DOCX (Max 10MB)</p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <CheckCircle2 className="w-5 h-5 text-[#204ecf]" />
                <p className="text-xs text-gray-600">
                  By submitting, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => (role === 'agency' ? setStep(1) : prevStep())}
                  className="flex-1 h-14 border-2 border-gray-100 font-bold rounded-xl"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 h-14 bg-[#00c853] hover:bg-[#009624] text-white font-bold rounded-xl shadow-lg shadow-green-900/20"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
