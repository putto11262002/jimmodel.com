import { Badge } from "./ui/badge";
import { useToast as _useToast } from "./ui/use-toast";
export default function useToast() {
  const { toast } = _useToast();
  function error(message: string) {
    toast({
      description: (
        <div className="space-y-3">
          <Badge
            variant={"outline"}
            className="bg-red-100 text-red-800 dark:bg-red-100 dark:text-red-800"
          >
            Error
          </Badge>
          <p>{message}</p>
        </div>
      ),
    });
  }
  function ok(message: string) {
    toast({
      description: (
        <div className="space-y-3">
          <Badge
            variant={"outline"}
            className="bg-green-100 text-green-800 dark:bg-green-100 dark:text-green-800"
          >
            Ok
          </Badge>
          <p>{message}</p>
        </div>
      ),
    });
  }
  return { ok, error };
}
