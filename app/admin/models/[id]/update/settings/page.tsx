"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUpdateModel, useGetModel } from "@/hooks/queries/model";
import { useParams } from "next/navigation";
import FormSkeleton from "../form-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { modelCategories } from "@/lib/constants/model";
import { ModelCategory } from "@/lib/types/model";
import { upperFirst } from "lodash";

export default function _Page() {
  const { id } = useParams<{ id: string }>();
  const { data, isSuccess } = useGetModel({ modelId: id });
  const { mutate } = useUpdateModel();
  if (!isSuccess) {
    return <FormSkeleton />;
  }

  return (
    <div className="space-y-4">
      {data.active && (
        <Card>
          <CardHeader>
            <CardTitle>Bookings Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Local</Label>
                <Switch
                  className="block"
                  checked={Boolean(data.local)}
                  onCheckedChange={(local) =>
                    mutate({ modelId: id, input: { local } })
                  }
                />
              </div>

              {!data.local && (
                <div className="space-y-2">
                  <Label>In Town</Label>
                  <Switch
                    className="block"
                    checked={data!.inTown}
                    onCheckedChange={(inTown) =>
                      mutate({ modelId: id, input: { inTown } })
                    }
                  />
                </div>
              )}

              {!data.local && (
                <div className="space-y-4">
                  <Label>Direct Booking</Label>
                  <Switch
                    className="block"
                    checked={data!.directBooking}
                    onCheckedChange={(directBooking) =>
                      mutate({ modelId: id, input: { directBooking } })
                    }
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Visibility Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-4">
              <Label>Display Category</Label>
              <Select
                defaultValue={data.category}
                onValueChange={(category) =>
                  mutate({
                    modelId: id,
                    input: { category: category as ModelCategory },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelCategories.map((category, index) => (
                    <SelectItem key={index} value={category}>
                      {upperFirst(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {data.active && (
              <div className="space-y-4">
                <Label>Published</Label>
                <Switch
                  className="block"
                  checked={data!.published}
                  onCheckedChange={(published) =>
                    mutate({ modelId: id, input: { published } })
                  }
                />
              </div>
            )}

            <div className="space-y-4">
              <Label>Active</Label>
              <Switch
                className="block"
                checked={data!.active}
                onCheckedChange={(active) =>
                  mutate({ modelId: id, input: { active } })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
