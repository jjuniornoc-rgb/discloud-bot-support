import { config } from '../config';

const cooldownMap = new Map<string, number>();

export function isOnCooldown(userId: string): boolean {
    const lastTime = cooldownMap.get(userId);
    if (!lastTime) return false;
    return Date.now() - lastTime < config.COOLDOWN_SECONDS * 1000;
}

export function setCooldown(userId: string): void {
    cooldownMap.set(userId, Date.now());
}

export function clearExpiredCooldowns(): void {
    const threshold = config.COOLDOWN_SECONDS * 1000;
    const now = Date.now();
    for (const [userId, timestamp] of cooldownMap.entries()) {
        if (now - timestamp >= threshold) {
            cooldownMap.delete(userId);
        }
    }
}

setInterval(clearExpiredCooldowns, 5 * 60 * 1000);
