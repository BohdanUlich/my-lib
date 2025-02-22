import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { CODEITEMS_API_ENDPOINT } from "@/types";
import { fetchCodeItems } from "@/api/codeItems/fetchCodeItems";
import { CodeItemsList } from "./CodeItemsList";
import { cookies } from "next/headers";

interface CodeItemsPageProps {
  searchParams:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined;
}

const CodeItemsPage = async ({ searchParams }: CodeItemsPageProps) => {
  const queryClient = new QueryClient();
  const resolvedSearchParams = await searchParams;
  const resolvedCookies = await cookies();
  const params = new URLSearchParams(resolvedSearchParams);
  const categoryId = params.get("categoryId");

  const codeItemsResponse = await queryClient.fetchInfiniteQuery({
    queryKey: [CODEITEMS_API_ENDPOINT, null, categoryId, []],
    initialPageParam: 1,
    queryFn: () =>
      fetchCodeItems({
        q: null,
        categoryId,
        labels: [],
        page: 1,
        limit: 20,
        headers: { Cookie: resolvedCookies },
      }),
  });
  const pageTitle = codeItemsResponse?.pages[0].pageTitle ?? "Code items";

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CodeItemsList pageTitle={pageTitle} />
    </HydrationBoundary>
  );
};

export default CodeItemsPage;
