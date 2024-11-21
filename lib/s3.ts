import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

interface UploadFileParams {
  file: Buffer;
  fileName: string;
  mimeType: string;
}

interface DeleteFileParams {
  key: string;
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFile = async ({
  file,
  fileName,
  mimeType,
}: UploadFileParams) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: mimeType,
  };

  const command = new PutObjectCommand(params);
  return s3.send(command);
};

export const deleteFile = async ({ key }: DeleteFileParams) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  await s3.send(command);
};
