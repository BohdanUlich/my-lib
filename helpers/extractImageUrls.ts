export const extractImageUrls = (html: string) => {
  const imgTags = html.match(/<img [^>]*src="[^"]*"[^>]*>/gm) || [];
  return imgTags
    .map((tag) => {
      const match = tag.match(/src="([^"]*)"/);
      return match ? match[1] : null;
    })
    .filter(Boolean) as string[];
};
