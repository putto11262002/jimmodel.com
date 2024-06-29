export const removeParam = (
  name: string,
  value: string,
  readOnlySearchParams: URLSearchParams,
) => {
  const params = new URLSearchParams(readOnlySearchParams.toString());
  const updated = params.getAll(name).filter((v) => v != value);
  params.delete(name);
  if (updated.length > 0) {
    updated.forEach((v) => params.append(name, v));
  }
  return params;
};

export const appendParam = (
  name: string,
  values: string[],
  readOnlySearchParams: URLSearchParams,
) => {
  const params = new URLSearchParams(readOnlySearchParams.toString());
  values.forEach((value) => params.append(name, value));
  return params.toString();
};

export const setParam = (
  name: string,
  values: string[],
  readOnlySearchParams: URLSearchParams,
) => {
  const params = new URLSearchParams(readOnlySearchParams.toString());
  params.delete(name);
  values.forEach((value) => params.append(name, value));
  return params;
};
