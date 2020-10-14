"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistWindowState = exports.getWindowState = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importStar(require("fs"));
const electron_1 = require("electron");
const logFileName = 'window_state.json';
let logPath;
const defaultState = {
    position: {
        x: 0,
        y: 0,
    },
    size: {
        width: 500,
        height: 500,
    },
};
const getWindowStateLogPath = () => {
    if (logPath)
        return logPath;
    logPath = path_1.default.resolve(electron_1.app.getPath('userData'), logFileName);
    return logPath;
};
const setWindowState = (key, value) => {
    const logPath = getWindowStateLogPath();
    const prevState = exports.getWindowState(defaultState);
    const newState = {
        ...prevState,
        ...{ [key]: value },
    };
    const logJson = JSON.stringify(newState, null, 2);
    fs_1.writeFileSync(logPath, logJson, 'utf-8');
};
exports.getWindowState = (defaultState) => {
    let windowStateTmp = {};
    try {
        const logPath = getWindowStateLogPath();
        const logText = fs_1.default.readFileSync(logPath, 'utf-8');
        windowStateTmp = JSON.parse(logText);
        if (typeof windowStateTmp !== 'object')
            throw new Error();
    }
    catch {
        return defaultState;
    }
    return { ...defaultState, ...windowStateTmp };
};
const saveSize = (targetWindow) => {
    const [width, height] = targetWindow.getSize();
    setWindowState('size', { width, height });
};
const savePosition = (targetWindow) => {
    const [x, y] = targetWindow.getPosition();
    setWindowState('position', { x, y });
};
exports.persistWindowState = (targetWindow) => {
    targetWindow.on('resize', () => {
        saveSize(targetWindow);
    });
    targetWindow.on('moved', () => {
        savePosition(targetWindow);
    });
    targetWindow.once('close', () => {
        saveSize(targetWindow);
        savePosition(targetWindow);
    });
};
