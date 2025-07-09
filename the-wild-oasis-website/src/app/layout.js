import Logo from "./_components/Logo";
import "@/app/_styles/globals.css";
import Navigation from "./_components/Navigation";

export const metadata = {
  title: {
    template: "%s / The Wild Oasis",
    default: "Welcome / The Wild Oasis",
  },
  description: "Created from Hristo Baldzhiyski",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-primary-950 text-primary-100 min-h-screen">
        <header>
          <Logo />
          <Navigation />
        </header>

        {children}
      </body>
    </html>
  );
}
