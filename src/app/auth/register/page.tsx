"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { UserPlus, ArrowLeft, CheckCircle } from "lucide-react";
import Button from "@/components/common/Button";
import { verifyIssueCode } from "@/lib/api/workplace";
import { createUser } from "@/lib/api/user";

type Step = "verify" | "register";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("verify");
  const [issueCode, setIssueCode] = useState("");
  const [workplaceInfo, setWorkplaceInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 회원가입 폼 데이터
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // STEP 1: 인증코드 검증
  const handleVerifyCode = async () => {
    if (!issueCode.trim()) {
      toast.error("인증코드를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const { workplace, error } = await verifyIssueCode(issueCode);

      if (error || !workplace) {
        toast.error("유효하지 않은 인증코드입니다.");
        return;
      }

      // 인증 성공
      setWorkplaceInfo(workplace);
      setStep("register");
      toast.success(`${workplace.name} 사업장 인증 완료!`);
    } catch (error) {
      toast.error("인증코드 확인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: 회원가입 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다.";
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "전화번호를 입력해주세요.";
    } else if (!/^[0-9-]+$/.test(formData.phone)) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // STEP 2: 회원가입 제출
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("입력 정보를 확인해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 사용자 생성
      const { user, error } = await createUser({
        email: formData.email,
        name: formData.name,
        password: formData.password, // TODO: 실제로는 해싱 필요
        phone: formData.phone,
        workplaceId: workplaceInfo.id,
        role: "user",
      });

      if (error || !user) {
        toast.error("회원가입에 실패했습니다.");
        return;
      }

      toast.success("회원가입이 완료되었습니다!");
      router.push("/login");
    } catch (error) {
      toast.error("회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-green mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text">회원가입</h1>
          <p className="text-sm text-text-3 mt-2">
            {step === "verify"
              ? "인증코드를 입력해주세요"
              : "회원 정보를 입력해주세요"}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
          {/* STEP 1: 인증코드 검증 */}
          {step === "verify" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  인증코드 <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={issueCode}
                  onChange={(e) => setIssueCode(e.target.value.toUpperCase())}
                  placeholder="예: ABCD-EFGH-IJKL-MNOP"
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors font-mono"
                  disabled={isLoading}
                  maxLength={19}
                />
                <p className="mt-2 text-xs text-text-3">
                  관리자로부터 받은 16자리 인증코드를 입력하세요
                </p>
              </div>

              <Button
                variant="primary"
                title="인증코드 확인"
                onClick={handleVerifyCode}
                isLoading={isLoading}
                className="w-full"
              />
            </div>
          )}

          {/* STEP 2: 회원가입 폼 */}
          {step === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* 사업장 정보 표시 */}
              <div className="bg-accent-dim border border-accent/20 rounded-md px-4 py-3 mb-6">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">사업장 인증 완료</span>
                </div>
                <p className="text-sm text-text-2">{workplaceInfo?.name}</p>
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  이메일 <span className="text-red">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@email.com"
                  className={`w-full px-4 py-2.5 text-sm border rounded-md outline-none transition-colors ${
                    errors.email
                      ? "border-red focus:border-red"
                      : "border-border focus:border-accent"
                  }`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red">{errors.email}</p>
                )}
              </div>

              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  이름 <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="홍길동"
                  className={`w-full px-4 py-2.5 text-sm border rounded-md outline-none transition-colors ${
                    errors.name
                      ? "border-red focus:border-red"
                      : "border-border focus:border-accent"
                  }`}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red">{errors.name}</p>
                )}
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  비밀번호 <span className="text-red">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="6자 이상"
                  className={`w-full px-4 py-2.5 text-sm border rounded-md outline-none transition-colors ${
                    errors.password
                      ? "border-red focus:border-red"
                      : "border-border focus:border-accent"
                  }`}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red">{errors.password}</p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  비밀번호 확인 <span className="text-red">*</span>
                </label>
                <input
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passwordConfirm: e.target.value,
                    })
                  }
                  placeholder="비밀번호 재입력"
                  className={`w-full px-4 py-2.5 text-sm border rounded-md outline-none transition-colors ${
                    errors.passwordConfirm
                      ? "border-red focus:border-red"
                      : "border-border focus:border-accent"
                  }`}
                  disabled={isLoading}
                />
                {errors.passwordConfirm && (
                  <p className="mt-1.5 text-xs text-red">
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>

              {/* 전화번호 */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  전화번호 <span className="text-red">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="010-1234-5678"
                  className={`w-full px-4 py-2.5 text-sm border rounded-md outline-none transition-colors ${
                    errors.phone
                      ? "border-red focus:border-red"
                      : "border-border focus:border-accent"
                  }`}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red">{errors.phone}</p>
                )}
              </div>

              {/* 회원가입 버튼 */}
              <Button
                variant="primary"
                title="회원가입 완료"
                onClick={handleRegister}
                isLoading={isLoading}
                className="w-full mt-6"
              />

              {/* 뒤로가기 */}
              <button
                type="button"
                onClick={() => setStep("verify")}
                className="w-full flex items-center justify-center gap-2 text-sm text-text-3 hover:text-text transition-colors mt-4"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4" />
                인증코드 다시 입력
              </button>
            </form>
          )}

          {/* 로그인 링크 */}
          {step === "verify" && (
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-3">
                이미 계정이 있으신가요?{" "}
                <Link
                  href="/login"
                  className="text-accent font-medium hover:underline"
                >
                  로그인
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
