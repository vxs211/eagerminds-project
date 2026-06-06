export const dynamic = "force-dynamic";

import EditBookmarkClient from "../edit-bookmark-client";

type Props = {
  params: {
    id: string;
  };
};

export default function EditBookmark({ params }: Props) {
  return <EditBookmarkClient bookmarkId={params.id} />;
}
