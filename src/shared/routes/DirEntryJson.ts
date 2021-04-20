export interface DirEntryJson {
  path: string;
  name: string;
  dirname: string;
  type: "file" | "directory" | "other";
}
