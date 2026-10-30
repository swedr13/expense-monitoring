import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

/** Days start and end in Manila, wherever the phone thinks it is. */
export const appTimeZone = "Asia/Manila";

/** The Manila calendar day of `at` (default now) as `YYYY-MM-DD`, the `spent_on` format. */
export const manilaDay = (at: dayjs.ConfigType = undefined) =>
  dayjs(at).tz(appTimeZone).format("YYYY-MM-DD");

export { dayjs };
