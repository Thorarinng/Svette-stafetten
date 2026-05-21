interface ToggleOption<T extends string> {
  value: T
  label: string
  icon?: string
}

interface ToggleGroupProps<T extends string> {
  label: string
  value: T
  options: ToggleOption<T>[]
  onChange: (value: T) => void
}

export function ToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: ToggleGroupProps<T>) {
  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-gray-600">{label}</span>
      <div className="flex rounded-xl bg-gray-100 p-1 ring-1 ring-gray-200/60">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
              value === opt.value
                ? 'bg-primary text-secondary shadow-[0_4px_12px_rgba(240,189,0,0.35)]'
                : 'text-gray-500 hover:bg-white/80 hover:text-gray-600'
            }`}
          >
            {opt.icon && <span className="mr-1">{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
