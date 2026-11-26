import { LevelCheck } from "@/shared/components/LevelCheck";
import { healthLabel, healthLevel } from "../summary";

/** A check coloured by how many habits were done: green 4–5, yellow 2–3, red 0–1. */
export const HealthLevelCheck = ({ done }: { done: number }) => (
  <LevelCheck level={healthLevel(done)} label={healthLabel(done)} />
);
