"use client";
import { SideMenu } from "./menu";
import { auth } from "@/config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import React from "react";
import Link from "next/link";

export default function SideMenuLayout({
  children,
  items,
}: {
  children: React.ReactNode;
  items: { id: string; label: string }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  // Create a ref for each section
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const options = {
    root: containerRef.current,
    threshold: [0.5, 0.75],
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      let visibleIds: string[] = [];
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleIds.push(entry.target.id);
        }
      });

      // Set activeId to the last visible section
      if (visibleIds.length) {
        setActiveId(visibleIds[visibleIds.length - 1]);
      }
    }, options);

    // Observe each section
    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    // Cleanup the observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [options]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
      <div className="col-span-full md:col-span-1">
        <SideMenu
          items={items}
          activeId={activeId}
          onSelect={(index) =>
            sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" })
          }
        />
      </div>
      <ScrollArea
        ref={containerRef}
        className="col-span-full md:col-span-4 h-full pr-3 overflow-y-auto grid no-scrollbar"
      >
        {React.Children.map(children, (child, index) => (
          <div
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            id={items[index]?.id}
            key={items[index]?.id}
            className="mt-4 first:mt-0"
          >
            {child}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
