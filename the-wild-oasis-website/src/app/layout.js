import Logo from "./_components/Logo";
import "@/app/_styles/globals.css";
import Navigation from "./_components/Navigation";
import { Josefin_Sans } from "next/font/google";
import Header from "./_components/Header";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

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
      <body
        className={`${josefin.className} relative antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col`}
      >
        <Header />

        <div className="flex-1 px-8 py-12 ">
          <main className="max-w-7xl  mx-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
