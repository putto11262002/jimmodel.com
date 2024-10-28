import ApplicationDropdownMenu from "@/components/application/application-dropdown-menu";
import ApplicationImageGallery from "@/components/application/application-image-gallery";
import ApplicationStatusBadge from "@/components/application/application-status-badge";
import ApproveApplcationForm from "@/components/application/forms/approve-application-form";
import RejectApplcationForm from "@/components/application/forms/reject-application-form";
import ApplicationExperienceTable from "@/components/application/tables/application-experience-table";
import { Card } from "@/components/card";
import Container from "@/components/container";
import LabelValueItem from "@/components/key-value/key-value-item";
import { DataList } from "@/components/list";
import AsyncButton from "@/components/shared/buttons/async-button";
import Header, { HeaderBreadcrumb } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { auth } from "@/config";
import permissions from "@/config/permission";
import routes from "@/config/routes";
import { APPLICATION_STATUS } from "@/db/constants";
import {
  getApplication,
  getApplicationExperiences,
  getApplicationImages,
} from "@/loaders/application";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { notFound } from "next/navigation";

const breadcrumb = ({
  id,
  name,
}: {
  id: string;
  name: string;
}): HeaderBreadcrumb[] => [
  {
    label: "Admin",
    href: routes.admin.main,
  },
  {
    label: "Applications",
    href: routes.admin.applications.main,
  },
  {
    label: name,
    href: routes.admin.applications["[id]"].main({ id }),
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth({ permission: permissions.applications.getApplicationById });
  const { id } = await params;
  const application = await getApplication(id);
  if (!application) {
    return notFound();
  }
  const [experiences, images] = await Promise.all([
    getApplicationExperiences(id),
    getApplicationImages(id),
  ]);

  return (
    <>
      <Header
        breadcrumb={breadcrumb({
          id: application.id,
          name: application.name!,
        })}
      />
      <Container max="lg" className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">
              {application.name}&apos; Application
            </h1>

            <ApplicationStatusBadge status={application.status} />
          </div>
          <ApplicationDropdownMenu
            trigger={
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="icon-md" />
              </Button>
            }
            application={application}
          />
        </div>
        <Card title="General" headerBorder>
          <div className="grid gap-4">
            <LabelValueItem
              line="break"
              label="Name:"
              value={application.name}
            />
            <LabelValueItem
              line="break"
              label="Date Of Birth:"
              value={format(application.dateOfBirth!, "yyyy-MM-dd")}
            />
            <LabelValueItem
              line="break"
              label="Gender:"
              value={application.gender}
            />
            <LabelValueItem
              line="break"
              label="Nationality:"
              value={application.nationality}
            />
            <LabelValueItem
              line="break"
              label="Ethnicity:"
              value={application.ethnicity}
            />
            <LabelValueItem
              line="break"
              label="About Me:"
              value={application.aboutMe}
            />
          </div>
        </Card>
        <Card title="Contact" headerBorder>
          <div className="grid gap-4">
            <LabelValueItem
              line="break"
              label="Phone Number:"
              value={application.phoneNumber}
            />
            <LabelValueItem
              line="break"
              label="Email:"
              value={application.email}
            />
            <LabelValueItem
              line="break"
              label="Line ID:"
              value={application.lineId}
            />
            <LabelValueItem
              line="break"
              label="WeChat:"
              value={application.wechat}
            />
            <LabelValueItem
              line="break"
              label="WhatsApp:"
              value={application.whatsapp}
            />
            <LabelValueItem
              line="break"
              label="Facebook:"
              value={application.facebook}
            />
            <LabelValueItem
              line="break"
              label="Instagram:"
              value={application.instagram}
            />
          </div>
        </Card>

        <Card title="Address" headerBorder>
          <div className="grid gap-4">
            <LabelValueItem
              line="break"
              label="Address:"
              value={application.address}
            />
            <LabelValueItem
              line="break"
              label="City:"
              value={application.city}
            />
            <LabelValueItem
              line="break"
              label="Region/State:"
              value={application.region}
            />
            <LabelValueItem
              line="break"
              label="Zip Code:"
              value={application.zipCode}
            />
            <LabelValueItem
              line="break"
              label="Country:"
              value={application.country}
            />
          </div>
        </Card>

        <Card title="Measurements" headerBorder>
          <div className="grid gap-4">
            <LabelValueItem
              line="break"
              label="Height:"
              value={application.height}
            />
            <LabelValueItem
              line="break"
              label="Weight:"
              value={application.weight}
            />
            <LabelValueItem
              line="break"
              label="Bust:"
              value={application.bust}
            />
            <LabelValueItem
              line="break"
              label="Chest:"
              value={application.bust}
            />
            <LabelValueItem
              line="break"
              label="Hips:"
              value={application.hips}
            />

            <LabelValueItem
              line="break"
              label="Shoe Size:"
              value={application.shoeSize}
            />

            <LabelValueItem
              line="break"
              label="Eye Color:"
              value={application.eyeColor}
            />

            <LabelValueItem
              line="break"
              label="Hair Color:"
              value={application.hairColor}
            />
          </div>
        </Card>

        <Card title="Talents" headerBorder>
          <DataList
            data={application.talents || []}
            renderItem={(item) => item}
          />
        </Card>

        <Card title="Experiences" headerBorder>
          <ApplicationExperienceTable experiences={experiences} />
        </Card>

        <Card title="Images" headerBorder>
          {images.length > 0 ? (
            <ApplicationImageGallery images={images} />
          ) : (
            <div className="h-28 text-muted-foreground text-sm flex justify-center items-center">
              No images
            </div>
          )}
        </Card>
      </Container>
    </>
  );
}
