import dayjs from "@/lib/dayjs";

import { DATE_FORMAT_UI } from "@/constants";

export const formatDate = (date: any) =>
  dayjs(date).tz("Asia/Kolkata").format(DATE_FORMAT_UI);

export const formatTime = (date: any) =>
  dayjs(date).tz("Asia/Kolkata").format("hh:mm A");

export const formatDateTime = (date: any) =>
  dayjs(date).tz("Asia/Kolkata").format("DD MMM YYYY hh:mm A");