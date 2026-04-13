import Input from "@/components/common/Input";
import BaseModal from "@/components/common/modal/BaseModal";
import { sendInviteMail } from "@/lib/api/admin/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// 폼 스키마
const inviteUserSchema = z.object({
  email: z
    .string()
    .email("이메일 형식을 확인해주세요")
    .refine(
      (email) => email.endsWith("@s-tec.co.kr"),
      "s-tec.co.kr 이메일만 초대 가능합니다",
    ),
});

// 폼 데이터 타입
type InviteUserFormData = z.infer<typeof inviteUserSchema>;

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteUserModal = ({ isOpen, onClose }: InviteUserModalProps) => {
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
    const result = await sendInviteMail(data);
    handleClose();
    if (result.success) {
      toast.success("초대 메일을 발송했습니다.");
    } else {
      toast.error("초대 메일 발송에 실패했습니다.");
    }
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
          {...register("email", { required: "필수" })}
          error={errors.email?.message}
          required
        />
      </div>
    </BaseModal>
  );
};

export default InviteUserModal;
