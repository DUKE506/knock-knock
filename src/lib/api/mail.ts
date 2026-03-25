import axios from "axios";

const MAIL_API_URL =
  process.env.NEXT_PUBLIC_MAIL_API_URL || "http://localhost:3333";

interface SendMailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendMail({ to, subject, text, html }: SendMailParams) {
  try {
    const response = await axios.post(`${MAIL_API_URL}/mail/send`, {
      to,
      subject,
      text,
      html,
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

/**
 * 카드 활성화번호 이메일 발송
 */
export async function sendCardActivationEmail(data: {
  to: string;
  userName: string;
  cardNumber: string; // 전체 카드번호
  activationCode: string; // 6자리 활성화번호
}) {
  // 카드번호 마스킹 (마지막 4자리만 표시)
  const maskedCardNumber = `****-****-****-${data.cardNumber.slice(-4)}`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #10b981;">카드가 발급되었습니다</h2>
      <p>안녕하세요, <strong>${data.userName}</strong>님</p>
      <p>카드 발급이 승인되었습니다. 아래 활성화번호를 모바일 앱에 입력하여 카드를 활성화하세요.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">카드번호</p>
        <p style="margin: 0 0 20px 0; font-size: 18px; font-family: monospace;">${maskedCardNumber}</p>
        
        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">활성화번호</p>
        <p style="margin: 0; font-size: 32px; font-weight: bold; color: #10b981; font-family: monospace; letter-spacing: 4px;">
          ${data.activationCode}
        </p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        ※ 활성화번호는 카드 활성화 시 1회만 사용됩니다.<br>
        ※ 모바일 앱에서 활성화번호를 입력하면 카드를 바로 사용할 수 있습니다.
      </p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p style="color: #9ca3af; font-size: 12px;">
        본 메일은 Knock-Knock 시스템에서 자동 발송되었습니다.
      </p>
    </div>
  `;

  const emailText = `
카드가 발급되었습니다

안녕하세요, ${data.userName}님

카드 발급이 승인되었습니다. 아래 활성화번호를 모바일 앱에 입력하여 카드를 활성화하세요.

━━━━━━━━━━━━━━━━━━━━━━━━━
카드번호: ${maskedCardNumber}
활성화번호: ${data.activationCode}
━━━━━━━━━━━━━━━━━━━━━━━━━

※ 활성화번호는 카드 활성화 시 1회만 사용됩니다.
※ 모바일 앱에서 활성화번호를 입력하면 카드를 바로 사용할 수 있습니다.

본 메일은 Knock-Knock 시스템에서 자동 발송되었습니다.
  `.trim();

  return sendMail({
    to: data.to,
    subject: "[Knock-Knock] 카드가 발급되었습니다",
    text: emailText,
    html: emailHtml,
  });
}
