import { atom, useAtomValue, useSetAtom } from "jotai";
import { AppStatus, RequestAtom } from "@/types";
import { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "@/constants";
import { useAccount } from "wagmi";

export const appStatusAtom = atom<RequestAtom<AppStatus>>({
  data: null,
  error: null,
  metadata: null,
});

export const useAppStatus = () => useAtomValue(appStatusAtom);

export const useAppStatusUpdater = () => {
  const set = useSetAtom(appStatusAtom);
  useEffect(() => {
    let data: AppStatus | null;
    let error: Error | null;
    let metadata: AxiosResponse<AppStatus> | null;
    let timeout;
    const update = async () => {
      try {
        const res = await axios.get<AppStatus>(`${API_URL}/status`);
        metadata = res;
        data = res.data;
        error = null;
      } catch (e) {
        error = e as Error;
        console.error(e);
      } finally {
        set({
          data,
          error,
          metadata,
        });
        setTimeout(update, 2000);
      }
    };
    update().catch(() => {
      // noop
    });
    return clearTimeout(timeout);
  }, [set]);
};

export const currentCybrosAddress = atom<string>("");
