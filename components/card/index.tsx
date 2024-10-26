import {
  Card as _Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Skeleton } from "../ui/skeleton";
import { AsyncUI, isAsyncUI } from "../utils/async-ui";

export const Card = ({
  headerBorder,
  footerBorder,
  children,
  title,
  description,
  action,
  footer,
}: CardProps) => {
  return (
    <_Card>
      {(title || description || action) && (
        <CardHeader
          className={cn(
            "flex flex-row justify-between p-6 pb-0 min-w-0",
            headerBorder && "border-b pb-6"
          )}
        >
          <TitleDescription title={title} description={description} />
          <Action action={action} />
        </CardHeader>
      )}
      <CardContent className="p-6">
        {children ? children : <Skeleton className="w-2/3 h-6" />}
      </CardContent>

      {footer && (
        <CardFooter
          className={cn(
            "flex items-center p-6 pt-0",
            footerBorder && "border-t pt-4"
          )}
        >
          {footer}
        </CardFooter>
      )}
    </_Card>
  );
};

type AsyncReactNode = AsyncUI;

export type CardProps = {
  title?: AsyncReactNode | React.ReactNode;
  description?: AsyncReactNode | React.ReactNode;
  action?: AsyncReactNode | React.ReactNode;
  headerBorder?: boolean;
  footerBorder?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

function isAsyncReactNode(
  node: AsyncReactNode | React.ReactNode
): node is AsyncReactNode {
  return isAsyncUI(node);
}

const TitleDescription = ({
  title,
  description,
}: {
  description?: CardProps["description"];
  title?: CardProps["title"];
}) => {
  if (!title) {
    return null;
  }
  if (
    (isAsyncReactNode(title) && title.loading) ||
    (description && isAsyncReactNode(description) && description.loading)
  ) {
    return (
      <Skeleton className="w-1/2 ">
        <span className="text-transparent">Card title placeholder</span>
      </Skeleton>
    );
  }
  return (
    <div className="grow grid gap-1">
      {title && (
        <CardTitle className="flex items-center">
          <span> {isAsyncReactNode(title) ? title.value : title}</span>
          {description && (
            <Tooltip>
              <TooltipTrigger className="ml-2 inline md:hidden" asChild>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                {isAsyncReactNode(description)
                  ? description.value
                  : description}
              </TooltipContent>
            </Tooltip>
          )}
        </CardTitle>
      )}
      {description && (
        <CardDescription className={cn("hidden md:inline")}>
          {isAsyncReactNode(description) ? description.value : description}
        </CardDescription>
      )}
    </div>
  );
};

const Action = ({ action }: { action?: CardProps["action"] }) => {
  if (!action) {
    return null;
  }
  if (isAsyncReactNode(action) && action.loading) {
    return <Skeleton className="w-1/6 h-6" />;
  }
  return (
    <div className="">{isAsyncReactNode(action) ? action.value : action}</div>
  );
};
