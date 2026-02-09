"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ChevronRight, ChevronLeft, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/shared/api/client";
import { handleFormErrors } from "@/shared/lib/form-errors";

// Define the validation schema
const formSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    role: z.string().min(1, "Role is required"),

    // Agency fields
    agencyName: z.string().optional(),
    companyWebsite: z.string().optional(),
    linkedinCompany: z.string().optional(),
    teamSize: z.string().optional(),
    foundedYear: z.string().optional(),

    // Talent fields
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),
    experience: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "agency") {
      if (!data.agencyName)
        ctx.addIssue({
          code: "custom",
          path: ["agencyName"],
          message: "Agency name is required",
        });
      if (!data.companyWebsite)
        ctx.addIssue({
          code: "custom",
          path: ["companyWebsite"],
          message: "Company website is required",
        });
      if (!data.linkedinCompany)
        ctx.addIssue({
          code: "custom",
          path: ["linkedinCompany"],
          message: "LinkedIn company page is required",
        });
      if (!data.teamSize)
        ctx.addIssue({
          code: "custom",
          path: ["teamSize"],
          message: "Team size is required",
        });
      if (!data.foundedYear)
        ctx.addIssue({
          code: "custom",
          path: ["foundedYear"],
          message: "Founded year is required",
        });
    } else {
      // Talent validations

        if (!data.linkedin)
            ctx.addIssue({
            code: "custom",
            path: ["linkedin"],
            message: "LinkedIn profile is required",
            });
        if (!data.experience)
            ctx.addIssue({
            code: "custom",
            path: ["experience"],
            message: "Experience is required",
            });
    }
  });

type FormData = z.infer<typeof formSchema>;

interface ApplyFormProps {
  onSuccess: () => void;
}

