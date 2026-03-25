/**
 * 6자리 랜덤 활성화번호 생성
 * @returns 6자리 숫자 문자열 (예: "123456")
 */
export function generateActivationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 16자리 카드번호 생성 (4-4-4-4 형식)
 * @returns 16자리 카드번호 (예: "1234-5678-9012-3456")
 */
export function generateCardNumber(): string {
  const part1 = Math.floor(1000 + Math.random() * 9000);
  const part2 = Math.floor(1000 + Math.random() * 9000);
  const part3 = Math.floor(1000 + Math.random() * 9000);
  const part4 = Math.floor(1000 + Math.random() * 9000);

  return `${part1}-${part2}-${part3}-${part4}`;
}
