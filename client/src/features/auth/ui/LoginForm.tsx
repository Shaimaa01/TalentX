"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuthStore } from "../model/auth.store";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ToastUtils } from "@/shared/lib/toast-utils";
import { handleFormErrors } from "@/shared/lib/form-errors";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      ToastUtils.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      handleFormErrors(error, setError);
      // Fallback general error if not handled by field errors
      if (!error.response?.data?.errors) {
        ToastUtils.error(
          error.response?.data?.message || "Invalid credentials"
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="email"
            placeholder="name@company.com"
            className="h-12 pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Link
            href="#"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="password"
            placeholder="••••••••"
            className="h-12 pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg rounded-lg shadow-lg shadow-blue-900/20"
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
};
