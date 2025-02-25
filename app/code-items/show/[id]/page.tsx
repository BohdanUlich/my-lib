import { cookies } from "next/headers";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { CODEITEMS_API_ENDPOINT } from "@/types";
import { fetchOneCodeItem } from "@/api/codeItems/fetchOneCodeItem";
import { ShowCodeItem } from "./show";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

const CodeIteShowPage = async ({ params }: EditPageProps) => {
  const queryClient = new QueryClient();
  const { id: codeItemId } = await params;
  const resolvedCookies = await cookies();

  await queryClient.prefetchQuery({
    queryKey: [CODEITEMS_API_ENDPOINT, codeItemId],
    queryFn: () =>
      fetchOneCodeItem({ codeItemId, headers: { Cookie: resolvedCookies } }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ShowCodeItem />
    </HydrationBoundary>
  );
};

export default CodeIteShowPage;
