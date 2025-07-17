interface LayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: LayoutProps) {
  return <div className="min-h-screen flex items-center justify-center">{children}</div>;
}
