"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState(
    Array.from({ length: 100 }, () => ({
      qty: "",
      description: "",
      notes: "",
    })),
  );

  const handleChange = (rowIndex: number, col: string, value: string) => {
    const newFormData = [...formData];
    if (newFormData[rowIndex]) {
      newFormData[rowIndex][col as keyof (typeof newFormData)[number]] = value;
    }
    setFormData(newFormData);
  };

  interface FormData {
    qty: string;
    description: string;
    notes: string;
  }

  interface KeyDownEvent extends React.KeyboardEvent<HTMLInputElement> {
    key: string;
  }

  const handleKeyDown = (
    event: KeyDownEvent,
    rowIndex: number,
    col: keyof FormData,
  ) => {
    const colOrder: (keyof FormData)[] = ["qty", "description", "notes"];
    const colIndex = colOrder.indexOf(col);

    if (event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      const nextRow = document.querySelector<HTMLInputElement>(
        `#input-${rowIndex + 1}-${col}`,
      );
      if (nextRow) {
        nextRow.focus();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevRow = document.querySelector<HTMLInputElement>(
        `#input-${rowIndex - 1}-${col}`,
      );
      if (prevRow) {
        prevRow.focus();
      }
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextCol = colOrder[colIndex + 1];
      if (nextCol) {
        const nextCell = document.querySelector<HTMLInputElement>(
          `#input-${rowIndex}-${nextCol}`,
        );
        if (nextCell) {
          nextCell.focus();
        }
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prevCol = colOrder[colIndex - 1];
      if (prevCol) {
        const prevCell = document.querySelector<HTMLInputElement>(
          `#input-${rowIndex}-${prevCol}`,
        );
        if (prevCell) {
          prevCell.focus();
        }
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add your database submission logic here
    console.log(
      "Form Data:",
      formData.filter((a) => a.qty || a.description || a.notes),
    );
  };

  return (
    <div className="w-full">
      <div className="text-center text-2xl font-bold">
        TAYLOR GROUP ITEMS LIST
      </div>
      <form onSubmit={handleSubmit}>
        <table className="m-4 table-auto border-collapse">
          <thead>
            <tr className="grid border-collapse grid-cols-12 bg-gray-700 text-gray-100">
              <th className="col-span-1 p-1 font-bold">QTY</th>
              <th className="col-span-6 py-1 pl-6 text-left font-bold">
                Description
              </th>
              <th className="col-span-5 py-1 pl-6 text-left font-bold">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {formData.map((row, rowIndex) => (
              <tr key={rowIndex} className="grid border-collapse grid-cols-12">
                <td className="col-span-1 border border-gray-500 p-1">
                  <input
                    type="text"
                    id={`input-${rowIndex}-qty`}
                    value={row.qty}
                    onChange={(e) =>
                      handleChange(rowIndex, "qty", e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "qty")}
                    className="w-full border-none text-center focus:outline-none"
                  />
                </td>
                <td className="col-span-6 border border-gray-500 p-1">
                  <input
                    type="text"
                    id={`input-${rowIndex}-description`}
                    value={row.description}
                    onChange={(e) =>
                      handleChange(rowIndex, "description", e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "description")}
                    className="w-full border-none focus:outline-none"
                  />
                </td>
                <td className="col-span-5 border border-gray-500 p-1">
                  <input
                    type="text"
                    id={`input-${rowIndex}-notes`}
                    value={row.notes}
                    onChange={(e) =>
                      handleChange(rowIndex, "notes", e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "notes")}
                    className="w-full border-none focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="submit"
          className="fixed bottom-4 right-4 rounded bg-green-500 px-8 py-4 text-2xl text-white"
        >
          Save
        </button>
      </form>
    </div>
  );
}