export default function ApplyForm({ onSuccess }: ApplyFormProps) {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "", // default empty
      agencyName: "",
      companyWebsite: "",
      linkedinCompany: "",
      teamSize: "",
      foundedYear: "",
      linkedin: "",
      portfolio: "",
      experience: "",
    },
  });

  const role = watch("role");
  const isAgency = role === "agency";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    if (step === 1) {
      if (isAgency) {
        fieldsToValidate = [
          "fullName",
          "email",
          "role",
          "agencyName",
          "companyWebsite",
          "linkedinCompany",
          "teamSize",
          "foundedYear",
        ];
      } else {
        fieldsToValidate = ["fullName", "email", "role"];
      }
    } else if (step === 2 && !isAgency) {
      fieldsToValidate = ["linkedin", "experience", "portfolio"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    if (step === 1 && isAgency) {
      setStep(3); // Skip to upload for agency
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step === 3 && isAgency) {
      setStep(1);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!resumeFile) {
        toast.error("File missing", {
            description: isAgency ? "Please upload your company profile." : "Please upload your resume."
        });
        return;
    }

    try {
      const formData = new FormData();
      formData.append("full_name", data.fullName);
      formData.append("email", data.email);

      if (isAgency) {
        formData.append("role", "agency");
        formData.append("agency_name", data.agencyName || "");
        formData.append("company_website", data.companyWebsite || "");
        formData.append("linkedin_company_page", data.linkedinCompany || "");
        formData.append("team_size", data.teamSize || "");
        formData.append("founded_year", data.foundedYear || "");
      } else {
        const roleLabels: Record<string, string> = {
          developer: "Software Developer",
          designer: "Designer",
          finance: "Finance Expert",
          product: "Product Manager",
          project: "Project Manager",
        };
        formData.append("role", "talent");
        formData.append("title", roleLabels[data.role] || data.role);
        formData.append("category", data.role);
        formData.append("experience", data.experience || "");
        formData.append("linkedin", data.linkedin || "");
        if (data.portfolio) formData.append("portfolio", data.portfolio);
      }

      formData.append("password", "ChangesRequired123!");
      formData.append("resume", resumeFile);

      await apiClient.post("/applications/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        _suppressToast: true,
      });

      toast.success("Details Submitted");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      handleFormErrors(error, setError);
      
      // Fallback if no field errors were mapped (e.g. 500 or logic error)
      if (!error.response?.data?.errors) {
         toast.error(error.message || "Submission failed");
      }
    }
  };

  const totalSteps = isAgency ? 2 : 3;

  let currentProgressStep = step;
  if (isAgency && step === 3) currentProgressStep = 2;

  const progress = (currentProgressStep / totalSteps) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-100 flex">
        <motion.div
          className="h-full bg-[#204ecf]"
          initial={{ width: "0%" }}
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
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">
                  Basic Information
                </h2>
                <p className="text-gray-500">Let's start with the basics.</p>
              </div>

              {/* Role Toggle */}
              <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 border border-gray-100">
                <button
                  type="button"
                  onClick={() => setValue("role", "developer", { shouldValidate: true })}
                  className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all duration-200 ${
                    !isAgency
                      ? "bg-white text-[#204ecf] shadow-md scale-[1.02]"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Apply as Talent
                </button>
                <button
                  type="button"
                  onClick={() => setValue("role", "agency", { shouldValidate: true })}
                  className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all duration-200 ${
                    isAgency
                      ? "bg-white text-[#204ecf] shadow-md scale-[1.02]"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Apply as Agency
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-black font-semibold">
                    {isAgency ? "Representative Name" : "Full Name"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder={isAgency ? "Jane Smith" : "John Doe"}
                    className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                    error={errors.fullName?.message}
                    {...register("fullName")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black font-semibold">
                    {isAgency ? "Work Email" : "Email Address"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>

                {isAgency ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="agencyName" className="text-black font-semibold">
                        Agency Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="agencyName"
                        placeholder="Creative Solutions Ltd."
                        className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                        error={errors.agencyName?.message}
                        {...register("agencyName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite" className="text-black font-semibold">
                        Company Website <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="companyWebsite"
                        placeholder="https://agency.com"
                        className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                        error={errors.companyWebsite?.message}
                        {...register("companyWebsite")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedinCompany" className="text-black font-semibold">
                        LinkedIn Company Page <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="linkedinCompany"
                        placeholder="https://linkedin.com/company/agency"
                        className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                        error={errors.linkedinCompany?.message}
                        {...register("linkedinCompany")}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teamSize" className="text-black font-semibold">
                          Team Size <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="teamSize"
                          type="number"
                          placeholder="e.g. 15"
                          className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                          error={errors.teamSize?.message}
                          {...register("teamSize")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="foundedYear" className="text-black font-semibold">
                          Year Founded <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="foundedYear"
                          type="number"
                          placeholder="e.g. 2015"
                          className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                          error={errors.foundedYear?.message}
                          {...register("foundedYear")}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-black font-semibold">
                      Primary Role <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <select
                        id="role"
                        className={`w-full h-12 rounded-xl text-black border px-4 focus:outline-none focus:border-[#204ecf] focus:ring-1 focus:ring-[#204ecf] bg-white text-sm ${
                            errors.role ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                        }`}
                        {...register("role")}
                        >
                        <option value="">Select a role</option>
                        <option value="developer">Software Developer</option>
                        <option value="designer">Designer</option>
                        <option value="finance">Finance Expert</option>
                        <option value="product">Product Manager</option>
                        <option value="project">Project Manager</option>
                        </select>
                         {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="button"
                onClick={nextStep}
                className="w-full h-14 bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold rounded-xl mt-8"
              >
                Next Step
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 2 && !isAgency && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
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
                  placeholder="https://linkedin.com/in/username"
                  className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                  error={errors.linkedin?.message}
                  {...register("linkedin")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio" className="text-black font-semibold">
                  Portfolio URL (Optional)
                </Label>
                <Input
                  id="portfolio"
                  placeholder="https://yourportfolio.com"
                  className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                  error={errors.portfolio?.message}
                  {...register("portfolio")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-black font-semibold">
                  Years of Experience <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="5"
                  className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                  error={errors.experience?.message}
                  {...register("experience")}
                />
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
                  onClick={nextStep}
                  className="flex-[2] h-14 bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold rounded-xl"
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
                  {isAgency ? "Company Profile" : "Resume & CV"}
                </h2>
                <p className="text-gray-500">
                  {isAgency
                    ? "Upload your company profile/deck (PDF)."
                    : "Upload your latest resume to complete."}
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center hover:border-[#204ecf] transition-colors cursor-pointer group relative">
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
                    : isAgency
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
                  onClick={prevStep}
                  className="flex-1 h-14 border-2 border-gray-100 font-bold rounded-xl"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] h-14 bg-[#00c853] hover:bg-[#009624] text-white font-bold rounded-xl shadow-lg shadow-green-900/20"
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
