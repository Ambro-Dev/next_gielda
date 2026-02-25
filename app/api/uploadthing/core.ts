import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f([
    "image",
    "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ])
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      if (process.env.NODE_ENV === "development") {
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);
      }
    }),
  imageUplaoder: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      if (process.env.NODE_ENV === "development") {
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
