"use client";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { ContactMessagesGetFilter } from "@/lib/usecases/contact-message/inputs/get-contact-messages-filter";
import Form from "next/form";

export default function GetContactMessagesFilterForm({
  initialFilter,
}: {
  initialFilter: ContactMessagesGetFilter;
}) {
  return (
    <Form action={""} className="lg:flex lg:items-end grid gap-2">
      <SelectFormItem
        size="sm"
        className="min-w-28"
        name="read"
        label="Read"
        options={[
          { label: "All", value: "all" },
          { label: "Read", value: "true" },
          { label: "Unread", value: "false" },
        ]}
        defaultValue={
          initialFilter.read === true
            ? "true"
            : initialFilter.read === false
            ? "false"
            : "all"
        }
      />
      <Button size="sm" type="submit" variant="outline">
        Show
      </Button>
      <input name="to" value={routes.admin.contactMessages.main} hidden />
    </Form>
  );
}
