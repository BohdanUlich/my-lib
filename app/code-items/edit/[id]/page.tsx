import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { EditCodeItem } from "./edit";
import { CODEITEMS_API_ENDPOINT } from "@/types";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/configs";
import { fetchOneCodeItem } from "@/api/codeItems/fetchOneCodeItem";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditPage({ params }: EditPageProps) {
  const queryClient = new QueryClient();
  const session = await getServerSession(authConfig);
  const userId = session?.user.id;
  const { id: codeItemId } = params;

  await queryClient.prefetchQuery({
    queryKey: [CODEITEMS_API_ENDPOINT, codeItemId],
    queryFn: () => fetchOneCodeItem({ userId, codeItemId }),
  });

  const dehydratedState = dehydrate(queryClient);
  console.log(dehydratedState);

  return (
    <HydrationBoundary state={dehydratedState}>
      <EditCodeItem />
    </HydrationBoundary>
  );
}
