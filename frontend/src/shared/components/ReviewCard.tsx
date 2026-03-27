import { Card, CardContent, CardHeader } from "./ui/card";
type ReviewCardProps = {
  initials: string;
  name: string;
  jobPosition: string;
  review: string;
};
export const ReviewCard = ({
  initials,
  name,
  jobPosition,
  review,
}: ReviewCardProps) => {
  return (
    <Card className="shadow-lg bg-white/80 backdrop-blur-lg border border-white/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <h3 className="text-cyan-700 text-lg bg-[#BCE7F3] px-2 py-1 ">
            {initials}
          </h3>
          <div>
            <h4 className="font-bold text-[12px]">{name}</h4>
            <p className="font-light text-[12px]">{jobPosition}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-[12px]">"{review}"</p>
      </CardContent>
    </Card>
  );
};
