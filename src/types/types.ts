interface PackageManagerOptions {
  platform: string;
  installCmd: string;
  installArgs: (pkg: string) => string[];
  updateCmd: string;
  installLabel: string;
  updateLabel: string;
  exitLabel: string;
  onlyPlatformMsg: string;
  updateSuccessMsg: string;
  exitMsg: string;
}

export { type PackageManagerOptions };
