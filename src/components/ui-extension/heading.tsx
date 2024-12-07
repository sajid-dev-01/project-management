import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
  /**
   * Html heading tag - default `h3`
   */
  tag?: Tag;
  /**
   * Html heading tag size
   */
  size?: Tag;
} & React.HTMLAttributes<HTMLHeadingElement>;

export const Heading: React.FC<React.PropsWithChildren<Props>> = ({
  tag = "h3",
  size,
  className,
  children,
}) => {
  const Tag = tag;
  const tagSize = size || tag;
  return (
    <Tag
      className={cn(
        "scroll-m-20 truncate font-semibold tracking-tight",
        {
          "text-4xl font-extrabold lg:text-5xl": tagSize === "h1",
          "text-3xl": tagSize === "h2",
          "text-2xl": tagSize === "h3",
          "text-xl": tagSize === "h4",
          "text-lg": tagSize === "h5",
          "text-md": tagSize === "h6",
        },
        className
      )}
    >
      {children}
    </Tag>
  );
};
