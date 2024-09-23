"use client";
import { Card } from "@/components/card";
import Container from "@/components/container";
import UserCreateForm from "@/components/user/forms/user-create-form";

export default function Page() {
  return (
    <Container max="md" className="grid gap-4">
      <Card
        headerBorder
        title={"Create User"}
        description={"Create a new user account."}
      >
        <UserCreateForm />
      </Card>
    </Container>
  );
}
