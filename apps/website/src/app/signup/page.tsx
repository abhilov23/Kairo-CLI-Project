import type { Metadata } from "next";
import SignupForm from "./signup-form";

export const metadata: Metadata = {
  title: "Create account — Kairo",
  description:
    "Create your Kairo account and get your AI teammate in the terminal. Start shipping faster today.",
  openGraph: {
    title: "Create account — Kairo",
    description:
      "Create your Kairo account and get your AI teammate in the terminal. Start shipping faster today.",
    images: "/opengraph-image.png",
  },
};

export default function SignupPage() {
  return <SignupForm />;
}
