import type { AxiosInstance } from "axios";
import axios from "axios";
import constants from "../components/common/constants";
import { useAuth } from "../components/auth/useAuth";

export const useAxiosForApi = (): [AxiosInstance] => {
    const auth = useAuth();

    if (!auth.token) {
        throw new Error("No auth token available. This hook cannot be used outside of an authenticated context.");
    }

    const instance = axios.create({ baseURL: constants.API_HOST, headers: { Authorization: "Bearer " + auth.token } });
    return [instance,];
};