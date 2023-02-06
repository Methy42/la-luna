export interface IThrottleOption {
  leading?: boolean;
  trailing?: boolean;
}

export default function throttle (callback: Function, wait: number = 0, option: IThrottleOption = {
  leading: true,
  trailing: true
}) {
  let lastRunTime = 0;

  const resultFunction =  (...arg: Array<unknown>) => {
    if (new Date().getTime() - lastRunTime < wait) return;
    lastRunTime = new Date().getTime()
    callback(...arg);
  }

  resultFunction.prototype.cancel = () => {}

  resultFunction.prototype.flush = (...arg: Array<unknown>) => callback(...arg);
}