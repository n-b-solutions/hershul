import RoomService from "./room.service";
import ControlByWebService from "./control-by-web.service";
import { CronJob } from "cron";
import { AxiosError } from "axios";

const activePolls: { [ipAddress: string]: CronJob } = {};

const MAX_RETRIES = 5;
const INITIAL_BACKOFF = 1000; // 1 second

const pollWithRetry = async (
  ipAddress: string,
  retries = 0,
  backoff = INITIAL_BACKOFF
) => {
  try {
    const { status, color } = await ControlByWebService.getBulbStatusByIp(
      ipAddress
    );
    console.log(`Polled update: Status ${status}, Color ${color}`);
    await RoomService.updateFromControlByWeb(ipAddress, status, color);
  } catch (error) {
    if ((error as AxiosError).code === "ECONNRESET" && retries < MAX_RETRIES) {
      console.error(
        `Error polling bulb status from ControlByWeb: ${
          (error as AxiosError).message
        }. Retrying in ${backoff}ms...`
      );
      setTimeout(
        () => pollWithRetry(ipAddress, retries + 1, backoff * 2),
        backoff
      );
    } else {
      console.error(
        `Error polling bulb status from ControlByWeb: ${
          (error as AxiosError).message
        }. Max retries reached.`
      );
    }
  }
};

export const startPolling = (ipAddress: string, interval: number = 1000) => {
  if (activePolls[ipAddress]) {
    console.log(`Polling already active for IP ${ipAddress}`);
    return;
  }

  const poll = new CronJob(`*/${interval / 1000} * * * * *`, () => {
    pollWithRetry(ipAddress);
  });

  poll.start();
  activePolls[ipAddress] = poll;
};

export const stopPolling = (ipAddress: string) => {
  if (activePolls[ipAddress]) {
    activePolls[ipAddress].stop();
    delete activePolls[ipAddress];
    console.log(`Stopped polling for IP ${ipAddress}`);
  }
};
