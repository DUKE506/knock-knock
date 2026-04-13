"use client";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { createAdmin } from "@/lib/api/admin/admin";
import { verifyToken } from "@/lib/utils/verifyJwt";
import { zodResolver } from "@hookform/resolvers/zod";
import { JWTPayload } from "jose";
import { UserPlus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import z from "zod";

interface TokenPayload extends JWTPayload {
  email: string;
}

const signupSchema = z
  .object({
    loginId: z.string().min(1, "아이디를 입력하세요"),
    name: z.string().min(1, "이름을 입력하세요"),
    password: z.string().min(8, "8자리 이상 입력하세요"),
    passwordConfirm: z.string(),
    deptName: z.string().min(1, "부서를 입력하세요"),
    job: z.string().min(1, "직책을 입력하세요"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const InvitePage = () => {
  const params = useSearchParams();
  const router = useRouter();

  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setError("초대 링크가 유효하지 않습니다.");
      setIsVerifying(false);
      return;
    }

    verifyInviteToken(token);
  }, [params]);

  const verifyInviteToken = async (token: string) => {
    try {
      const result = await verifyToken(token);

      if (!result || !result.payload) {
        setError("초대 토큰이 유효하지 않습니다.");
        return;
      }

      const payload = result.payload as TokenPayload;
      setEmail(payload.email);
    } catch (err: any) {
      if (err.message?.includes("expired")) {
        setError("초대 링크가 만료되었습니다. 관리자에게 재초대를 요청하세요.");
      } else {
        setError("초대 링크가 유효하지 않습니다.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { passwordConfirm, ...rest } = data;
      const res = await createAdmin({ ...rest, password: rest.password });

      if (res.error) {
        toast.error("슈퍼관리자 생성 실패");
        return;
      }

      router.push("/auth/login");
    } catch (err) {
      console.error("회원가입 실패:", err);
    }
  };

  // 로딩 중
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

  // 에러 발생
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="max-w-md w-full bg-surface border border-border rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-dim rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-text mb-2">
            초대 링크 오류
          </h1>
          <p className="text-text-2 mb-6">{error}</p>
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
    <>
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text">
              슈퍼관리자 회원가입
            </h1>
            <p className="text-sm text-text-3 mt-2">
              Knock-Knock 관리자로 초대되었습니다
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* 이메일 (읽기 전용) */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  이메일 <span className="text-text-3">(변경 불가)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-md bg-bg text-text-2 cursor-not-allowed"
                />
              </div>

              {/* 아이디 */}
              <Input
                label="아이디"
                placeholder="사용할 아이디 입력"
                {...register("loginId")}
                error={errors.loginId?.message}
                disabled={isSubmitting}
                required
              />

              {/* 이름 */}
              <Input
                label="이름"
                placeholder="홍길동"
                {...register("name")}
                error={errors.name?.message}
                disabled={isSubmitting}
                required
              />

              {/* 비밀번호 */}
              <Input
                label="비밀번호"
                type="password"
                placeholder="8자 이상"
                {...register("password")}
                error={errors.password?.message}
                disabled={isSubmitting}
                required
              />

              {/* 비밀번호 확인 */}
              <Input
                label="비밀번호 확인"
                type="password"
                placeholder="비밀번호 재입력"
                {...register("passwordConfirm")}
                error={errors.passwordConfirm?.message}
                disabled={isSubmitting}
                required
              />

              {/* 부서 */}
              <Input
                label="부서"
                placeholder="개발팀"
                {...register("deptName")}
                error={errors.deptName?.message}
                disabled={isSubmitting}
                required
              />

              {/* 직책 */}
              <Input
                label="직책"
                placeholder="팀장"
                {...register("job")}
                error={errors.job?.message}
                disabled={isSubmitting}
                required
              />

              {/* 회원가입 버튼 */}
              <Button
                variant="primary"
                title="회원가입 완료"
                type="submit"
                isLoading={isSubmitting}
                disabled={!isValid}
                className="w-full mt-6"
              />
            </form>

            {/* 로그인 링크 */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-3">
                이미 계정이 있으신가요?{" "}
                <button
                  onClick={() => router.push("/auth/login")}
                  className="text-accent font-medium hover:underline"
                >
                  로그인
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
};

export default InvitePage;
