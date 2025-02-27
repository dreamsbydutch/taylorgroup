"use client";

import { ArrowLeftIcon, MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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

interface HeaderData {
  text: string;
  color: string;
}

const itemTypes = [
  "Aluminum Frames",
  "Wall Panels",
  "Custom Millwork",
  "Custom Aluminum",
  "Other",
]; // Replace with actual item types
const newOrExistingOptions = ["New", "Existing", "Rental"];
const skidTypes = ["Skid", "Crate", "Fabric Bin", "A-Frame", "Other"]; // Replace with actual skid types
const colors = [
  "#D0E2FF", // Light Blue
  "#FFD6D6", // Light Red
  "#D4EDDA", // Light Green
  "#FFF3CD", // Light Yellow
  "#EAD1DC", // Light Purple
  "#FFE5B4", // Light Orange
  "#FFD1DC", // Light Pink
  "#E0E0E0", // Light Gray
];

export default function ItemsList({ jobNumber }: { jobNumber: number }) {
  const router = useRouter();
  const job = api.job.getByJobNumber.useQuery({ jobNumber: jobNumber }).data;
  const [view, setView] = useState<
    | "Account Manager"
    | "Project Manager"
    | "Logistics Coordinator"
    | "Installer"
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

  const [headerData, setHeaderData] = useState<{ [key: number]: HeaderData }>(
    {},
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<number | null>(null);
  const [headerText, setHeaderText] = useState("");
  const [headerColor, setHeaderColor] = useState(colors[0]);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    rowIndex: number | null;
  }>({ visible: false, x: 0, y: 0, rowIndex: null });

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

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

  const handleRowDoubleClick = (rowIndex: number) => {
    if (view !== "Project Manager") return;
    setCurrentRow(rowIndex);
    if (headerData[rowIndex]) {
      setHeaderText(headerData[rowIndex].text);
      setHeaderColor(headerData[rowIndex].color);
    } else {
      setHeaderText("");
      setHeaderColor(colors[0]);
    }
    setModalVisible(true);
  };

  const handleModalSubmit = () => {
    if (currentRow !== null) {
      setHeaderData((prevHeaderData) => {
        const newHeaderData = { ...prevHeaderData };
        newHeaderData[currentRow] = {
          text: headerText || "",
          color: headerColor ?? "#D0E2FF",
        };
        return newHeaderData;
      });
      setModalVisible(false);
      setHeaderText("");
      setHeaderColor(colors[0]);
    }
  };

  const handleDeleteHeader = () => {
    if (currentRow !== null) {
      setHeaderData((prevHeaderData) => {
        const newHeaderData = { ...prevHeaderData };
        delete newHeaderData[currentRow];
        return newHeaderData;
      });
      setModalVisible(false);
      setHeaderText("");
      setHeaderColor(colors[0]);
    }
  };

  const addRow = (index: number) => {
    const newFormData = [
      ...formData.slice(0, index + 1),
      {
        qty: "",
        description: "",
        notes: "",
        newOrExisting: "",
        value: 0,
        skidType: "",
        itemType: "",
        boothElement: "",
        skidID: "",
      },
      ...formData.slice(index + 1),
    ];
    setFormData(newFormData);
  };

  const removeRow = (rowIndex: number) => {
    const newFormData = formData.filter((_, index) => index !== rowIndex);
    setFormData(newFormData);
  };

  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rowIndex: number,
  ) => {
    event.preventDefault(); // Prevent the default context menu
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      rowIndex,
    });
  };

  const columns = {
    "Account Manager": [
      {
        id: "itemType",
        label: "Type",
        className: "w-[15%] min-w-[80px] max-w-[150px] border-l",
      },
      {
        id: "value",
        label: "Total Value",
        className: "w-[15%] min-w-[70px] max-w-[150px] text-center",
      },
      {
        id: "qty",
        label: "Qty",
        className: "w-[10%] min-w-[50px] max-w-[100px] border-gray-300 ",
      },
      {
        id: "description",
        label: "Description",
        className: "w-[70%] min-w-[250px] max-w-[800px] border-gray-300 ",
      },
    ],
    "Project Manager": [
      {
        id: "newOrExisting",
        label: "New/Existing",
        className: "w-[15%] min-w-[100px] max-w-[150px] border-l",
      },
      {
        id: "qty",
        label: "Qty",
        className: "w-[10%] min-w-[50px] max-w-[100px]",
      },
      {
        id: "description",
        label: "Description",
        className: "w-[60%] min-w-[300px] max-w-[1000px]",
      },
      {
        id: "notes",
        label: "Notes",
        className: "w-[25%] min-w-[175px] max-w-[600px]",
      },
    ],
    "Logistics Coordinator": [
      {
        id: "skidType",
        label: "Skid Type",
        className: "w-[15%] min-w-[100px] max-w-[125px] border-l",
      },
      {
        id: "skidID",
        label: "Skid ID",
        className: "w-[15%] min-w-[80px] max-w-[125px]",
      },
      {
        id: "qty",
        label: "Qty",
        className: "w-[10%] min-w-[50px] max-w-[100px] border-gray-300 ",
      },
      {
        id: "description",
        label: "Description",
        className: "w-[50%] min-w-[250px] max-w-[800px] border-gray-300 ",
      },
      {
        id: "notes",
        label: "Notes",
        className: "w-[30%] min-w-[200px] max-w-[600px] border-gray-300 ",
      },
    ],
    Installer: [
      {
        id: "skidType",
        label: "Skid Type",
        className: "w-[15%] min-w-[100px] max-w-[125px] border-l",
      },
      {
        id: "skidID",
        label: "Skid ID",
        className: "w-[15%] min-w-[80px] max-w-[125px]",
      },
      {
        id: "qty",
        label: "Qty",
        className: "w-[10%] min-w-[50px] max-w-[100px] border-gray-300 ",
      },
      {
        id: "description",
        label: "Description",
        className: "w-[50%] min-w-[250px] max-w-[800px] border-gray-300 ",
      },
      {
        id: "notes",
        label: "Notes",
        className: "w-[30%] min-w-[200px] max-w-[600px] border-gray-300 ",
      },
    ],
  };

  return (
    <div className="mx-auto my-2 w-full max-w-7xl">
      <button
        onClick={() => router.push("/")}
        className="mx-8 my-2 flex rounded bg-gray-500 px-4 py-2 text-white"
      >
        <ArrowLeftIcon /> Back To Home
      </button>
      <div className="text-center text-2xl font-bold md:text-4xl">
        <div>{job?.jobNumber}</div>
        <div>
          {job?.clientName} @ {job?.showName}
        </div>
      </div>
      <div className="my-4 flex justify-center">
        {[
          "Account Manager",
          "Project Manager",
          "Logistics Coordinator",
          "Installer",
        ].map((role) => (
          <button
            key={role}
            onClick={() =>
              setView(
                role as
                  | "Account Manager"
                  | "Project Manager"
                  | "Logistics Coordinator"
                  | "Installer",
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
        ))}
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
            <div className="w-[50px]"></div>
          </div>
          {formData.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center"
              onContextMenu={(e) => handleContextMenu(e, rowIndex)}
              onDoubleClick={() => handleRowDoubleClick(rowIndex)} // Ensure double-click is handled
            >
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
              {view === "Project Manager" && (
                <>
                  <button
                    type="button"
                    onClick={() => addRow(rowIndex)}
                    className="flex w-[25px] items-center justify-center"
                  >
                    <PlusCircleIcon width={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRow(rowIndex)}
                    className="flex w-[25px] items-center justify-center"
                  >
                    <MinusCircleIcon width={16} />
                  </button>
                </>
              )}
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

      {contextMenu.visible && (
        <div
          className="fixed z-50 rounded bg-white shadow-lg"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <ul className="py-1">
            <li
              className="cursor-pointer px-4 py-2 hover:bg-gray-200"
              onClick={() => {
                if (contextMenu.rowIndex !== null) addRow(contextMenu.rowIndex);
                setContextMenu({ ...contextMenu, visible: false });
              }}
            >
              Add Row
            </li>
            <li
              className="cursor-pointer px-4 py-2 hover:bg-gray-200"
              onClick={() => {
                if (contextMenu.rowIndex !== null)
                  removeRow(contextMenu.rowIndex);
                setContextMenu({ ...contextMenu, visible: false });
              }}
            >
              Delete Row
            </li>
            <li
              className="cursor-pointer px-4 py-2 hover:bg-gray-200"
              onClick={() => {
                if (contextMenu.rowIndex !== null)
                  handleRowDoubleClick(contextMenu.rowIndex);
                setContextMenu({ ...contextMenu, visible: false });
              }}
            >
              Create Header
            </li>
          </ul>
        </div>
      )}

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-4">
            <h2 className="mb-4 text-xl font-bold">Create Header</h2>
            <input
              type="text"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="Enter header text"
              className="mb-4 w-full rounded border border-gray-300 p-2"
            />
            <div className="mb-4 flex">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`mr-2 h-8 w-8 cursor-pointer rounded-full ${color === headerColor ? "ring-2 ring-black" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setHeaderColor(color)}
                />
              ))}
            </div>
            <button
              onClick={handleModalSubmit}
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              Submit
            </button>
            <button
              onClick={handleDeleteHeader}
              className="ml-2 rounded bg-red-500 px-4 py-2 text-white"
            >
              Delete
            </button>
            <button
              onClick={() => setModalVisible(false)}
              className="ml-2 rounded bg-gray-500 px-4 py-2 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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
  view:
    | "Account Manager"
    | "Project Manager"
    | "Logistics Coordinator"
    | "Installer";
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
          rows={1} // Set rows to 1 for single line height
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
          <option hidden value=""></option>
          {newOrExistingOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (col === "skidType" || col === "itemType" || col === "boothElement") {
      const options = col === "skidType" ? skidTypes : itemTypes;
      return (
        <select
          id={`input-${rowIndex}-${col}`}
          value={value as string}
          onChange={(e) => handleChange(rowIndex, col, e.target.value)}
          className="w-full border-none text-center text-sm focus:outline-none md:text-base"
        >
          <option hidden value=""></option>
          {options.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      );
    }

    if (col === "value") {
      return (
        <div className="flex items-center">
          <span className="mr-1">$</span>
          <input
            id={`input-${rowIndex}-${col}`}
            type="text"
            value={
              value === 0
                ? "-"
                : new Intl.NumberFormat("en-US", { style: "decimal" }).format(
                    Math.abs(value as number),
                  )
            }
            onChange={(e) =>
              handleChange(
                rowIndex,
                col,
                e.target.value === "-"
                  ? 0
                  : parseFloat(e.target.value.replace(/,/g, "")),
              )
            }
            onKeyDown={(e) => handleKeyDown(e, rowIndex, col)}
            className="w-full border-none text-center text-sm focus:outline-none md:text-base"
          />
        </div>
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
        className={cn(
          "scrollbar-hidden w-full resize-none border-none text-sm focus:outline-none md:text-base",
        )}
        rows={1}
      />
    );
  };

  return (
    <div
      className={cn(
        "flex items-center border-b border-r border-gray-500 p-1", // Apply same border style for all views
        className,
      )}
    >
      {renderInput()}
    </div>
  );
};
