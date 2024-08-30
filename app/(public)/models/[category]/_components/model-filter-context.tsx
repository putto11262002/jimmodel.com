import { Gender } from "@/lib/types/common";
import react from "react";
export type ModelFilterContext = {
  state: {
    gender?: Gender;
    inTown?: boolean;
    directBooking?: boolean;
    local?: boolean;
  };
  update: (state: Partial<ModelFilterContext["state"]>) => void;
};

export const modelFilterContext = react.createContext<ModelFilterContext>({
  state: {},
  update: () => {},
});

export const useModelFilter = () => react.useContext(modelFilterContext);

export default function ModelFilterContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = react.useState<ModelFilterContext["state"]>({});
  const update = (state: Partial<ModelFilterContext["state"]>) => {
    setState((prev) => ({ ...prev, ...state }));
  };
  return (
    <modelFilterContext.Provider value={{ state, update }}>
      {children}
    </modelFilterContext.Provider>
  );
}
