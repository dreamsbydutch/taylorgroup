"use client";

import { useState, useEffect } from "react";

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

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((textarea) =>
      adjustTextareaHeight(textarea as HTMLTextAreaElement),
    );
  }, [formData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        handleSubmit(
          new Event("submit") as unknown as React.FormEvent<HTMLFormElement>,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
    const input = event.target as HTMLInputElement;

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
    } else if (
      event.key === "ArrowRight" &&
      input.selectionEnd === input.value.length
    ) {
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
    } else if (event.key === "ArrowLeft" && input.selectionStart === 0) {
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
        TAYLOR GROUP ITEMS LISTS
      </div>
      <form onSubmit={handleSubmit}>
        <table className="m-4 table-auto border-collapse">
          <thead>
            <tr className="grid border-collapse grid-cols-12 bg-gray-700 text-gray-100">
              <th className="col-span-2 p-0.5 font-bold md:col-span-1">QTY</th>
              <th className="col-span-6 py-1 pl-6 text-left font-bold">
                Description
              </th>
              <th className="col-span-4 py-1 pl-6 text-left font-bold md:col-span-5">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {formData.map((row, rowIndex) => (
              <tr key={rowIndex} className="grid border-collapse grid-cols-12">
                <td className="col-span-2 flex border-b border-l border-r border-gray-500 p-0.5 md:col-span-1">
                  <input
                    type="text"
                    id={`input-${rowIndex}-qty`}
                    value={row.qty}
                    onChange={(e) =>
                      handleChange(rowIndex, "qty", e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "qty")}
                    className="w-full border-none text-center text-sm focus:outline-none md:text-base"
                  />
                </td>
                <td className="col-span-6 flex items-center border-b border-r border-gray-500 p-1">
                  <textarea
                    id={`input-${rowIndex}-description`}
                    value={row.description}
                    onChange={(e) => {
                      handleChange(rowIndex, "description", e.target.value);
                      adjustTextareaHeight(e.target as HTMLTextAreaElement);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "description")}
                    className="scrollbar-hidden w-full resize-none border-none text-sm focus:outline-none md:text-base"
                    rows={1}
                  />
                </td>
                <td className="col-span-4 flex items-center border-b border-r border-gray-500 p-1 md:col-span-5">
                  <textarea
                    id={`input-${rowIndex}-notes`}
                    value={row.notes}
                    onChange={(e) => {
                      handleChange(rowIndex, "notes", e.target.value);
                      adjustTextareaHeight(e.target as HTMLTextAreaElement);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "notes")}
                    className="w-full resize-none border-none text-sm focus:outline-none md:text-base"
                    rows={1}
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
