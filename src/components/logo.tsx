import Image from "next/image";

export const Logo = (props: { className?: string }) => {
  return (
    <Image
      src="/assets/logo.svg"
      alt="Logo"
      height={40}
      width={150}
      {...props}
    />
  );
};
