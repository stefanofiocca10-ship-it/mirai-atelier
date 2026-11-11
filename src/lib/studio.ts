import { prisma } from "@/lib/prisma";
import {
  DEFAULT_ADDRESS,
  DEFAULT_SCHEDULE,
  SETTING_KEYS,
  normalizeSchedule,
  resolveMapsUrl,
  type DaySchedule,
  type StudioInfo,
} from "@/lib/studio-shared";

export * from "@/lib/studio-shared";

async function getSetting(key: string) {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function getStudioInfo(): Promise<StudioInfo> {
  const [addressRaw, mapsRaw, scheduleRaw] = await Promise.all([
    getSetting(SETTING_KEYS.address),
    getSetting(SETTING_KEYS.mapsUrl),
    getSetting(SETTING_KEYS.schedule),
  ]);

  const address = addressRaw?.trim() || DEFAULT_ADDRESS;
  let schedule = DEFAULT_SCHEDULE;
  if (scheduleRaw) {
    try {
      schedule = normalizeSchedule(JSON.parse(scheduleRaw));
    } catch {
      schedule = DEFAULT_SCHEDULE;
    }
  }

  return {
    address,
    mapsUrl: resolveMapsUrl(address, mapsRaw),
    schedule,
  };
}

export async function saveStudioInfo(input: {
  address: string;
  mapsUrl: string;
  schedule: DaySchedule[];
}) {
  const address = input.address.trim() || DEFAULT_ADDRESS;
  const mapsUrl = input.mapsUrl.trim();
  const schedule = normalizeSchedule(input.schedule);

  await prisma.$transaction([
    prisma.siteSetting.upsert({
      where: { key: SETTING_KEYS.address },
      update: { value: address },
      create: { key: SETTING_KEYS.address, value: address },
    }),
    prisma.siteSetting.upsert({
      where: { key: SETTING_KEYS.mapsUrl },
      update: { value: mapsUrl },
      create: { key: SETTING_KEYS.mapsUrl, value: mapsUrl },
    }),
    prisma.siteSetting.upsert({
      where: { key: SETTING_KEYS.schedule },
      update: { value: JSON.stringify(schedule) },
      create: {
        key: SETTING_KEYS.schedule,
        value: JSON.stringify(schedule),
      },
    }),
  ]);

  return getStudioInfo();
}
