"use client";

import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Social from "./social";

interface Props {
  children: React.ReactNode;
  headerTitle: string;
  headerDesc?: string | React.ReactNode;
  buttonLabel?: string;
  buttonHref?: string;
  showSocial?: boolean;
}

const AuthCard = ({
  children,
  headerTitle,
  headerDesc,
  buttonLabel: bottomButtonLabel,
  buttonHref: bottomButtonHref,
  showSocial,
}: Props) => {
  return (
    <Card className="min-w-[320px] max-w-xl shadow-md">
      <CardHeader className="items-center justify-center">
        <Logo />
        <br />
        <br />
        <CardTitle>{headerTitle}</CardTitle>
        {headerDesc && <CardDescription>{headerDesc}</CardDescription>}
      </CardHeader>
      <CardContent>
        {showSocial && <Social />}
        {children}
      </CardContent>
      {bottomButtonHref && bottomButtonLabel && (
        <CardFooter className="justify-center">
          <Button variant="link" className="font-normal" size="sm" asChild>
            <Link href={bottomButtonHref}>{bottomButtonLabel}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AuthCard;
