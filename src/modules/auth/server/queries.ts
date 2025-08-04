import {
  getOrganizationNames,
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
