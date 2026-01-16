import { LucideIcon } from "lucide-react";

interface ViewModeToggleProps<T extends string> {
  modes: { id: T; icon: LucideIcon; label: string }[];
  activeMode: T;
  onChange: (mode: T) => void;
}

export const ViewModeToggle = <T extends string>({
  modes,
  activeMode,
  onChange,
}: ViewModeToggleProps<T>) => {
  return (
    <div className="bg-white p-1 rounded-xl flex items-center gap-1 border border-gray-200">
      {modes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeMode === id
              ? "bg-blue-50 text-[#204ecf]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
};
