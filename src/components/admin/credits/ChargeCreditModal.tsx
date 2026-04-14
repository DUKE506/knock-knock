"use client";

import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import BaseModal from "@/components/common/modal/BaseModal";
import { chargeCreditsToWorkplace } from "@/lib/api/credit";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface ChargeCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const chargeCreditSchema = z.object({
  workplaceId: z.string().min(1, "고객사를 선택하세요"),
  amount: z.number().min(1, "1 크레딧 이상 입력하세요"),
});

type ChargeCreditFormData = z.infer<typeof chargeCreditSchema>;

export default function ChargeCreditModal({
  isOpen,
  onClose,
  onSuccess,
}: ChargeCreditModalProps) {
  const { workplaces } = useWorkplaceStore();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<ChargeCreditFormData>({
    resolver: zodResolver(chargeCreditSchema),
  });

  const onSubmit = async (data: ChargeCreditFormData) => {
    const workplace = workplaces.find((w) => w.id === data.workplaceId);
    if (!workplace) {
      toast.error("고객사 정보를 찾을 수 없습니다.");
      return;
    }

    const { success, error } = await chargeCreditsToWorkplace({
      siteKey: data.workplaceId,
      creditCount: data.amount,
    });

    if (!success || error) {
      toast.error("크레딧 충전에 실패했습니다.");
      return;
    }

    toast.success(`${workplace.name}에 ${data.amount} 크레딧을 충전했습니다.`);
    handleClose();
    onSuccess?.();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="크레딧 충전"
      onSubmit={handleSubmit(onSubmit)}
      submitText="충전하기"
      size="sm"
      isLoading={isSubmitting}
      submitDisabled={!isValid}
    >
      <div className="space-y-4">
        {/* 고객사 선택 */}
        <Controller
          name="workplaceId"
          control={control}
          render={({ field }) => (
            <Select
              label="고객사"
              placeholder="고객사 선택"
              options={workplaces.map((w) => ({ value: w.id, label: w.name }))}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={errors.workplaceId?.message}
              required
            />
          )}
        />

        {/* 충전 수량 */}
        <Input
          type="number"
          label="충전 수량"
          placeholder="100"
          min={1}
          {...register("amount", { valueAsNumber: true })}
          error={errors.amount?.message}
          helperText="1 크레딧 = 카드 1개"
          required
        />
      </div>
    </BaseModal>
  );
}
