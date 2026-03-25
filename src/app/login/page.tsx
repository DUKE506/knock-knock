"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import Button from "@/components/common/Button";
import { loginUser } from "@/lib/api/user";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const { user, error } = await loginUser(
        formData.email,
        formData.password,
      );

      if (error || !user) {
        toast.error("이메일 또는 비밀번호가 일치하지 않습니다.");
        return;
      }

      // 로그인 성공
      // TODO: 세션/토큰 저장 (localStorage, cookie 등)
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("로그인 성공!");

      // Role에 따라 리다이렉트
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/manager/dashboard"); // TODO: 일반 사용자 대시보드 구현
      }
    } catch (error) {
      toast.error("로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
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

        {/* Login Form */}
        <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                이메일
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="example@email.com"
                className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-2.5 text-sm border border-border rounded-md outline-none focus:border-accent transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* 로그인 버튼 */}
            <Button
              variant="primary"
              title="로그인"
              onClick={handleSubmit}
              isLoading={isLoading}
              className="w-full"
            />
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-text-3 mb-3">아직 계정이 없으신가요?</p>
            <Link href="/register">
              <Button variant="secondary" title="회원가입" className="w-full" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
