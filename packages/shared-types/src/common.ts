export type UUID = string;

export type ISODateString = string;

export type Nullable<T> = T | null;

export type Result<T, E = Error> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type SortDirection = "asc" | "desc";

export type Sort = {
  field: string;
  direction: SortDirection;
}; 
