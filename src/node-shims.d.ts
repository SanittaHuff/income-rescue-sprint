declare module "node:fs/promises" {
  export function writeFile(path: string, data: string, encoding: string): Promise<void>;
  export function readFile(path: string, encoding: string): Promise<string>;
  export function mkdir(path: string, options?: { recursive?: boolean }): Promise<string | undefined>;
  export function rename(oldPath: string, newPath: string): Promise<void>;
  export function mkdtemp(prefix: string): Promise<string>;
  export function rm(path: string, options?: { recursive?: boolean; force?: boolean }): Promise<void>;
}
declare module "node:fs" {
  export function readFileSync(path: URL | string, encoding: string): string;
  export function writeFileSync(path: URL | string, data: string, encoding: string): void;
  export function readdirSync(path: URL): string[];
}
declare module "node:path" {
  export function dirname(path: string): string;
  export function join(...paths: string[]): string;
}
declare module "node:os" {
  export function tmpdir(): string;
}
declare module "node:crypto" {
  export function createHash(algorithm: string): {
    update(data: string): { digest(encoding: "hex"): string };
    digest(encoding: "hex"): string;
  };
}
declare module "node:child_process" {
  export function spawn(command: string, args: string[], options: { stdio: string[] }): {
    stderr: { on(event: "data", listener: (chunk: Buffer) => void): void };
    on(event: "close", listener: (code: number | null) => void): void;
    on(event: "error", listener: (error: Error) => void): void;
  };
}
declare module "node:path" {
  export function dirname(path: string): string;
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
}
declare class Buffer extends Uint8Array {
  static from(input: string, encoding?: string): Buffer;
  static alloc(size: number): Buffer;
  static concat(list: readonly Uint8Array[]): Buffer;
  toString(encoding?: string): string;
}
