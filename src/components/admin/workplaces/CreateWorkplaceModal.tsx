"use client";

import { useState } from "react";
import { toast } from "sonner";
import BaseModal from "@/components/common/modal/BaseModal";
import { generateIssueCode } from "@/lib/utils/generateIssueCode";
import { sendIssueCodeEmail } from "@/lib/api/mail";
import { createWorkplace } from "@/lib/api/workplace";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import { Workplace } from "@/types/workplace";
import { useForm } from "react-hook-form";
import Input from "@/components/common/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateWorkplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

//폼 검증 스키마
const createWorkplaceSchema = z.object({
  name: z
    .string()
    .min(2, "2자 이상 입력하세요")
    .max(30, "30자 이하로 입력하세요"),
  initialCredit: z.number().min(1, "1 크레딧 이상 입력하세요"),
  managerEmail: z.string().email("이메일 형식을 확인하세요"),
});

// 폼 검증 타입
type CreateWorkplaceFormData = z.infer<typeof createWorkplaceSchema>;

interface WorkplaceFormData {
  name: string;
  initialCredit: number;
  managerEmail?: string;
  memo?: string;
}

export default function CreateWorkplaceModal({
  isOpen,
  onClose,
}: CreateWorkplaceModalProps) {
  //react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<CreateWorkplaceFormData>({
    resolver: zodResolver(createWorkplaceSchema),
  });

  const addWorkplace = useWorkplaceStore((state) => state.addWorkplace);

  const onSubmit = async (data: CreateWorkplaceFormData) => {
    console.log(data);

    // try {
    //   // 1. 발급코드 생성
    //   const issueCode = generateIssueCode();

    //   // 2. Supabase에 저장
    //   const { workplace, error } = await createWorkplace({
    //     name: formData.name,
    //     issueCode,
    //     creditTotal: formData.initialCredit,
    //     managerEmail: formData.managerEmail,
    //   });

    //   if (error) {
    //     toast.error("사업장 생성에 실패했습니다.");
    //     console.error(error);
    //     return;
    //   }

    //   // 3. Zustand 스토어에 추가 (프론트 형식으로 변환)
    //   const newWorkplace: Workplace = {
    //     id: workplace.id,
    //     name: workplace.name,
    //     issueCode: workplace.issue_code,
    //     status: workplace.status as "active" | "pending" | "inactive",
    //     credit: {
    //       remaining: workplace.credit_remaining,
    //       total: workplace.credit_total,
    //     },
    //     cardCount: workplace.card_count,
    //     createdAt: new Date(workplace.created_at)
    //       .toISOString()
    //       .split("T")[0]
    //       .replace(/-/g, "."),
    //     managerEmail: workplace.manager_email,
    //   };

    //   addWorkplace(newWorkplace);

    //   // 4. 이메일 전송 (선택사항)
    //   if (formData.managerEmail && formData.managerEmail.trim()) {
    //     const mailResult = await sendIssueCodeEmail(
    //       formData.managerEmail,
    //       formData.name,
    //       issueCode,
    //       formData.initialCredit,
    //     );

    //     if (!mailResult.success) {
    //       console.error("이메일 전송 실패:", mailResult.error);
    //       toast.warning("사업장은 생성되었지만 이메일 전송에 실패했습니다.", {
    //         description: `발급코드: ${issueCode}`,
    //       });
    //     } else {
    //       toast.success(
    //         "사업장이 생성되고 발급코드가 이메일로 전송되었습니다!",
    //         {
    //           description: `발급코드: ${issueCode}`,
    //         },
    //       );
    //     }
    //   } else {
    //     toast.success("사업장이 생성되었습니다!", {
    //       description: `발급코드: ${issueCode}`,
    //     });
    //   }

    //   // 5. 폼 초기화 및 모달 닫기
    //   setFormData({
    //     name: "",
    //     initialCredit: 100,
    //     managerEmail: "",
    //     memo: "",
    //   });
    //   // setErrors({});
    //   onClose();
    // } catch (error) {
    //   console.error("사업장 생성 실패:", error);
    //   toast.error("사업장 생성에 실패했습니다.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      // setErrors({});
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="고객사 생성"
      onSubmit={handleSubmit(onSubmit)}
      submitText="생성"
      cancelText="취소"
      size="md"
      isLoading={isSubmitting}
      submitDisabled={!isValid}
    >
      <div className="space-y-5">
        {/* 사업장명 */}
        <Input
          label="고객사명"
          placeholder="예: A 아파트, B 병원"
          {...register("name", { required: "필수" })}
          error={errors.name?.message}
          required
        />
        {/* 초기 크레딧 */}
        <Input
          label="초기 크레딧"
          placeholder="100"
          min={1}
          {...register("initialCredit", {
            required: "필수",
            valueAsNumber: true,
          })}
          error={errors.initialCredit?.message}
          helperText="1 크레딧 = 카드 1개 발급 가능"
          required
        />

        {/* 관리자 이메일 */}
        <Input
          label="고객사 관리자 이메일"
          placeholder="knock@example.com"
          type="email"
          {...register("managerEmail", { required: "필수" })}
          error={errors.managerEmail?.message}
          helperText="라이센스 코드를 받을 관리자 이메일"
          required
        />

        {/* 안내 메시지 */}
        <div className="bg-accent-dim border border-accent/20 rounded-radius-md px-4 py-3">
          <p className="text-xs text-accent leading-relaxed">
            💡 고객사 생성 시 16자리 발급코드가 자동으로 생성 및 발급됩니다.
            <br />
            (형식: XXXX-XXXX-XXXX-XXXX)
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
