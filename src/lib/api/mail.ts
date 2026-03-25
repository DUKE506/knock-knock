import axios from "axios";

const MAIL_API_URL =
  process.env.NEXT_PUBLIC_MAIL_API_URL || "http://localhost:3333";

interface SendMailParams {
  to: string;
  subject: string;
  text: string;
}

export async function sendMail({ to, subject, text }: SendMailParams) {
  try {
    const response = await axios.post(`${MAIL_API_URL}/mail/send`, {
      to,
      subject,
      text,
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("메일 전송 실패:", error);
    return { success: false, error };
  }
}

// 발급코드 이메일 전송
export async function sendIssueCodeEmail(
  email: string,
  workplaceName: string,
  issueCode: string,
  initialCredit: number,
) {
  const subject = `${workplaceName} 발급코드 안내`;
  const text = `
안녕하세요,

${workplaceName} 사업장의 발급코드가 생성되었습니다.

━━━━━━━━━━━━━━━━━━━━━━━━━
발급코드: ${issueCode}
사업장명: ${workplaceName}
초기 크레딧: ${initialCredit}개
━━━━━━━━━━━━━━━━━━━━━━━━━

아래 링크에서 발급코드로 가입하실 수 있습니다:
${process.env.NEXT_PUBLIC_APP_URL}/register?code=${issueCode}

※ 발급코드는 30일 동안 유효하며, 1회만 사용 가능합니다.

감사합니다.
Knock-Knock 관리자
  `.trim();

  return sendMail({ to: email, subject, text });
}
