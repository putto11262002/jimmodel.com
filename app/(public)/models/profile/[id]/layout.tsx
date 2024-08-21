import { GridImageGalleryProvider } from "@/components/image-grid-gallery";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GridImageGalleryProvider>{children}</GridImageGalleryProvider>;
}
