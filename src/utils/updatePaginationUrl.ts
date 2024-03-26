import { max, parseInt } from "lodash";

const updatePaginationUrl = (url: string): string => {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);

  const currentPage: number = parseInt(max(params.getAll("page") || []) || "1") || 1;
  const nextPage: number = currentPage + 1;

  params.delete("page");
  params.set("page", nextPage.toString());

  urlObj.search = params.toString();

  return urlObj.toString();
};

export { updatePaginationUrl };
