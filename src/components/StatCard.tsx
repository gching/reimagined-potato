import "twin.macro";
import Card from "./Card";

export default function StatCard({
  title,
  value,
  className = "",
}: {
  title: string;
  value: string;
  className?: string;
}): JSX.Element {
  return (
    <Card tw="flex justify-between" className={className}>
      <h3>{title}</h3>
      <p tw="ml-4">{value}</p>
    </Card>
  );
}
