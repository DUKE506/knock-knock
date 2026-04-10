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

/**
 * 슈퍼관리자 초대링크 메일 발송
 */
export async function sendAdminInvite(email: string, inviteUrl: string) {
  const subject = "Knock-Knock 슈퍼관리자 초대";
  const text = `
안녕하세요,

Knock-Knock 슈퍼관리자로 초대되었습니다.

━━━━━━━━━━━━━━━━━━━━━━━━━
초대 이메일: ${email}
━━━━━━━━━━━━━━━━━━━━━━━━━

아래 링크를 클릭하여 회원가입을 완료해주세요:
${inviteUrl}

※ 이 초대 링크는 7일 동안 유효하며, 1회만 사용 가능합니다.
※ 본인이 요청하지 않은 초대라면 이 메일을 무시해주세요.

감사합니다.
Knock-Knock 관리팀
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Malgun Gothic', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
    .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Knock-Knock</h1>
      <p style="margin: 10px 0 0 0;">슈퍼관리자 초대</p>
    </div>
    <div class="content">
      <p>안녕하세요,</p>
      <p><strong>Knock-Knock 슈퍼관리자</strong>로 초대되었습니다.</p>
      
      <div class="info-box">
        <strong>초대 이메일:</strong> ${email}
      </div>
      
      <p>아래 버튼을 클릭하여 회원가입을 완료해주세요:</p>
      
      <div style="text-align: center;">
        <a href="${inviteUrl}" class="button">회원가입 하기</a>
      </div>
      
      <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
        ※ 이 초대 링크는 <strong>7일 동안 유효</strong>하며, <strong>1회만 사용</strong> 가능합니다.<br>
        ※ 본인이 요청하지 않은 초대라면 이 메일을 무시해주세요.
      </p>
    </div>
    <div class="footer">
      <p>Knock-Knock 관리팀<br>
      이 메일은 자동으로 발송되었습니다.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendMail({ to: email, subject, text, html });
}
