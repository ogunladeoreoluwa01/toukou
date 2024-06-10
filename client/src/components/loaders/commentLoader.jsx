import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const CommentLoader = ({ right }) => {
  const [dynamicStyle, setDynamicStyle] = useState("place-content-start");

  useEffect(() => {
    if (!right) {
      setDynamicStyle("place-content-end");
    } else {
      setDynamicStyle("place-content-start");
    }
  }, [right]);

  return (
    <div className={`flex items-center space-x-3 p-2 ${dynamicStyle}`}>
      <div className="space-x-2">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};

export default CommentLoader;
