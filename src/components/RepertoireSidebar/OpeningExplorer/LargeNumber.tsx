import {
  prettifyLargeNumber,
  shortenLargeNumber,
} from "@/components/RepertoireSidebar/OpeningExplorer/utils.ts";

export const LargeNumber = ({ num }: { num: number }) => {
  const shortened = shortenLargeNumber(num);
  return <span title={prettifyLargeNumber(num)}>{shortened}</span>;
};
