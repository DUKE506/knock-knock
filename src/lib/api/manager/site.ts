import { apiClient } from "@/lib/apiClient";

interface SiteDetailResponse {
  siteKey: string;
  siteName: string;
  creditCount: number;
  creditUsed: number;
  licenseKey: string;
}

export interface SiteDetail {
  siteKey: string;
  siteName: string;
  creditCount: number;
  creditUsed: number;
  licenseKey: string;
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
    },
    error: null,
  };
}
