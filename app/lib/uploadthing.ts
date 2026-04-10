import {
    generateUploadButton,
    generateUploadDropzone,
  } from "@uploadthing/react";
  
  import type { OurFileRouter } from "../api/uploadthing/core";
  import type { ClientUploadedFileData } from "uploadthing/types";

  export const UploadButton = generateUploadButton<OurFileRouter>();
  export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

  /** UploadThing v7 may expose the file URL on `url`, `appUrl`, or `serverData` from `onUploadComplete`. */
  export function resolveUploadedImageUrl(
    res: ClientUploadedFileData<{ imageUrl: string }>[]
  ): string {
    const file = res[0];
    if (!file) return "";
    return (
      (file.url?.trim() ? file.url : "") ||
      (file.appUrl?.trim() ? file.appUrl : "") ||
      (file.serverData?.imageUrl?.trim() ? file.serverData.imageUrl : "")
    );
  }
