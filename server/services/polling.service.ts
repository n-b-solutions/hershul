import ControlByWebService from "./control-by-web.service";

const activePolls: { [ipAddress: string]: NodeJS.Timeout } = {};

export const startPolling = (ipAddress: string, interval: number = 1000) => {
  if (activePolls[ipAddress]) {
    console.log(`Polling already active for IP ${ipAddress}`);
    return;
  }

  const poll = setInterval(async () => {
    try {
      const { status, color } = await ControlByWebService.getBulbStatusByIp(ipAddress);
      console.log(`Polled update: Status ${status}, Color ${color}`);
      // Process the polled update as needed
    } catch (error) {
      console.error(`Error polling bulb status from ControlByWeb: ${error}`);
    }
  }, interval);

  activePolls[ipAddress] = poll;
};

export const stopPolling = (ipAddress: string) => {
  if (activePolls[ipAddress]) {
    clearInterval(activePolls[ipAddress]);
    delete activePolls[ipAddress];
    console.log(`Stopped polling for IP ${ipAddress}`);
  }
};
