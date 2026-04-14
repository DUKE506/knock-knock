"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { addSubMaster } from "@/lib/api/user";
import { verifyInviteToken } from "@/lib/actions/verifyInviteToken";

type SubMasterTokenPayload = {
  userId: string;
  licenseKey: string;
  role: string;
  siteName: string;
};

const registerSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해주세요"),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
    passwordConfirm: z.string(),
    deptName: z.string().min(1, "부서명을 입력해주세요"),
    job: z.string().min(1, "직책을 입력해주세요"),
    company: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function SubRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tokenData, setTokenData] = useState<SubMasterTokenPayload | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const token = searchParams.get("access");
    if (!token) {
      setPageError("유효하지 않은 초대 링크입니다.");
      setIsVerifying(false);
      return;
    }
    handleVerifyToken(token);
  }, []);

  const handleVerifyToken = async (token: string) => {
    const { data, error } = await verifyInviteToken(token);
    if (error || !data) {
      setPageError(error ?? "초대 링크 정보를 확인할 수 없습니다.");
      setIsVerifying(false);
      return;
    }
    setTokenData(data as SubMasterTokenPayload);
    setIsVerifying(false);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { success, error } = await addSubMaster({
        loginId: tokenData?.userId ?? "",
        loginPw: data.password,
        name: data.name,
        deptName: data.deptName,
        job: data.job,
        company: data.company || null,
        licenseKey: tokenData?.licenseKey ?? "",
      });

      if (!success || error) {
        toast.error("회원가입에 실패했습니다.");
        return;
      }

      toast.success("회원가입이 완료되었습니다!");
      router.push("/login");
    } catch {
      toast.error("회원가입에 실패했습니다.");
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-2">초대 링크 확인 중...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="max-w-md w-full bg-surface border border-border rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-dim rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-text mb-2">초대 링크 오류</h1>
          <p className="text-text-2 mb-6">{pageError}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2.5 bg-accent text-white rounded-md"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-green mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text">관리자 회원가입</h1>
          <p className="text-sm text-text-3 mt-2">회원 정보를 입력해주세요</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 고객사 정보 표시 */}
            <div className="bg-accent-dim border border-accent/20 rounded-md px-4 py-3 mb-6">
              <div className="flex items-center justify-between text-accent">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">고객사 인증 완료</span>
                </div>
                <span className="text-sm font-medium">{tokenData?.siteName}</span>
              </div>
            </div>

            {/* 이메일 (토큰에서 추출, 변경 불가) */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                이메일 <span className="text-text-3 font-normal">(변경 불가)</span>
              </label>
              <input
                type="email"
                value={tokenData?.userId ?? ""}
                disabled
                className="w-full px-4 py-2.5 text-sm border border-border rounded-md bg-bg text-text-2 cursor-not-allowed opacity-60"
              />
            </div>

            <Input
              label="이름"
              placeholder="홍길동"
              {...register("name")}
              error={errors.name?.message}
              disabled={isSubmitting}
              required
            />

            <Input
              label="비밀번호"
              type="password"
              placeholder="6자 이상"
              {...register("password")}
              error={errors.password?.message}
              disabled={isSubmitting}
              required
            />

            <Input
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호 재입력"
              {...register("passwordConfirm")}
              error={errors.passwordConfirm?.message}
              disabled={isSubmitting}
              required
            />

            <Input
              label="부서명"
              placeholder="개발팀"
              {...register("deptName")}
              error={errors.deptName?.message}
              disabled={isSubmitting}
              required
            />

            <Input
              label="직책"
              placeholder="대리"
              {...register("job")}
              error={errors.job?.message}
              disabled={isSubmitting}
              required
            />

            <Input
              label="회사명"
              placeholder="(선택)"
              {...register("company")}
              error={errors.company?.message}
              disabled={isSubmitting}
            />

            <Button
              variant="primary"
              title="회원가입 완료"
              type="submit"
              isLoading={isSubmitting}
              disabled={!isValid}
              className="w-full mt-6"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
