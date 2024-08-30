"use client";
import Container from "@/components/container";
import ShowcaseGeneralForm from "./_components/showcase-general-form";
import { useGetShowcase } from "@/hooks/queries/showcase";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import Loader from "@/components/loader";
import CoverImageCard from "./_components/cover-image-card";
import ModelCard from "./_components/model-card";
import ShowcaseSettingForm from "./_components/setting-card";
import ShowcaseImageSection from "./_components/images-card";
import VideoLinkCard from "./_components/video-link-card";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const session = useSession(permissions.showcases.getShowcaseById);
  const { data, isSuccess } = useGetShowcase({
    id,
    enabled: session.status === "authenticated",
  });

  if (!isSuccess) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }
  return (
    <Container>
      <div className="grid grid-cols-1  md:grid-cols-3 gap-4 ">
        <div className="md:col-span-2 grid gap-4 auto-rows-max">
          <ShowcaseGeneralForm showcase={data} />
          <ModelCard showcase={data} />
          <ShowcaseImageSection showcase={data} />
        </div>
        <div className="grid gap-4 md:auto-rows-max min-w-0">
          <ShowcaseSettingForm showcase={data} />
          <div className="min-w-0">
            <VideoLinkCard showcase={data} />
          </div>
          <CoverImageCard showcase={data} />
        </div>
      </div>
    </Container>
  );
}
