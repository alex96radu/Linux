import { NetworkInterfaceInfo, networkInterfaces } from "os"

export function concatenateOnSameLine(s1: string[], s2: string[] = []): string[] {
  const size = Math.max(s1.length, s2.length)
  const res: string[] = []
  for (let i = 0; i < size; ++i) {
    if (i < s1.length && i < s2.length) {
      res[i] = s1[i] + s2[i]
    } else if (i < s1.length) {
      res[i] = s1[i]
    } else {
      res[i] = s1[i]
    }
  }
  return res
}

const interfaces = networkInterfaces()
export const validInterface: NetworkInterfaceInfo | undefined = Object.keys(interfaces)
  .map((key : string) => interfaces[key])
  .filter(n => n !== undefined)
  .map(n => n as NetworkInterfaceInfo[])
  .reduce((res: NetworkInterfaceInfo[], arr: NetworkInterfaceInfo[]) => {
    return [...res, ...arr]
  }, [])
  .filter((n: NetworkInterfaceInfo) => n.family == 'IPv4')
  .find((n: NetworkInterfaceInfo) => !n.internal)