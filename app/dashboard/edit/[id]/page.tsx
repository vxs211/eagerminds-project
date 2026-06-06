export const dynamic = "force-dynamic";

import EditBookmarkClient from "../edit-bookmark-client";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBookmark({ params }: Props) {
  const { id } = await params;
  return <EditBookmarkClient bookmarkId={id} />;
}
