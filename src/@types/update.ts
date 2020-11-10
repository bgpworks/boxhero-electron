export interface IProgressObject {
  bytesPerSecond: number;
  percent: number;
  transferred: number;
  total: number;
  canceled: boolean;
}
