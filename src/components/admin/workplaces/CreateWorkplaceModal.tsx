"use client";

import { toast } from "sonner";
import BaseModal from "@/components/common/modal/BaseModal";
import { createWorkplace } from "@/lib/api/workplace";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
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
  managerEmail: z.email("이메일 형식을 확인하세요"),
});

// 폼 검증 타입
type CreateWorkplaceFormData = z.infer<typeof createWorkplaceSchema>;

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

  const fetchWorkplaces = useWorkplaceStore((state) => state.fetchWorkplaces);

  const onSubmit = async (data: CreateWorkplaceFormData) => {
    try {
      const { success, error } = await createWorkplace({
        name: data.name,
        creditCount: data.initialCredit,
        sendEmail: data.managerEmail,
      });

      if (error || !success) {
        toast.error("사업장 생성에 실패했습니다.");
        return;
      }

      await fetchWorkplaces({ pageNumber: 1, pageSize: 20 });
      toast.success("사업장이 생성되었습니다.");
      reset();
      onClose();
    } catch (error) {
      console.error("사업장 생성 실패:", error);
      toast.error("사업장 생성에 실패했습니다.");
    }
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
            💡 고객사 생성 시 라이센스 코드가 자동 발급되며, 관리자 이메일로 전송됩니다.
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
