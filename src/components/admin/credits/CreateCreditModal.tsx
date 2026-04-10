import Input from "@/components/common/Input";
import BaseModal from "@/components/common/modal/BaseModal";
import { issueCreditCode } from "@/lib/api/credit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface CreateCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

//폼 스키마
const createCreditSchema = z.object({
  amount: z.number().min(1, "1 크레딧 이상 입력하세요"),
  managerEmail: z.email("이메일 형식을 확인하세요"),
});

//폼 타입
type CreateCreditFormData = z.infer<typeof createCreditSchema>;

export default function CreateCreditModal({
  isOpen,
  onClose,
}: CreateCreditModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<CreateCreditFormData>({
    resolver: zodResolver(createCreditSchema),
  });

  // 코드 직접 발급
  const onSubmit = async (data: CreateCreditFormData) => {
    console.log(data);

    // try {
    //   const {
    //     creditHistory: newHistory,
    //     code,
    //     error,
    //   } = await issueCreditCode({
    //     amount: data.amount,
    //     email: data.managerEmail,
    //     createdBy: "발급자",
    //   });

    //   if (error || !code) {
    //     toast.error("코드 발급에 실패했습니다.");
    //     return;
    //   }

    //   // TODO: 이메일 발송
    //   toast.success(`크레딧 코드가 발급되었습니다: ${code}`);

    //   // Store 업데이트
    //   if (newHistory) {
    //     addCreditHistory(newHistory as CreditHistory);
    //   }

    //   // 폼 초기화 및 모달 닫기
    //   setIssueForm({ amount: "", email: "" });
    //   setIsIssueModalOpen(false);
    // } catch (err) {
    //   toast.error("코드 발급 중 오류가 발생했습니다.");
    // }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="크레딧 코드 발급"
      onSubmit={handleSubmit(onSubmit)}
      submitText="발급하기"
      size="sm"
      isLoading={isSubmitting}
      submitDisabled={!isValid}
    >
      <div className="space-y-4">
        <p className="text-sm text-text-3">
          크레딧 코드를 생성하여 이메일로 발송합니다
        </p>

        {/* 발급 수량 */}
        <Input
          type="number"
          label="발급 수량"
          placeholder="100"
          min={1}
          {...register("amount", { required: "필수", valueAsNumber: true })}
          error={errors.amount?.message}
          required
        />

        {/* 이메일 */}
        <Input
          label="이메일"
          placeholder="knock@example.com"
          {...register("managerEmail", { required: "필수" })}
          error={errors.managerEmail?.message}
          required
        />

        <p className="text-xs text-text-3">
          ※ 발급된 코드는 입력된 이메일로 자동 발송됩니다
        </p>
      </div>
    </BaseModal>
  );
}
