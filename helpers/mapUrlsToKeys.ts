export const mapUrlsToKeys = (imageUrls: string[]) => {
  const keys: string[] = imageUrls.map((url: string) => {
    const key = new URL(url).pathname.substring(1);

    const decodedKey = decodeURIComponent(key);

    return decodedKey;
  });

  return keys;
};
