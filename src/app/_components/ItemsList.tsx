"use client";

import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface FormData {
  qty: string;
  description: string;
  notes: string;
  newOrExisting: boolean;
  value: number;
  itemType: string;
  boothElement?: string;
  skidID: string;
}

const itemTypes = ["Type1", "Type2", "Type3"]; // Replace with actual item types
const boothElements = ["Element1", "Element2", "Element3"]; // Replace with actual booth elements

export default function ItemsList({ jobId }: { jobId: number }) {
  const job = api.job.getById.useQuery({ id: jobId }).data;
  const [formData, setFormData] = useState<FormData[]>(
    Array.from({ length: 100 }, () => ({
      qty: "",
      description: "",
      notes: "",
      newOrExisting: false,
      value: 0,
      itemType: "",
      boothElement: "",
      skidID: "",
    })),
  );

  const handleChange = (
    rowIndex: number,
    col: keyof FormData,
    value: string | boolean | number,
  ) => {
    const newFormData: FormData[] = [...formData];
    if (newFormData[rowIndex]) {
      (newFormData[rowIndex][col] as typeof value) = value;
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

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    rowIndex: number,
    col: keyof FormData,
  ) => {
    const colOrder: (keyof FormData)[] = [
      "qty",
      "description",
      "notes",
      "newOrExisting",
      "value",
      "itemType",
      "boothElement",
      "skidID",
    ];
    const colIndex = colOrder.indexOf(col);
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;

    if (event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      const nextRow = document.querySelector<
        HTMLInputElement | HTMLTextAreaElement
      >(`#input-${rowIndex + 1}-${col}`);
      if (nextRow) {
        nextRow.focus();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevRow = document.querySelector<
        HTMLInputElement | HTMLTextAreaElement
      >(`#input-${rowIndex - 1}-${col}`);
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
        const nextCell = document.querySelector<
          HTMLInputElement | HTMLTextAreaElement
        >(`#input-${rowIndex}-${nextCol}`);
        if (nextCell) {
          nextCell.focus();
        }
      }
    } else if (event.key === "ArrowLeft" && input.selectionStart === 0) {
      event.preventDefault();
      const prevCol = colOrder[colIndex - 1];
      if (prevCol) {
        const prevCell = document.querySelector<
          HTMLInputElement | HTMLTextAreaElement
        >(`#input-${rowIndex}-${prevCol}`);
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
      formData.filter(
        (a) =>
          a.qty ||
          a.description ||
          a.notes ||
          a.newOrExisting ||
          a.value ||
          a.itemType ||
          a.boothElement ||
          a.skidID,
      ),
    );
  };

  const columns = [
    {
      id: "qty",
      label: "Qty",
      className: "w-[10%] min-w-[60px] border-l max-w-[100px]",
    },
    {
      id: "description",
      label: "Description",
      className: "min-w-[300px] w-full",
    },
    {
      id: "notes",
      label: "Notes",
      className: "w-[17.5%] xl:w-[15%] min-w-[200px]",
    },
    {
      id: "newOrExisting",
      label: "New Build",
      className: "w-[12.5%] xl:w-[10%] min-w-[100px]",
    },
    {
      id: "value",
      label: "Value",
      className: "hidden xl:flex xl:w-[100px] min-w-[100px]",
    },
    {
      id: "itemType",
      label: "Item Type",
      className: "hidden xl:flex xl:w-[150px] min-w-[100px]",
    },
    {
      id: "boothElement",
      label: "Booth Element",
      className: "w-[150px] min-w-[150px]",
    },
    {
      id: "skidID",
      label: "Skid ID",
      className: "w-[12.5%] xl:w-[10%] min-w-[80px] max-w-[120px]",
    },
  ];

  return (
    <div className="my-2 w-full">
      <div className="text-center text-2xl font-bold md:text-4xl">
        <div>{job?.jobNumber}</div>
        <div>
          {job?.clientName} @ {job?.showName}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="m-4 flex flex-col flex-nowrap justify-center overflow-scroll">
          <div className="flex">
            {columns.map((col) => (
              <div
                key={col.id}
                className={cn(
                  "flex items-center border-r border-gray-500 bg-gray-700 p-0.5 font-bold text-gray-100",
                  col.label === "Description" || col.label === "Notes"
                    ? "pl-4"
                    : "justify-center",
                  col.className,
                )}
              >
                {col.label}
              </div>
            ))}
          </div>
          {formData.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {columns.map((col) => (
                <CellTemplate
                  key={col.id}
                  rowIndex={rowIndex}
                  col={col.id as keyof FormData}
                  value={row[col.id as keyof FormData]}
                  handleChange={handleChange}
                  handleKeyDown={handleKeyDown}
                  adjustTextareaHeight={adjustTextareaHeight}
                  className={`border-b border-r border-gray-500 ${col.className}`}
                />
              ))}
            </div>
          ))}
        </div>
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

interface CellTemplateProps {
  rowIndex: number;
  col: keyof FormData;
  value: string | boolean | number | undefined;
  handleChange: (
    rowIndex: number,
    col: keyof FormData,
    value: string | boolean | number,
  ) => void;
  handleKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    rowIndex: number,
    col: keyof FormData,
  ) => void;
  adjustTextareaHeight: (textarea: HTMLTextAreaElement) => void;
  className: string;
}

const CellTemplate: React.FC<CellTemplateProps> = ({
  rowIndex,
  col,
  value,
  handleChange,
  handleKeyDown,
  adjustTextareaHeight,
  className,
}) => {
  return (
    <div className={`flex items-center p-1 ${className}`}>
      {col === "qty" || col === "value" || col === "skidID" ? (
        <input
          type="text"
          id={`input-${rowIndex}-${col}`}
          value={value as string}
          onChange={(e) => handleChange(rowIndex, col, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, rowIndex, col)}
          className="w-full border-none text-center text-sm focus:outline-none md:text-base"
        />
      ) : col === "newOrExisting" ? (
        <input
          type="checkbox"
          id={`input-${rowIndex}-${col}`}
          checked={value as boolean}
          onChange={(e) => handleChange(rowIndex, col, e.target.checked)}
          className="w-full border-none text-center text-sm focus:outline-none md:text-base"
        />
      ) : col === "itemType" || col === "boothElement" ? (
        <select
          id={`input-${rowIndex}-${col}`}
          value={value as string}
          onChange={(e) => handleChange(rowIndex, col, e.target.value)}
          className="w-full border-none text-center text-sm focus:outline-none md:text-base"
        >
          <option value="" disabled hidden>
            Choose an Option
          </option>
          {(col === "itemType" ? itemTypes : boothElements).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      ) : (
        <textarea
          id={`input-${rowIndex}-${col}`}
          value={value as string}
          onChange={(e) => {
            handleChange(rowIndex, col, e.target.value);
            adjustTextareaHeight(e.target as HTMLTextAreaElement);
          }}
          onKeyDown={(e) => handleKeyDown(e, rowIndex, col)}
          className="scrollbar-hidden w-full resize-none border-none text-sm focus:outline-none md:text-base"
          rows={1}
        />
      )}
    </div>
  );
};
