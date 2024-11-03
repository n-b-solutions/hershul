import { CronJob } from 'cron';
import ControlByWebService from './control-by-web.service';

const activePolls: { [ipAddress: string]: CronJob } = {};

export const startPolling = (ipAddress: string, interval: number = 1000) => {
  if (activePolls[ipAddress]) {
    console.log(`Polling already active for IP ${ipAddress}`);
    return;
  }

  const poll = new CronJob(`*/${interval / 1000} * * * * *`, async () => {
    try {
      const { status, color } = await ControlByWebService.getBulbStatusByIp(ipAddress);
      console.log(`Polled update: Status ${status}, Color ${color}`);
      //socket.emit('bulbStatusUpdated', { roomId, status, color });
      // Process the polled update as needed
    } catch (error) {
      console.error(`Error polling bulb status from ControlByWeb: ${error}`);
    }
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
