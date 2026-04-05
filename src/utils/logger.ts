export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export function log(level: LogLevel, message: string): void {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    console.log(`[${timestamp}] [${level}] ${message}`);
}
