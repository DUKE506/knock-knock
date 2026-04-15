import { apiClient } from "@/lib/apiClient";

interface SiteDetailResponse {
  siteKey: string;
  siteName: string;
  creditCount: number;
  creditUsed: number;
  licenseKey: string;
  autoIssue: boolean;
  qrTimeout: number;
}

export interface SiteDetail {
  siteKey: string;
  siteName: string;
  creditCount: number;
  creditUsed: number;
  licenseKey: string;
  autoIssue: boolean;
  qrTimeout: number;
}

export async function fetchSiteDetail(): Promise<{
  data: SiteDetail | null;
  error: unknown;
}> {
  const { data, error } = await apiClient.get<SiteDetailResponse>(
    "/manager-api/v1/MasterSite/W/sign/GetSiteDetail",
  );

  if (error || !data) {
    return { data: null, error };
  }

  return {
    data: {
      siteKey: data.siteKey,
      siteName: data.siteName,
      creditCount: data.creditCount,
      creditUsed: data.creditUsed,
      licenseKey: data.licenseKey,
      autoIssue: data.autoIssue,
      qrTimeout: data.qrTimeout,
    },
    error: null,
  };
}

export async function updateAutoIssue(
  siteKey: string,
  autoIssue: boolean,
): Promise<{ error: unknown }> {
  const { error } = await apiClient.put(
    "/manager-api/v1/MasterSite/W/sign/UpdateAutoIssue",
    { siteKey, autoIssue },
  );
  return { error };
}

export async function updateQrTimeout(
  siteKey: string,
  qrTimeout: number,
): Promise<{ error: unknown }> {
  const { error } = await apiClient.put(
    "/manager-api/v1/MasterSite/W/sign/UpdateQrTimeout",
    { siteKey, qrTimeout },
  );
  return { error };
}
