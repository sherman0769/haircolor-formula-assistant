import { LEVEL_OPTIONS } from "@/lib/constants";

type LevelSelectorProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export function LevelSelector({
  id,
  label,
  value,
  onChange,
}: LevelSelectorProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-11 w-full rounded-md border border-border bg-panel px-3 text-sm outline-none focus:border-accent"
      >
        {LEVEL_OPTIONS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </label>
  );
}
