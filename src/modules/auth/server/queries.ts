import {
  getOrganizationNames,
  getRsaKey,
  type OrganizationNamesReq,
} from "@/modules/auth/server/api";
import { queryOptions } from "@tanstack/react-query";

export const organizationNamesOptions = (data: OrganizationNamesReq) =>
  queryOptions({
    queryKey: ["organization-names", data],
    queryFn: () => getOrganizationNames(data),
    select: (data) => data.data,
    enabled: !!data.name,
  });

export const rsaKeyOptions = () =>
  queryOptions({
    queryKey: ["rsa-key"],
    queryFn: getRsaKey,
    select: (data) => data.data,
  });
