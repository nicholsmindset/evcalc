export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Minimal layout — no header/footer for iframe embedding
  return <>{children}</>;
}
