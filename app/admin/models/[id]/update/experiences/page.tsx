"use client";
import AddNewExperienceDialog from "@/components/application/add-application-dialog";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import permissions from "@/config/permission";
import {
  useAddModelExperience,
  useGetModelExperiences,
  useRemoveModelExperience,
} from "@/hooks/queries/model";
import useSession from "@/hooks/use-session";
import { Plus, X } from "lucide-react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const session = useSession(permissions.models.getModelExperiencesById);
  const { data, isLoading } = useGetModelExperiences({
    modelId: id,
    enabled: session.status === "authenticated",
  });
  const { mutate: addExperience } = useAddModelExperience();
  const { mutate: removeExperience } = useRemoveModelExperience();

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Experience</CardTitle>
        <div>
          <AddNewExperienceDialog
            onSubmit={(input) => addExperience({ modelId: id, input })}
          >
            <Button className="h-7" size={"sm"}>
              <Plus className="w-3.5 h-3.5 mr-2" />
              <span>Experience</span>
            </Button>
          </AddNewExperienceDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((experience, index) => (
                <TableRow key={index}>
                  <TableCell>{experience.year}</TableCell>
                  <TableCell>{experience.product}</TableCell>
                  <TableCell>{experience.media}</TableCell>
                  <TableCell>{experience.country}</TableCell>
                  <TableCell>{experience.details}</TableCell>
                  <TableCell>
                    <Button
                      size={"icon"}
                      className="h-7 w-7"
                      variant={"outline"}
                      onClick={() =>
                        removeExperience({
                          modelId: id,
                          experienceId: experience.id,
                        })
                      }
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="py-4 text-center text-muted-foreground"
                  colSpan={6}
                >
                  No Experience found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
