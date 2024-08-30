export const removeParam = (
  name: string,
  value: string,
  params: URLSearchParams,
) => {
  const updated = params.getAll(name).filter((v) => v != value);
  params.delete(name);
  if (updated.length > 0) {
    updated.forEach((v) => params.append(name, v));
  }
};

export const removeAllParams = (
  name: string,
  searchParams: URLSearchParams,
) => {
  searchParams.delete(name);
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
  values: string[] | string,
  params: URLSearchParams,
) => {
  params.delete(name);
  if (Array.isArray(values)) {
    values.forEach((value) => params.append(name, value));
  } else {
    params.set(name, values);
  }
};
export const URLSearchParamsFromObj = (
  obj: Record<string, string | string[]>,
) => {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.set(key, value);
    }
  });
  return params;
};

export const setParamSSR = (
  name: string,
  values: string | string[],
  params: Record<string, string | string[]>,
) => {
  const mutatbleSearchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (!value || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((v) => mutatbleSearchParams.append(key, v));
    } else {
      mutatbleSearchParams.set(key, value);
    }
  });
  setParam(name, values, mutatbleSearchParams);
  return mutatbleSearchParams.toString();
};

export const searchParamsToString = (searchParams: {
  [key: string]: string[] | string;
}) => {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.append(key, value);
    }
  });
  return params.toString();
};
