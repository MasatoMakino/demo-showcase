export interface Option {
  prefix?: string;
  srcDir?: string;
  distDir?: string;
  body?: string;
  style?: string;
  copyTargets?: string[];
  config?: string;
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
  copyTargets: string[];
}

export function initOptions(option?: Option): InitializedOption {
  option = option ?? {};
  option.prefix = option.prefix ?? "demo";
  option.srcDir = option.srcDir ?? "./demoSrc";
  option.distDir = option.distDir ?? "./docs/demo";
  option.body = option.body ?? "";
  option.style = option.style ?? "";

  const copyDefault = ["png", "jpg", "jpeg"];
  if (option.copyTargets == null) {
    option.copyTargets = copyDefault;
  } else {
    option.copyTargets = [...new Set([...copyDefault, ...option.copyTargets])];
  }

  return option as InitializedOption;
}
