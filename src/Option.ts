export interface Option {
  prefix?: string;
  srcDir?: string;
  distDir?: string;
  body?: string;
  style?: string;
  port?: number;
  open?: boolean;
  host?: string;
}

export interface InitializedOption extends Option {
  prefix: string;
  srcDir: string;
  distDir: string;
  body: string;
  style: string;
}

export function initOptions(option?: Option): InitializedOption {
  option = option ?? {};
  option.prefix = option.prefix ?? "demo";
  option.srcDir = option.srcDir ?? "./demoSrc";
  option.distDir = option.distDir ?? "./docs/demo";
  option.body = option.body ?? "";
  option.style = option.style ?? "";

  return option as InitializedOption;
}
