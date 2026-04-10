// ============================================
// 슈퍼관리자 관련 API
// ============================================

import { SignJWT } from "jose";
import { sendAdminInvite } from "../mail";
import { supabase } from "@/lib/supabase";
import { PagedRequest } from "@/types/pagination";
import { Admin } from "@/app/admin/users/colums";

export interface User {}

/**
 * 슈퍼관리자 초대링크 전송 // 임시 url생성 용
 */
export async function sendInviteMail(data: { email: string }) {
  console.log("===========================");
  console.log("발송 이메일 : ", data.email);
  // url 생성
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_INVITE_KEY));

  const linkUrl = `http://localhost:3003/auth/invite?token=${token}`;
  console.log("가입 url : ", linkUrl);

  // const result = await sendAdminInvite(data.email, linkUrl);
  // if (!result.success) return console.log("메일 전송 실패");

  // console.log("발송 결과 : ");
  // console.log(result.data);

  console.log("===========================");
}

/**
 * 슈퍼관리자 회원가입 요청
 */
export async function createAdmin(data: {
  email: string;
  name: string;
  password: string;
  phone: string;
}) {
  console.log("데이터 :", data);
  const { data: admin, error } = await supabase
    .from("users")
    .insert({
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      is_admin: true,
    })
    .select()
    .single();

  //백엔드 연동시 에러코드에 따라 처리
  if (error) {
    console.error("슈퍼관리자 생성 실패 : ", error);
    return { admin, error: error };
  }

  return { data: true, error: "null" };
}

/**
 * 슈퍼관리자 조회
 */
export async function fetchAdmins(params: PagedRequest) {
  const from = (params.pageNumber - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabase.from("users").select("*").eq("is_admin", true);

  //검색어 필터
  if (params.search) {
    query = query.or(`name.like.%${params.search}%`);
  }

  //페이지네이션
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("슈퍼관리자 조회 실패 :", error);
    return { admins: [], error };
  }

  const admins: Admin[] = data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: "슈퍼관리자",
    createdAt: row.created_at,
  }));

  return {
    data: {
      meta: {
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / params.pageSize),
      },
      data: admins || [],
    },
    error: null,
  };
}

/**
 * 슈퍼관리자 로그인
 */
export async function loginAdmin(data: { email: string; password: string }) {
  const {
    data: { password, ...rest },
    error,
  } = await supabase
    .from("users")
    .select("*")
    .eq("email", data.email)
    .eq("password", data.password) // 임시
    .single();

  if (error) {
    console.error("슈퍼관리자 로그인 실패");
    return { data: null, error };
  }

  return { data: rest, error: null };
}
