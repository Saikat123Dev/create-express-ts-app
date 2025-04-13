import { appConfig } from '../config/app.config';
import chalk from 'chalk';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const logLevels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

class Logger {
    private level: number;

    constructor() {
        this.level = logLevels[appConfig.logLevel as LogLevel] || logLevels.info;
    }

    private shouldLog(level: LogLevel): boolean {
        return logLevels[level] <= this.level;
    }

    private formatMessage(level: string, message: string, ...args: any[]): string {
        const timestamp = new Date().toISOString();
        return `[${chalk.gray(timestamp)}] ${this.getColoredLevel(level)} ${message}`;
    }

    private getColoredLevel(level: string): string {
        switch (level.toLowerCase()) {
            case 'error':
                return chalk.bgRed.white.bold(` ${level.toUpperCase()} `);
            case 'warn':
                return chalk.bgYellow.black.bold(` ${level.toUpperCase()} `);
            case 'info':
                return chalk.bgBlue.white.bold(` ${level.toUpperCase()} `);
            case 'debug':
                return chalk.bgGreen.black.bold(` ${level.toUpperCase()} `);
            default:
                return level.toUpperCase();
        }
    }

    error(message: string, ...args: any[]): void {
        if (this.shouldLog('error')) {
            console.error(
                this.formatMessage('error', chalk.red(message)),
                ...args.map(arg => chalk.red(typeof arg === 'string' ? arg : JSON.stringify(arg)))
            );
        }
    }

    warn(message: string, ...args: any[]): void {
        if (this.shouldLog('warn')) {
            console.warn(
                this.formatMessage('warn', chalk.yellow(message)),
                ...args.map(arg => chalk.yellow(typeof arg === 'string' ? arg : JSON.stringify(arg)))
            );
        }
    }

    info(message: string, ...args: any[]): void {
        if (this.shouldLog('info')) {
            console.info(
                this.formatMessage('info', chalk.blue(message)),
                ...args.map(arg => chalk.blue(typeof arg === 'string' ? arg : JSON.stringify(arg)))
            );
        }
    }

    debug(message: string, ...args: any[]): void {
        if (this.shouldLog('debug')) {
            console.debug(
                this.formatMessage('debug', chalk.green(message)),
                ...args.map(arg => chalk.green(typeof arg === 'string' ? arg : JSON.stringify(arg)))
            );
        }
    }
}

export const logger = new Logger();