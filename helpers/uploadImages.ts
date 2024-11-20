import { fetchService } from "@/services";
import { Image, IMAGES_API_ENDPOINT } from "@/types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

export const uploadImages = async (files: File[]) => {
  try {
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Unsupported file type: ${file.type}`);
      }
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File is too large: ${file.name}`);
      }
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(IMAGES_API_ENDPOINT, file);
    });

    const response = await fetchService(IMAGES_API_ENDPOINT, {
      method: "POST",
      data: formData,
    });

    const uploadedImages = response.data.map((image: Image) => ({
      src: image.url,
      alt: image.name,
    }));

    return uploadedImages;
  } catch (error) {
    console.error("Image upload failed:", error);
    return [];
  }
};
