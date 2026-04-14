import Input from "@/components/common/Input";
import BaseModal from "@/components/common/modal/BaseModal";
import { sendInviteClient } from "@/lib/api/user";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const inviteUserSchema = z.object({
  email: z.email("이메일 형식을 확인해주세요"),
});

type InviteUserFormData = z.infer<typeof inviteUserSchema>;

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const InviteUserModal = ({ isOpen, onClose, onSuccess }: InviteUserModalProps) => {
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: InviteUserFormData) => {
    if (!user?.workplaceId) {
      toast.error("로그인 정보가 없습니다.");
      return;
    }

    const { success, error } = await sendInviteClient({
      email: data.email,
      siteKey: user.workplaceId,
    });

    if (!success || error) {
      toast.error("초대 메일 발송에 실패했습니다.");
      return;
    }

    toast.success("초대 메일이 발송되었습니다.");
    handleClose();
    onSuccess?.();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="관리자 초대"
      onSubmit={handleSubmit(onSubmit)}
      submitText="초대링크 발송"
      size="sm"
      isLoading={isSubmitting}
      submitDisabled={!isValid}
    >
      <div className="space-y-4">
        <p className="text-sm text-text-3">새로운 관리자를 초대합니다</p>
        <Input
          label="이메일"
          placeholder="knock@example.com"
          {...register("email")}
          error={errors.email?.message}
          required
        />
      </div>
    </BaseModal>
  );
};

export default InviteUserModal;
