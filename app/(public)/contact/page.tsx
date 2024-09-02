"use client";

import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactFormAction } from "./_actions";
import { useFormState } from "react-dom";
import FormItem from "./_components/form-item";
import { Loader } from "lucide-react";

export default function Page() {
  const [state, formAction, pending] = useFormState(submitContactFormAction, {
    id: null,
    errors: {},
  });

  return (
    <Container max="sm">
      <h1 className="text-2xl font-semibold text-center">Contact Us</h1>
      <h2 className="text-muted-foreground text-sm text-center">
        Please feel free to contact us for any castings, bookings or any other
        inquiry.
      </h2>
      <form className="mt-6" action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormItem
              error={state.errors?.firstName}
              label="First Name"
              name="firstName"
              render={({ name }) => <Input name={name} />}
            />
            <FormItem
              error={state.errors?.lastName}
              label="Last Name"
              name="lastName"
              render={({ name }) => <Input name={name} />}
            />
            <FormItem
              error={state.errors?.email}
              label="Email"
              name="email"
              render={({ name }) => <Input name={name} />}
            />
            <FormItem
              error={state.errors?.phone}
              label="Phone Number"
              name="phone"
              render={({ name }) => <Input name={name} />}
            />
            <FormItem
              className="col-span-full"
              error={state.errors?.message}
              label="Message"
              name="message"
              render={({ name }) => <Textarea name={name} />}
            />
          </CardContent>
          <CardFooter>
            <Button className="ml-auto" disabled={pending}>
              Submit
              {pending && <Loader className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Container>
  );
}
