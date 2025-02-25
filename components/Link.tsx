import { forwardRef } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";

type LinkProps = Omit<MuiLinkProps, "href"> & NextLinkProps;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  props,
  ref
) {
  const { href, ...muiProps } = props;

  return <MuiLink component={NextLink} href={href} ref={ref} {...muiProps} />;
});
