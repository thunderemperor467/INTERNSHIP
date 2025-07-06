import React from "react";

export default function AxisPicker({ columns, axis, setAxis, filterNumeric = false, numericColumns = [] }) {
  // If filterNumeric is true, show only numericColumns, else show all
  const options = filterNumeric ? numericColumns : columns;

  return (
    <select
      value={axis}
      onChange={(e) => setAxis(e.target.value)}
      className="p-2 border rounded bg-white shadow"
    >
      <option value="">Select column</option>
      {options.map((col) => (
        <option key={col} value={col}>
          {col}
        </option>
      ))}
    </select>
  );
}
