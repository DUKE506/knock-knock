import { SignJWT } from "jose";
import { supabase } from "../supabase";
import { PagedRequest } from "@/types/pagination";

// ============================================
// 사용자 관련 API
// ============================================

export interface User {
  id: string;
  email: string; // 로그인 ID
  name: string; // 실제 이름
  phone?: string; // 전화번호
  workplaceId: string; // 사업장 ID
  role: "admin" | "manager" | "user";
  createdAt: string;
}

/**
 * 사용자 생성
 */
export async function createUser(data: {
  email: string;
  name: string;
  password?: string;
  phone?: string;
  workplaceId: string;
  role?: "admin" | "manager" | "user";
}) {
  const { data: user, error } = await supabase
    .from("users")
    .insert({
      email: data.email,
      name: data.name,
      password: data.password, // TODO: 실제로는 해싱 필요
      phone: data.phone,
      workplace_id: data.workplaceId,
      role: data.role || "user",
    })
    .select()
    .single();

  if (error) {
    console.error("사용자 생성 실패:", error);
    return { user: null, error };
  }

  return { user, error: null };
}

/**
 * 클라이언트 관리자 초대
 */
export async function sendInviteClient(data: {
  email: string;
  workplaceId: string;
}) {
  console.log("===========================");
  console.log("발송 이메일 : ", data.email);
  // 클라이언트 초대 코드 조회
  const { data: workplace, error } = await supabase
    .from("workplaces")
    .select("invite_code,name")
    .eq("id", data.workplaceId)
    .single();

  if (error) {
    console.error("존재하지 않는 사업장입니다.");
    return;
  }
  // 1. url 생성
  // 1-1. 이메일, 초대코드, 만료일
  // 2. 발송
  const token = await new SignJWT({
    ...data,
    inviteCode: workplace.invite_code,
    workplaceName: workplace.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_INVITE_KEY));

  const linkUrl = `http://localhost:3003/auth/client/invite?token=${token}`;
  console.log("가입 url ");
  console.log(linkUrl);

  //  const result = await sendAdminInvite(data.email, linkUrl);
  // if (!result.success) return console.log("메일 전송 실패");

  // console.log("발송 결과 : ");
  // console.log(result.data);

  console.log("===========================");
}

/**
 * 이메일로 사용자 조회
 */
export async function getUserByEmail(email: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("사용자 조회 실패:", error);
    return { user: null, error };
  }

  return { user, error: null };
}

/**
 * 아이디로 사용자 조회
 */
export async function getUserByUsername(username: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error("사용자 조회 실패:", error);
    return { user: null, error };
  }

  return { user, error: null };
}

/**
 * 로그인 (email + password)
 */
export async function loginUser(email: string, password: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select(`*,workplaces(name)`)
    .eq("email", email)
    .eq("password", password) // TODO: 실제로는 해싱된 비밀번호 비교 필요
    .single();

  if (error) {
    console.error("로그인 실패:", error);
    return { user: null, error };
  }
  const { pw, ...rest } = user;
  return { user: rest, error: null };
}

/**
 * 사업장별 사용자 목록 조회
 */
export async function getUsersByWorkplace(workplaceId: string) {
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("workplace_id", workplaceId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("사용자 목록 조회 실패:", error);
    return { users: [], error };
  }

  return { users, error: null };
}

/**
 * 전체 사용자 조회
 */
export async function fetchClientUsers(params: PagedRequest) {
  const from = (params.pageNumber - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabase.from("users").select("*").eq("is_admin", false);

  //검색어 필터
  if (params.search) {
    query = query.or(`name.like.%${params.search}%`);
  }

  //페이지네이션
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("전체 사용자 조회 실패:", error);
    return { users: [], error };
  }

  const users: User[] = data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
    workplaceId: row.workplace_id,
  }));
  return {
    data: {
      meta: {
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / params.pageSize),
      },
      data: users || [],
    },
    error: null,
  };
}
