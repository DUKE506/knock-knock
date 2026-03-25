// lib/generateIssueCode.ts
export function generateIssueCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const generateSegment = (length: number): string => {
    let segment = "";
    for (let i = 0; i < length; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return segment;
  };

  // 4-4-4-4 형식
  return [
    generateSegment(4),
    generateSegment(4),
    generateSegment(4),
    generateSegment(4),
  ].join("-");
}

// 사용 예시
const code = generateIssueCode();
// 결과: "A7F2-K9D3-M5P1-X8Q4"
