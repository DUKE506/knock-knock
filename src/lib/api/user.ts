import { supabase } from "../supabase";

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
    .select("*")
    .eq("email", email)
    .eq("password", password) // TODO: 실제로는 해싱된 비밀번호 비교 필요
    .single();

  if (error) {
    console.error("로그인 실패:", error);
    return { user: null, error };
  }

  return { user, error: null };
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
export async function fetchAllUsers() {
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("전체 사용자 조회 실패:", error);
    return { users: [], error };
  }

  return { users, error: null };
}
