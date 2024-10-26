export type AsyncUI<T = React.ReactNode> =
  | { value: T; loading: false }
  | { value?: T; loading: true };

export function isAsyncUI<T = React.ReactNode>(
  node: T | AsyncUI<T>
): node is AsyncUI<T> {
  return (
    typeof node === "object" &&
    node !== null &&
    ("loading" in node || "value" in node)
  );
}
