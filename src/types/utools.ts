export const utools = window.utools;

export interface UToolsAPI {
  // 数据库存储
  dbStorage: {
    setItem(key: string, value: any): void;
    getItem(key: string): any;
    removeItem(key: string): void;
  };
  
  // 路径相关
  getPath(name: 'appData'): string;
  
  // 生命周期事件
  onPluginReady(callback: () => void): void;
  onPluginEnter(callback: (args: { code: string }) => void): void;
  onPluginOut(callback: () => void): void;
  
  // 其他API
  [key: string]: any;
}