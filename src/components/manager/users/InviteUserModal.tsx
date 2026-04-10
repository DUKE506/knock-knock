import Input from "@/components/common/Input";
import BaseModal from "@/components/common/modal/BaseModal";
import { sendInviteMail } from "@/lib/api/admin/admin";
import { sendInviteClient } from "@/lib/api/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// 폼 스키마
const inviteUserSchema = z.object({
  email: z.email("이메일 형식을 확인해주세요"),
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
    const userString = localStorage.getItem("user");

    if (!userString) {
      toast.error("로그인 정보가 없습니다.");
      return;
    }

    const user = JSON.parse(userString);
    const workplaceId = user.workplace_id;

    if (!workplaceId) {
      toast.error("로그인 사업장 정보가 없습니다.");
      return;
    }

    await sendInviteClient({ ...data, workplaceId });
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
