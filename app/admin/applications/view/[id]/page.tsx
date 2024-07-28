"use client";

import ApplicationStatusBadge from "@/components/application/application-status-badge";
import { BreakcrumbSetter } from "@/components/breadcrumb";
import Loader from "@/components/loader";
import ImageGrid from "@/components/model/image-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useApproveApplication,
  useGetApplication,
  useGetApplicationImages,
  useRejectApplication,
} from "@/hooks/queries/application";
import dayjs from "dayjs";
import { ChevronLeft, CircleCheck, CircleX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: images, isLoading: isLoadingImages } = useGetApplicationImages({
    id,
  });

  const { data, isLoading } = useGetApplication({ id });

  const { mutate: reject } = useRejectApplication();

  const { mutate: approve } = useApproveApplication();

  if (isLoading || isLoadingImages || !data || !images) {
    return <Loader />;
  }

  return (
    <>
      <BreakcrumbSetter
        breadcrumbs={[
          { label: "Applications", href: "/admin/applications" },
          { label: data.name },
        ]}
      />
      <div className="w-full max-w-3xl grid gap-4">
        <div className="gap-4 flex items-center ">
          <Button
            onClick={() => router.back()}
            variant={"outline"}
            size={"icon"}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {data.name}&apos;s Application
          </h2>
          <ApplicationStatusBadge status={data.status} />
          <div className="ml-auto flex items-center gap-4">
            {data.status === "pending" && (
              <Button
                onClick={() => reject({ applicationId: data.id })}
                className="h-7"
                size={"sm"}
              >
                <CircleX className="h-3.5 w-3.5 mr-2" />
                Reject
              </Button>
            )}
            {data.status !== "approved" && (
              <Button
                onClick={() => approve({ applicationId: data.id })}
                className="h-7"
                size={"sm"}
              >
                <CircleCheck className="w-3.5 h-3.5 mr-2" /> Approve
              </Button>
            )}
          </div>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>General Info</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <InfoField label="Name" value={data.name} />
              <InfoField label="Gender" value={data.gender} />
              <InfoField label="Ethnicity" value={data.ethnicity} />
              <InfoField label="Nationality" value={data.nationality} />
              <InfoField
                label="Date of Birth"
                value={
                  data.dateOfBirth
                    ? dayjs(data.dateOfBirth).format("DD MMM YY")
                    : data.dateOfBirth
                }
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Info</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-3">
              <InfoField label="Email" value={data.email} />
              <InfoField label="Phone Number" value={data.phoneNumber} />
              <InfoField label="Line ID" value={data.lineId} />
              <InfoField label="WeChat" value={data.wechat} />
              <InfoField label="WhatsApp" value={data.whatsapp} />
              <InfoField label="Instagram" value={data.instagram} />
              <InfoField label="Facebook" value={data.facebook} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Measurements</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-3">
              <InfoField label="Height" value={data.height} />
              <InfoField label="Weight" value={data.weight} />
              <InfoField label="Bust" value={data.bust} />
              <InfoField label="Hips" value={data.hips} />
              <InfoField label="Suite/Dress Size" value={data.suitDressSize} />
              <InfoField label="Shoe Size" value={data.shoeSize} />
              <InfoField label="Eye Color" value={data.eyeColor} />
              <InfoField label="Hair Color" value={data.hairColor} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experiences</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Media</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.experiences.length > 0 ? (
                    data.experiences.map((experience, index) => (
                      <TableRow key={index}>
                        <TableCell>{experience.year}</TableCell>
                        <TableCell>{experience.product}</TableCell>
                        <TableCell>{experience.media}</TableCell>
                        <TableCell>{experience.country}</TableCell>
                        <TableCell>{experience.details}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-4 text-muted-foreground text-center"
                      >
                        No experiences
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>

            <CardContent className="">
              <ImageGrid images={images} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: number | string | undefined | null;
}) {
  return (
    <div className="">
      <strong>{label}</strong>
      {value ? (
        <p>{value}</p>
      ) : (
        <p className="text-muted-foreground">Unavailable</p>
      )}
    </div>
  );
}
