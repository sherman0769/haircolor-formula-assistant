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
        className="mt-2 h-12 w-full rounded-md border border-border bg-panel px-3 text-base outline-none focus:border-accent sm:text-sm"
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
