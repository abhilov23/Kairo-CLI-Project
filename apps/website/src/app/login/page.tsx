import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — Kairo",
  description:
    "Sign in to your Kairo account. Your AI teammate in the terminal, across all your devices.",
  openGraph: {
    title: "Sign in — Kairo",
    description:
      "Sign in to your Kairo account. Your AI teammate in the terminal, across all your devices.",
    images: "/opengraph-image.png",
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
