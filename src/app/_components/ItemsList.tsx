"use client";

import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface FormData {
  qty: string;
  description: string;
  notes: string;
  newOrExisting: string;
  value: number;
  skidType: string;
  itemType: string;
  boothElement?: string;
  skidID: string;
}

const itemTypes = [
  "Aluminum Frames",
  "Wall Panels",
  "Custom Millwork",
  "Custom Aluminum",
  "Other",
]; // Replace with actual item types
const boothElements = ["Element1", "Element2", "Element3"]; // Replace with actual booth elements
const newOrExistingOptions = ["New", "Existing", "Rental"];
const skidTypes = ["Skid", "Crate", "Fabric Bin", "A-Frame", "Other"]; // Replace with actual skid types

export default function ItemsList({ jobNumber }: { jobNumber: number }) {
  const job = api.job.getByJobNumber.useQuery({ jobNumber: jobNumber }).data;
  const [view, setView] = useState<
    "Account Manager" | "Project Manager" | "Logistics Coordinator"
  >("Account Manager");

  const [formData, setFormData] = useState<FormData[]>(
    Array.from({ length: 100 }, () => ({
      qty: "",
      description: "",
      notes: "",
      newOrExisting: "",
      value: 0,
      skidType: "",
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
      "skidType",
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
          a.skidType ||
          a.itemType ||
          a.boothElement ||
          a.skidID,
      ),
    );
  };

  const columns = {
    "Account Manager": [
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
        id: "newOrExisting",
        label: "New/Existing",
        className: "w-[12.5%] xl:w-[10%] min-w-[100px]",
      },
      {
        id: "value",
        label: "Value",
        className: "w-[10%] xl:w-[100px] min-w-[100px]",
      },
    ],
    "Project Manager": [
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
        className: "w-[17.5%] xl:w-[15%] min-w-[175px]",
      },
      {
        id: "newOrExisting",
        label: "New/Existing",
        className: "w-[12.5%] xl:w-[10%] min-w-[100px]",
      },
    ],
    "Logistics Coordinator": [
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
        className: "w-[17.5%] xl:w-[15%] min-w-[175px]",
      },
      {
        id: "skidType",
        label: "Skid Type",
        className: "w-[12.5%] xl:w-[10%] min-w-[100px]",
      },
      {
        id: "skidID",
        label: "Skid ID",
        className: "w-[12.5%] xl:w-[10%] min-w-[80px] max-w-[120px]",
      },
    ],
  };

  return (
    <div className="my-2 w-full">
      <div className="text-center text-2xl font-bold md:text-4xl">
        <div>{job?.jobNumber}</div>
        <div>
          {job?.clientName} @ {job?.showName}
        </div>
      </div>
      <div className="my-4 flex justify-center">
        {["Account Manager", "Project Manager", "Logistics Coordinator"].map(
          (role) => (
            <button
              key={role}
              onClick={() =>
                setView(
                  role as
                    | "Account Manager"
                    | "Project Manager"
                    | "Logistics Coordinator",
                )
              }
              className={cn(
                "mx-2 rounded px-4 py-2",
                view === role
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black",
              )}
            >
              {role}
            </button>
          ),
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="m-4 flex flex-col flex-nowrap justify-center overflow-scroll">
          <div className="flex">
            {columns[view].map((col) => (
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
              {columns[view].map((col) => (
                <CellTemplate
                  key={col.id}
                  rowIndex={rowIndex}
                  col={col.id as keyof FormData}
                  value={row[col.id as keyof FormData]}
                  handleChange={handleChange}
                  handleKeyDown={handleKeyDown}
                  adjustTextareaHeight={adjustTextareaHeight}
                  className={`border-b border-r border-gray-500 ${col.className}`}
                  view={view}
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
  view: "Account Manager" | "Project Manager" | "Logistics Coordinator";
}

const CellTemplate: React.FC<CellTemplateProps> = ({
  rowIndex,
  col,
  value,
  handleChange,
  handleKeyDown,
  adjustTextareaHeight,
  className,
  view,
}) => {
  const isEditable =
    view === "Project Manager" || (col !== "qty" && col !== "description");

  const renderInput = () => {
    if (col === "qty" || col === "description") {
      return view === "Project Manager" ? (
        <textarea
          id={`input-${rowIndex}-${col}`}
          value={value as string}
          onChange={(e) => {
            handleChange(rowIndex, col, e.target.value);
            adjustTextareaHeight(e.target as HTMLTextAreaElement);
          }}
          onKeyDown={(e) => handleKeyDown(e, rowIndex, col)}
          className={cn(
            "scrollbar-hidden w-full resize-none border-none text-sm focus:outline-none md:text-base",
            col === "qty" ? "text-center" : "",
          )}
        />
      ) : (
        <span
          className={cn(
            "w-full text-sm md:text-base",
            col === "qty" ? "text-center" : "",
            col === "description" ? "whitespace-pre-wrap" : "",
          )}
        >
          {value}
        </span>
      );
    }

    if (col === "newOrExisting") {
      return (
        <select
          id={`input-${rowIndex}-${col}`}
          value={value as string}
          onChange={(e) => handleChange(rowIndex, col, e.target.value)}
          className="w-full border-none text-center text-sm focus:outline-none md:text-base"
        >
          {newOrExistingOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (col === "skidType" || col === "itemType" || col === "boothElement") {
      const options =
        col === "skidType"
          ? skidTypes
          : col === "itemType"
            ? itemTypes
            : boothElements;
      return (
        <select
          id={`input-${rowIndex}-${col}`}
          value={value as string}
          onChange={(e) => handleChange(rowIndex, col, e.target.value)}
          className="w-full border-none text-center text-sm focus:outline-none md:text-base"
        >
          {options.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      );
    }

    return (
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
    );
  };

  return (
    <div
      className={cn(
        "flex items-center p-1",
        className,
        (col === "qty" || col === "description") && view !== "Project Manager"
          ? "border-white border-b-slate-200"
          : "",
      )}
    >
      {renderInput()}
    </div>
  );
};
