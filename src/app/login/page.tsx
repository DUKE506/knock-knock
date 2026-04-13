"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn } from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { loginUser } from "@/lib/api/user";
import { loginAdmin, fetchAdminProfile } from "@/lib/api/admin/admin";
import { AuthUser, useAuthStore } from "@/store/useAuthStore";

// 로그인 폼 스키마
const loginSchema = z.object({
  email: z.string().email("이메일 형식을 확인해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<"admin" | "client">("client");
  const { setUser, setTokens } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    // 현재 로그인 모드 확인
    if (loginType === "admin") {
      //슈퍼관리자
      try {
        const { data: tokens, error } = await loginAdmin(data);

        if (error || !tokens) {
          toast.error("이메일 또는 비밀번호가 일치하지 않습니다.");
          return;
        }

        setTokens(tokens.accessToken, tokens.refreshToken);

        const { data: profile, error: profileError } = await fetchAdminProfile();
        if (profileError || !profile) {
          toast.error("사용자 정보 조회에 실패했습니다.");
          return;
        }

        const authUser: AuthUser = {
          id: profile.adminSeq,
          name: profile.name,
          email: profile.loginId,
          isAdmin: true,
          role: "슈퍼관리자",
          deptName: profile.deptName,
          job: profile.job,
        };
        setUser(authUser);
        toast.success("로그인 성공!");
        router.push("/admin/clients");
      } catch (err) {
        toast.error("로그인에 실패했습니다.");
      }
    } else {
      //클라이언트
      try {
        const { user, error } = await loginUser(data.email, data.password);

        if (error || !user) {
          toast.error("이메일 또는 비밀번호가 일치하지 않습니다.");
          return;
        }

        //공통 AuthUser 타입 변환
        const authUser: AuthUser = {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          isAdmin: false,
          workplaceId: user.workplace_id,
          role: "메인",
          workplaceName: user.workplaces.name,
        };

        setUser(authUser);

        // 로그인 성공
        // localStorage.setItem("user", JSON.stringify(user));
        toast.success("로그인 성공!");

        router.push("/manager/card-requests");
      } catch (error) {
        toast.error("로그인에 실패했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text">Knock-Knock</h1>
          <p className="text-sm text-text-3 mt-2">모바일 출입 관리 시스템</p>
        </div>

        {/* Login Type Switch */}
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setLoginType("client")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              loginType === "client"
                ? "bg-accent text-white"
                : "text-text-2 hover:text-text hover:bg-bg"
            }`}
          >
            클라이언트
          </button>
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              loginType === "admin"
                ? "bg-accent text-white"
                : "text-text-2 hover:text-text hover:bg-bg"
            }`}
          >
            슈퍼관리자
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
          {/* 슈퍼관리자 표시 */}
          {loginType === "admin" && (
            <div className="mb-4 p-3 bg-accent-dim border border-accent/20 rounded-md">
              <div className="flex items-center gap-2 text-accent text-sm">
                <span className="font-medium">🔐 슈퍼관리자 로그인</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 이메일 */}
            <Input
              label="이메일"
              type="email"
              placeholder="example@email.com"
              {...register("email")}
              error={errors.email?.message}
              disabled={isSubmitting}
              required
            />

            {/* 비밀번호 */}
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...register("password")}
              error={errors.password?.message}
              disabled={isSubmitting}
              required
            />

            {/* 로그인 버튼 */}
            <Button
              variant="primary"
              title="로그인"
              type="submit"
              isLoading={isSubmitting}
              disabled={!isValid}
              className="w-full"
            />
          </form>

          {/* 회원가입 링크 (클라이언트만) */}
          {loginType === "client" && (
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-3 mb-3">
                아직 계정이 없으신가요?
              </p>
              <Link href="/auth/register">
                <Button
                  variant="secondary"
                  title="회원가입"
                  className="w-full"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
