import { Card } from "@/components/card";
import Container from "@/components/container";
import ModelCreateForm from "@/components/model/forms/model-create-form";
import { auth } from "@/config";
import permissions from "@/config/permission";

export default async function Page() {
  await auth({ permission: permissions.models.createModel });
  return (
    <Container max="md">
      <Card
        headerBorder
        title="Create Model"
        description="Create a new model record in the database"
      >
        <ModelCreateForm />
      </Card>
    </Container>
  );
}
