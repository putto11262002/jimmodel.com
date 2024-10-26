import {
  SearchParamSafeEntry,
  SearchParamValue,
} from "@/lib/types/search-param";
import { objToSearchParamsObj } from "@/lib/utils/search-param";
import Form from "next/form";

export type SearchParamsFormProps = {
  obj: {
    [key: string]: SearchParamSafeEntry;
  };
  button?: React.ReactNode;
  path?: string;
};

export default function SearchParamsForm({
  obj,
  button,
  path,
}: SearchParamsFormProps) {
  return (
    <Form action={""}>
      {button}
      {Object.entries(objToSearchParamsObj(obj)).map(([key, value]) => {
        const values = Array.isArray(value) ? value : [value];
        return values.map((v, index) => {
          return <input key={index} name={key} value={v} hidden />;
        });
      })}
      <input name="to" value={path || ""} hidden />
    </Form>
  );
}
