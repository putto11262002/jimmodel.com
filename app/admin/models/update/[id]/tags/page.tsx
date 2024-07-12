import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { upperFirst } from "lodash";

const tags = ["featured", "new"];

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <ToggleGroup className="justify-start gap-6" type={"multiple"}>
          {tags.map((tag) => (
            <ToggleGroupItem key={tag} value={tag}>
              {upperFirst(tag)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardContent>
      <CardFooter>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  );
}
