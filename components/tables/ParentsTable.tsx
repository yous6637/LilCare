"use client";
import {  ParentData, UserAuthData, UsersAuthSelect } from "@/types";
import { ApiState, useUserTable } from "@/lib/hooks";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from "../ui/pagination";
import Link from "next/link";
import CustomeTableFooter from "./CustomeTableFooter";

type Props = {
  apiState?: UsersAuthSelect[];
  // columnsMaker: () => ColumnDef<Parent>[];
  onSelect?: (data: UsersAuthSelect[]) => void;
  title?: string;
};

export default function ParentTable({ onSelect, apiState, title }: Props) {

  const tableState = useUserTable((state) => ({ ...state, data: apiState }));

  const {
    currentPage,
    selectedRows,
    itemsPerPage,
    selectAll,
    rows,
    getRows,
    deselectAll,
    setInAction,
    deselectRow,
    listenData,
    getNextPage,
    getPreviousPage,
    getSelectedRows,
    addToSelectedRows,
    pageCount,
    setPageIndex,
  } = tableState;

  useUserTable.subscribe((state, prev) => {
    onSelect?.(state.getSelectedRows());
  });

  useEffect(() => {
    const data = apiState;
    console.log(data);
    if (data) {
      console.log({pageCount : Math.floor(data?.length / itemsPerPage) + 1 })
      useUserTable.setState({
        data: apiState,
        rows: apiState?.slice(0, itemsPerPage),
        pageCount: Math.floor(data?.length / itemsPerPage) + 1,
      });
    }
  }, [apiState]);
  const pageIndex = currentPage - 1;
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>{title || "Parents"}</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex-shrink-0">
                <Checkbox
                  onCheckedChange={(e) => {
                    e ? selectAll() : deselectAll();

                    console.log({ selectedRows: getSelectedRows() });
                  }}
                  className="w-4"
                />
              </TableHead>
              <TableHead className="w-[100px] sm:table-cell text-center">
                image <span className="sr-only">Image</span>
              </TableHead>
              <TableHead className="text-center">Full Name</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>

              <TableHead className="hidden md:table-cell text-center">
                Birthdate
              </TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows?.map((parent) => (
              <TableRow
                aria-checked={getSelectedRows().includes(parent)}
                key={parent?.rawUserMetaData?.cardId}
              >
                <TableCell className="w-[30] flex-shrink-0">
                  <Checkbox
                    onCheckedChange={(e) => {
                      e
                        ? addToSelectedRows(parent)
                        : deselectRow(parent);
                      console.log(getSelectedRows());
                      onSelect?.(getSelectedRows());
                    }}
                    className="w-4"
                    checked={getSelectedRows().includes(parent)}
                  />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <img
                    alt="parent image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={parent?.rawUserMetaData?.photo}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium text-center">
                  <Link href={`?cardId=${parent?.rawUserMetaData?.cardId}`}>
                    {parent?.rawUserMetaData?.lastName + " " + parent?.rawUserMetaData?.firstName}
                  </Link>
                </TableCell>
                <TableCell className="text-center">{parent.rawUserMetaData?.phone}</TableCell>
                <TableCell className="hidden text-center md:table-cell">
                  {parent.rawUserMetaData?.birthDate}
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      <CustomeTableFooter {...tableState}  />

    </Card>
  );
}
