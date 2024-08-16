"use client";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useFormContext } from "./form-context";
import AddTalentDialog from "@/components/model/add-talent-dialog";

const FormSchema = z.object({
  talents: z.array(z.object({ talent: z.string() })),
});

export default function TalentForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const talents = useFieldArray({
    control: form.control,
    name: "talents",
  });

  const { setApplication, next } = useFormContext();
  return (
    <Card>
      <CardHeader>
        <div className="grid gap-2">
          <div className="flex justify-between">
            <CardTitle>Talents</CardTitle>
            <AddTalentDialog
              onSubmit={({ talent }) => talents.append({ talent })}
            >
              <Button className="h-7 px-2" variant={"outline"}>
                <Plus className="w-3.5 h-3.5 text-foreground" />
              </Button>
            </AddTalentDialog>
          </div>
          <CardDescription>
            List your talents, skills and any hobbies. For example, if you are a
            singer, dancer, swimmer, etc.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Talent</TableHead>
              <TableHead>
                <span className="sr-only">Remove</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {talents.fields.length > 0 ? (
              talents.fields.map((talent, index) => (
                <TableRow key={index}>
                  <TableCell>{talent.talent}</TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => talents.remove(index)}
                      className="h-7 w-7"
                      variant={"ghost"}
                      size={"icon"}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-muted-foreground py-4"
                >
                  No talents added
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex"></div>
      </CardContent>
      <CardFooter className="py-4 border-t">
        <Button
          onClick={() => {
            setApplication((prev) => ({
              ...prev,
              talents: talents.fields.map(({ talent }) => talent),
            }));
            next();
          }}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
