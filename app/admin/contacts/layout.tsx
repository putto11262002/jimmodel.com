import ViewContactMessageProvider from "./_components/view-contact-message";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ViewContactMessageProvider>{children}</ViewContactMessageProvider>;
}
