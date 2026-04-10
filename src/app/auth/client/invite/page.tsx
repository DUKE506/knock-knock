"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { JWTPayload } from "jose";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { verifyToken } from "@/lib/utils/verifyJwt";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { createUser } from "@/lib/api/user";
// import { createManager } from '@/lib/api/user';

// 토큰 페이로드 타입
interface TokenPayload extends JWTPayload {
  email: string;
  inviteCode: string;
  workplaceId: string;
  workplaceName: string;
}

// 회원가입 폼 스키마
const signupSchema = z
  .object({
    name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
    passwordConfirm: z.string(),
    phone: z
      .string()
      .regex(
        /^010-\d{4}-\d{4}$/,
        "전화번호 형식을 확인해주세요 (010-0000-0000)",
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const ClientInvitePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<{
    email: string;
    inviteCode: string;
    workplaceId: string;
    workplaceName: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("초대 링크가 유효하지 않습니다.");
      setIsVerifying(false);
      return;
    }

    verifyInviteToken(token);
  }, [searchParams]);

  const verifyInviteToken = async (token: string) => {
    try {
      const result = await verifyToken(token);

      if (!result || !result.payload) {
        setError("초대 토큰이 유효하지 않습니다.");
        return;
      }

      const payload = result.payload as TokenPayload;

      // 필수 데이터 확인
      if (!payload.email || !payload.inviteCode || !payload.workplaceName) {
        setError("초대 정보가 올바르지 않습니다.");
        return;
      }

      setTokenData({
        email: payload.email,
        inviteCode: payload.inviteCode,
        workplaceId: payload.workplaceId,
        workplaceName: payload.workplaceName,
      });
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
    console.log(data);
    if (!tokenData) return;

    try {
      const { passwordConfirm, ...rest } = data;

      const result = await createUser({
        email: tokenData.email,
        ...rest,
        workplaceId: tokenData.workplaceId,
        role: "manager",
      });

      if (result.error) {
        toast.error("회원가입 중 오류가 발생했습니다.");
        return;
      }

      toast.success("회원가입이 완료되었습니다!");
      router.push("/login");
    } catch (err) {
      console.error("회원가입 실패:", err);
      toast.error("회원가입 중 오류가 발생했습니다.");
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
            onClick={() => router.push("/auth/login")}
            className="px-6 py-2.5 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  // 회원가입 폼
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-green mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text">담당자 회원가입</h1>
          <p className="text-sm text-text-3 mt-2">
            Knock-Knock 클라이언트 관리자로 초대되었습니다
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
          {/* 사업장 정보 표시 */}
          <div className="bg-accent-dim border border-accent/20 rounded-md px-4 py-3 mb-6">
            <div className="flex items-center gap-2 text-accent mb-1">
              <span className="text-sm font-medium">✓ 사업장 인증 완료</span>
            </div>
            <p className="text-sm text-text-2 font-medium">
              {tokenData?.workplaceName}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 이메일 (읽기 전용) */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                이메일 <span className="text-text-3">(변경 불가)</span>
              </label>
              <input
                type="email"
                value={tokenData?.email || ""}
                disabled
                className="w-full px-4 py-2.5 text-sm border border-border rounded-md bg-bg text-text-2 cursor-not-allowed"
              />
            </div>

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
              placeholder="6자 이상"
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

            {/* 전화번호 */}
            <Input
              label="전화번호"
              type="tel"
              placeholder="010-1234-5678"
              {...register("phone")}
              error={errors.phone?.message}
              disabled={isSubmitting}
              helperText="'-' 포함하여 입력해주세요"
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
  );
};

export default ClientInvitePage;
