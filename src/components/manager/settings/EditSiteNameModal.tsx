"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import BaseModal from "@/components/common/modal/BaseModal";
import Input from "@/components/common/Input";

const schema = z.object({
  siteName: z
    .string()
    .min(2, "2자 이상 입력하세요")
    .max(50, "50자 이하로 입력하세요"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentValue: string;
  onSuccess: (siteName: string) => void;
}

export default function EditSiteNameModal({
  isOpen,
  onClose,
  currentValue,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { siteName: currentValue },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ siteName: currentValue });
    }
  }, [isOpen, currentValue, reset]);

  const onSubmit = async (data: FormData) => {
    // TODO: UpdateSiteName API 연동 (백엔드 미제공, 추후 구현)
    toast.info("사업장 이름 변경은 현재 준비 중입니다.");
    onSuccess(data.siteName);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="사업장 이름 수정"
      size="sm"
      submitText="저장"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      submitDisabled={!isValid}
    >
      <Input
        label="사업장 이름"
        required
        {...register("siteName")}
        error={errors.siteName?.message}
      />
    </BaseModal>
  );
}
