import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface Props {
  code: string;
  appUrl: string;
  appName: string;
  expiration: number;
  companyName: string;
  companyAddr: string;
}

const VerifyOTPEmail = ({
  code,
  appUrl,
  expiration,
  companyName,
  companyAddr,
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>{code} is your verfication code</Preview>
      <Tailwind>
        <Body className="text-primary-foreground bg-gray-100 p-6 font-sans">
          <Container className="mx-auto max-w-[600px] rounded bg-white p-8">
            <Section className="mb-10">
              <Img
                src={`${appUrl}/assets/logo.svg`}
                width="140"
                height="30"
                alt="logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="text-xl font-bold">Verification Code</Heading>
            <Text>Enter the following verification code when prompted:</Text>
            <Text className="text-3xl font-black">{code}</Text>
            <Text className="font-bold">
              This code will expire in {expiration} minutes.
            </Text>
            <Text>
              To protect your account, do not share this code.
              <br />
              If you didn't request this email, please ignore it.
            </Text>
            <Section className="mt-10">
              <Hr />
              <Text className="text-center text-sm text-gray-500">
                © 2025 {companyName}. All rights reserved. <br /> {companyAddr}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyOTPEmail;

VerifyOTPEmail.PreviewProps = {
  code: "123456",
  appUrl: "http://localhost:3000",
  appName: "Acme",
  expiration: 1,
  companyName: "Acme. inc",
  companyAddr: "123 Main St, Anytown, ST 12345",
} as Props;
