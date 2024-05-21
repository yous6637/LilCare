"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { NavItem } from "./ui/NavItem";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ParentSideItems, sideItems } from "@/lib/constants";
import { useSessionUser } from "@/lib/hooks";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Role } from "@/types";

type SideBarItem = {
  label: string;
  Icon: LucideIcon;
  href: string;
};

type Props = {
  items?: SideBarItem[];
  active: string;
};

const SidebarItem = ({
  label,
  Icon,
  href,
  active,
}: SideBarItem & { active: string }) => {
  return (
    <>
      <NavItem href={href} variant={label == active ? "primary" : "secondary"}>
        <div className="flex gap-2 hover:text-white">
          {<Icon />}
          <h5 className="min-[400px]:hidden md:block">{label}</h5>
          
        </div>
      </NavItem>
    </>
  );
};

const Sidebar = ({ items, active }: Props) => {
  const size = useWindowSize();


  const {currentUser} = useSessionUser(state => state);

  useEffect(() => {

    supabaseBrowser().auth.getSession().then((session) => {
      useSessionUser.setState({currentUser : session.data.session?.user})
    })
    console.log({sidebar : currentUser});

  },[])


  
  const userRole = currentUser?.user_metadata?.role as Role;
  const sidebarItems = userRole ? sideItems[userRole] : sideItems["PARENT"];
  return (size?.width! ) > 400 ? (
    <div className="px-0 md:px-4 w-12 md:w-64 hidden min-[400px]:flex flex-col bg-secondary h-full gap-2">
      {sidebarItems?.map((item) => (
        <SidebarItem key={item.href} active={active} {...item} />
      ))}
    </div>
  ) : (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="hidden" id="sidebar-trigger" variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 w-full">
        <SheetHeader className="bg-secondary flex flex-shrink-0 pl-3 h-15">
          <div className="flex flex-shrink-0 items-center">
            <img
              className="h-8 w-auto mr-2"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
            />
            <h1 className="font-bold text-sky-500 text-3xl font-mono">
              Nursery
            </h1>
          </div>
        </SheetHeader>
        <div className="px-0 md:px-4 w-full flex flex-col bg-secondary h-full gap-2">
          {sidebarItems.map((item) => (
            <SidebarItem key={item.href} active={active} {...item} />
          ))}
        </div>
        
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width?: number;
    height?: number;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
