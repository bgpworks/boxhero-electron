import electron from 'electron';
import path from 'path';
import fs from 'fs';
import { MIN_WIDTH, MIN_HEIGHT } from './constants';

export const defaultStoreData = {
    windowBounds: {
      width: MIN_WIDTH,
      height: MIN_HEIGHT,
    }
}

// 이 곳 부터는 Store 관련 코드

type DefaultStoreData = typeof defaultStoreData;

interface StoreOptions {
  configName: string;
  defaults?: StoreData;
}

interface StoreData extends DefaultStoreData{
  [key: string]: any;
}

class Store {
  private path: string;
  private data: StoreData;

  constructor({ configName, defaults = defaultStoreData }: StoreOptions) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath(
      'userData',
    );
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, configName + '.json');
    this.data = parseDataFile(this.path, defaults);
  }

  // This will just return the property on the `data` object
  get<k extends keyof StoreData>(key: k):StoreData[k] {
    return this.data[key];
  }

  // ...and this will set it
  set<k extends keyof StoreData>(key: k, val: StoreData[k]) {
    this.data[key] = val;
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath: string, defaults: StoreData) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

// expose the class
export default Store;
