import { TableState } from "@/lib/hooks";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parse } from "path";
import { Children, InvoiceData, UsersAuthSelect } from "@/types";

type Props = TableState<InvoiceData | UsersAuthSelect | Children | any>;

const CustomeTableFooter = (props: Props) => {
  const {
    currentPage,
    data,
    setItemsPerPage,
    selectedRows,
    itemsPerPage,
    selectAll,
    rows,
    deselectAll,
    deselectRow,
    listenData,
    getNextPage,
    getPreviousPage,
    getSelectedRows,
    addToSelectedRows,
    pageCount,
    setPageIndex,
  } = props;
  return (
    <CardFooter className="gap-3">
      <Select
        value={`${itemsPerPage}`}
       
        onValueChange={(value) =>
          
          setItemsPerPage((parseInt(value) as number) > 0 ? parseInt(value) : 1)
        }
      >
        <SelectTrigger className="w-20">{itemsPerPage}</SelectTrigger>
        <SelectContent className="w-20">
          <SelectItem value={"5"}>5</SelectItem>
          <SelectItem value={"10"}>10</SelectItem>
          <SelectItem value={"20"}>20</SelectItem>
        </SelectContent>
      </Select>
      <div className="text-xs text-muted-foreground">
        Showing <strong>1-{data?.length > itemsPerPage ? itemsPerPage : data?.length}</strong> of{" "}
        <strong>{data.length}</strong> children
      </div>
      <Pagination className="w-full justify-end">
        <PaginationContent className="w-full justify-end">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                getPreviousPage();
              }}
            />
          </PaginationItem>
          {currentPage > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {Array.from({ length: pageCount >= 3 ? 3 : pageCount }, (_, index) => {
            return currentPage <= 2 ? index + 1 : currentPage + index;
          }).map((num, i) => (
            <PaginationItem>
              <PaginationLink
                key={i}
                isActive={currentPage === num}
                onClick={() => setPageIndex(num - 1)}
              >
                {num}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < pageCount - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => {
                getNextPage();
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </CardFooter>
  );
};

export default CustomeTableFooter;
