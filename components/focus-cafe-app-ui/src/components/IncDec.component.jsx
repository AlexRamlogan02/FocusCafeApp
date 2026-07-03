import React, { useEffect, useState } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa6";

const IncDec = ({
  label = '',
  min = 0,
  jump = 1,
  initialValue = min,
  value: controlledValue,
  onChange = () => {},
  onIncrease = () => {},
  onDecrease = () => {},
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue ?? initialValue);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
      return;
    }

    setInternalValue((current) => {
      if (current < min || Number.isNaN(Number(current))) {
        return min;
      }
      return current;
    });
  }, [controlledValue, min]);

  const value = controlledValue ?? internalValue;

  const handleDecrease = () => {
    const nextValue = Math.max(min, Number(value) - jump);
    if (controlledValue === undefined) {
      setInternalValue(nextValue);
    }
    onChange(nextValue);
    onDecrease(nextValue);
  };

  const handleIncrease = () => {
    const nextValue = Number(value) + jump;
    if (controlledValue === undefined) {
      setInternalValue(nextValue);
    }
    onChange(nextValue);
    onIncrease(nextValue);
  };

  const handleChange = (event) => {
    const rawValue = event.target.value;
    if (rawValue === '') {
      if (controlledValue === undefined) {
        setInternalValue('');
      }
      return;
    }

    const nextValue = Number(rawValue);
    if (!Number.isNaN(nextValue)) {
      if (controlledValue === undefined) {
        setInternalValue(nextValue);
      }
      onChange(nextValue);
    }
  };

  const handleBlur = () => {
    const nextValue = Number(value);
    if (Number.isNaN(nextValue) || nextValue < min) {
      if (controlledValue === undefined) {
        setInternalValue(min);
      }
      onChange(min);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {label ? <span className="text-sm font-medium text-[var(--text-color)]">{label}</span> : null}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={Number(value) <= min}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-sm font-semibold text-[var(--text-color)] transition hover:bg-[var(--secondary)]/10 dark:bg-slate-900/80"
        >
          <FaMinus className="h-4 w-4" />
        </button>
        <input
          type="number"
          value={value}
          min={min}
          step={jump}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-9 w-20 rounded-lg border border-[color:var(--secondary)]/20 bg-white px-3 text-center text-sm font-medium text-[var(--text-color)] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={handleIncrease}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-sm font-semibold text-[var(--text-color)] transition hover:bg-[var(--secondary)]/10 dark:bg-slate-900/80"
        >
          <FaPlus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default IncDec;
