"use client";

import ApplicationStatusBadge from "@/components/application/application-status-badge";
import { BreakcrumbSetter } from "@/components/breadcrumb";
import Container from "@/components/container";
import Loader from "@/components/loader";
import ImageGrid from "@/components/model/image-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useApproveApplication,
  useGetApplication,
  useGetApplicationImages,
  useRejectApplication,
} from "@/hooks/queries/application";
import useSession from "@/hooks/use-session";
import dayjs from "dayjs";
import { ChevronLeft, CircleCheck, CircleX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import InfoField from "@/components/info-field";
import TalentTable from "@/components/model/talent-table";
import ExperienceTable from "@/components/model/experience-table";
import KeyValueItem from "@/components/key-value/key-value-item";

const CustomKeyValueItem = ({
  _key,
  value,
}: {
  _key: string;
  value: string | undefined | null | number;
}) => {
  return (
    <KeyValueItem hideWhenEmpty _key={_key} value={value} size="md" lineBreak />
  );
};

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const session = useSession();

  const { data: images, isLoading: isLoadingImages } = useGetApplicationImages({
    id,
    enabled: session.status === "authenticated",
  });

  const { data, isLoading } = useGetApplication({
    id,
    enabled: session.status === "authenticated",
  });

  const { mutate: reject } = useRejectApplication();

  const { mutate: approve } = useApproveApplication();

  if (isLoading || isLoadingImages || !data || !images) {
    return <Loader />;
  }

  return (
    <Container max="md" className="grid gap-4">
      <BreakcrumbSetter
        breadcrumbs={[
          { label: "Applications", href: "/admin/applications" },
          { label: data.name },
        ]}
      />
      <div className="gap-4 flex items-center ">
        <Button onClick={() => router.back()} variant={"outline"} size={"icon"}>
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
            <CustomKeyValueItem _key="Name" value={data.name} />
            <CustomKeyValueItem _key="Gender" value={data.gender} />
            <CustomKeyValueItem _key="Ethnicity" value={data.ethnicity} />
            <CustomKeyValueItem _key="Nationality" value={data.nationality} />
            <CustomKeyValueItem
              _key="Date of Birth"
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
            <CustomKeyValueItem _key="Email" value={data.email} />
            <CustomKeyValueItem _key="Phone Number" value={data.phoneNumber} />
            <CustomKeyValueItem _key="Line ID" value={data.lineId} />
            <CustomKeyValueItem _key="WeChat" value={data.wechat} />
            <CustomKeyValueItem _key="WhatsApp" value={data.whatsapp} />
            <CustomKeyValueItem _key="Instagram" value={data.instagram} />
            <CustomKeyValueItem _key="Facebook" value={data.facebook} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Measurements</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-3">
            <CustomKeyValueItem _key="Height" value={data.height} />
            <CustomKeyValueItem _key="Weight" value={data.weight} />
            <CustomKeyValueItem _key="Bust" value={data.bust} />
            <CustomKeyValueItem _key="Chest" value={data.chest} />
            <CustomKeyValueItem _key="Hips" value={data.hips} />
            <CustomKeyValueItem
              _key="Suite/Dress Size"
              value={data.suitDressSize}
            />
            <CustomKeyValueItem _key="Shoe Size" value={data.shoeSize} />
            <CustomKeyValueItem _key="Eye Color" value={data.eyeColor} />
            <CustomKeyValueItem _key="Hair Color" value={data.hairColor} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Talents</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-3">
            <TalentTable talents={data.talents || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experiences</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-3">
            <ExperienceTable experiences={data.experiences || []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>

          <CardContent className="">
            <ImageGrid images={images || []} />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
