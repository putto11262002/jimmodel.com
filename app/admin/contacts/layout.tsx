import { ContactMessagePreviewProvider } from "./_components/contect-message-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ContactMessagePreviewProvider>{children}</ContactMessagePreviewProvider>
  );
}
