import { Suspense } from "react";
import _Pagination, { PaginationProps } from "./client";

export default function Pagination(props: PaginationProps) {
  return (
    <Suspense>
      <_Pagination {...props} />{" "}
    </Suspense>
  );
}
