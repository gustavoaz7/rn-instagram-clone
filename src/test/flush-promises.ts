export function flushPromises(): Promise<void> {
  return new Promise(res => process.nextTick(res));
}
