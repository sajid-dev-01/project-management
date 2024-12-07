import Axios from "axios";

import { env } from "@/env";

export const axios = Axios.create({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  timeout: 30000,
  withCredentials: true,
});
