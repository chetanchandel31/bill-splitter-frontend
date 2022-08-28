import { useContext } from "react";
import { GroupContext } from "./group-context";

export const useSelectedGroup = () => useContext(GroupContext);
