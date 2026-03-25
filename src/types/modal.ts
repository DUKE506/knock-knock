export interface BaseModalProps {
  isOpen: boolean; // 모달 열림/닫힘
  onClose: () => void; // 닫기 함수
  title: string; // 모달 제목
  children: React.ReactNode; // 모달 내용
  onSubmit?: () => void; // 제출 함수 (선택)
  submitText?: string; // 제출 버튼 텍스트 (기본: "확인")
  cancelText?: string; // 취소 버튼 텍스트 (기본: "취소")
  size?: "sm" | "md" | "lg" | "xl"; // 모달 크기
  showFooter?: boolean; // Footer 표시 여부 (기본: true)
  isLoading?: boolean; // 로딩 상태
  submitDisabled?: boolean; // 제출 버튼 비활성화
}
