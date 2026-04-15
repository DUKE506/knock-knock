"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import BaseModal from "@/components/common/modal/BaseModal";
import Input from "@/components/common/Input";
import { updateQrTimeout } from "@/lib/api/manager/site";

const schema = z.object({
  qrTimeout: z
    .number()
    .int("정수만 입력 가능합니다")
    .min(1, "1초 이상 입력하세요")
    .max(86400, "86400초(24시간) 이하로 입력하세요"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  siteKey: string;
  currentValue: number;
  onSuccess: (qrTimeout: number) => void;
}

export default function EditQrTimeoutModal({
  isOpen,
  onClose,
  siteKey,
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
    defaultValues: { qrTimeout: currentValue },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ qrTimeout: currentValue });
    }
  }, [isOpen, currentValue, reset]);

  const onSubmit = async (data: FormData) => {
    const { error } = await updateQrTimeout(siteKey, data.qrTimeout);
    if (error) {
      toast.error("QR 유효시간 변경에 실패했습니다.");
      return;
    }
    toast.success("QR 유효시간이 변경되었습니다.");
    onSuccess(data.qrTimeout);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="QR 유효시간 수정"
      size="sm"
      submitText="저장"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      submitDisabled={!isValid}
    >
      <div className="space-y-4">
        <p className="text-sm text-text-2">
          모바일 QR 코드의 유효 시간을 초 단위로 입력하세요.
        </p>
        <Input
          label="QR 유효시간 (초)"
          type="number"
          required
          {...register("qrTimeout", { valueAsNumber: true })}
          error={errors.qrTimeout?.message}
          helperText="예: 30초, 60초, 300초(5분)"
        />
      </div>
    </BaseModal>
  );
}
