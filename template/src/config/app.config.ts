// Define valid log levels to align with Logger
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// Interface for AppConfig with stricter typing
interface AppConfig {
    nodeEnv: 'development' | 'production' | 'test';
    port: number;
    apiPrefix: string;
    enableDatabase: boolean;
    database?: {
        url: string;
        name: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    logLevel: LogLevel;
}

// Utility to validate environment variables and throw errors for missing/invalid ones
const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is missing`);
    }
    return value;
};

// Validate log level
const validateLogLevel = (level: string): LogLevel => {
    const validLevels: LogLevel[] = ['error', 'warn', 'info', 'debug'];
    if (!validLevels.includes(level as LogLevel)) {
        throw new Error(`Invalid log level: ${level}. Must be one of ${validLevels.join(', ')}`);
    }
    return level as LogLevel;
};

// Validate node environment
const validateNodeEnv = (env: string): 'development' | 'production' | 'test' => {
    const validEnvs = ['development', 'production', 'test'];
    if (!validEnvs.includes(env)) {
        throw new Error(`Invalid NODE_ENV: ${env}. Must be one of ${validEnvs.join(', ')}`);
    }
    return env as 'development' | 'production' | 'test';
};

// App configuration
export const appConfig: AppConfig = {
    nodeEnv: validateNodeEnv(getEnvVar('NODE_ENV', 'development')),
    port: parseInt(getEnvVar('PORT', '5000'), 10),
    apiPrefix: getEnvVar('API_PREFIX', '/api'),
    enableDatabase: getEnvVar('ENABLE_DATABASE', 'false') === 'true',
    database: process.env.ENABLE_DATABASE === 'true' ? {
        url: getEnvVar('DATABASE_URL'),
        name: getEnvVar('DATABASE_NAME', 'default_db'),
    } : undefined,
    jwt: {
        secret: getEnvVar('JWT_SECRET', 'your_jwt_secret_key_here'),
        expiresIn: getEnvVar('JWT_EXPIRE', '30d'),
    },
    logLevel: validateLogLevel(getEnvVar('LOG_LEVEL', 'info')),
};