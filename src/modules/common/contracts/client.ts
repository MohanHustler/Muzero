export interface ClientData {
  fingerprint: number;
  user_agent: string;
  browser: string;
  browser_version: string;
  engine: string;
  engine_version: string;
  os: string;
  os_version: string;
  device: string;
  device_type: string;
  device_vendor: string;
  cpu: string;
  color_depth: string;
  current_resolution: string;
  available_resolution: string;
  device_xdpi: string;
  device_ydpi: string;
  timezone: string;
  language: string;
  system_language: string;
  [key: string]: string | number;
}
