"use client";

import { User } from "@/lib/api/user";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRightLeft, MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function ActionMenu({
  user,
  onDelegate,
}: {
  user: User;
  onDelegate: (user: User) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        btnRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => !v);
  };

  return (
    <div className="flex justify-end">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="w-7 h-7 rounded-md border border-border-2 bg-transparent text-text-3
                   hover:text-text hover:border-accent hover:bg-accent-dim
                   transition-all duration-150 flex items-center justify-center"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: pos.top, right: pos.right }}
            className="fixed z-9999 bg-surface border border-border rounded-md shadow-md min-w-[110px]"
          >
            <button
              onClick={() => {
                setOpen(false);
                onDelegate(user);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-text-2
                         hover:bg-accent-dim hover:text-text transition-colors rounded-md"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
              위임하기
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}

export function createColumns(
  currentRole: string,
  onDelegate: (user: User) => void,
): ColumnDef<User>[] {
  const cols: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "이름",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent-dim flex items-center justify-center">
            <span className="text-accent font-semibold text-xs">
              {row.original.name.charAt(0)}
            </span>
          </div>
          <span className="font-medium text-text">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "loginId",
      header: "아이디",
      cell: ({ row }) => (
        <span className="font-mono text-sm text-text-2">{row.original.loginId}</span>
      ),
    },
    {
      accessorKey: "deptName",
      header: "부서",
      cell: ({ row }) => (
        <span className="text-sm text-text-2">{row.original.deptName}</span>
      ),
    },
    {
      accessorKey: "job",
      header: "직책",
      cell: ({ row }) => (
        <span className="text-sm text-text-2">{row.original.job}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "역할",
      cell: ({ row }) => {
        const isMain = row.original.role === 0;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
              isMain ? "bg-green-dim text-green" : "bg-amber-dim text-amber"
            }`}
          >
            {isMain ? "주관리자" : "부관리자"}
          </span>
        );
      },
    },
  ];

  if (currentRole === "MainMaster") {
    cols.push({
      id: "actions",
      header: "",
      cell: ({ row }) => {
        if (row.original.role === 0) return null;
        return <ActionMenu user={row.original} onDelegate={onDelegate} />;
      },
    });
  }

  return cols;
}
